import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { socket } from "./socket";
import "./LiveChatAdmin.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL_CONVERSATIONS = import.meta.env.VITE_API_URL.replace('/admin', '') + "/conversations";
const API_BASE_URL_FILES = import.meta.env.VITE_API_URL.replace('/admin', '') + "/files";

export default function LiveChatAdmin() {
  const [adminId, setAdminId] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = "/adminlogin";
      return;
    }

    // Decode JWT to get admin ID and data (simple base64 decode, adjust as needed)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Check if token is expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        window.location.hash = "/adminlogin";
        return;
      }
      
      setAdminId(payload.userId);
      setAdminEmail(payload.email || "");
      setAdminName(payload.name || "Admin");
    } catch (err) {
      console.error("Failed to decode token:", err);
      localStorage.removeItem("token");
      window.location.hash = "/adminlogin";
      return;
    }

    // Connect socket only if not already connected
    if (!socket.connected) {
      console.log("Connecting socket...");
      socket.connect();
    }
    
    // Don't disconnect on unmount - keep connection alive
    return () => {
      // Only disconnect if the component is being unmounted permanently
      // For now, keep the connection open
    };
  }, []);

  useEffect(() => {
    if (!adminId) return;

    // Fetch existing conversations when admin connects
    const fetchConversations = async () => {
      try {
        console.log("Fetching conversations...");
        const res = await axios.post(
          `${API_BASE_URL_CONVERSATIONS}/history`,
          { adminId }
        );
        console.log("Conversations loaded:", res.data.data);
        setConversations(res.data.data || []);
      } catch (err) {
        console.error("Failed to load conversations:", err);
      }
    };

    // Function to emit admin-join
    const handleAdminJoin = () => {
      console.log("Admin joining with ID:", adminId);
      socket.emit("admin-join", { adminId });
      setIsOnline(true);
      fetchConversations();
    };

    // If socket is already connected, join immediately
    if (socket.connected) {
      handleAdminJoin();
    } else {
      // Wait for socket to connect
      socket.once("connect", handleAdminJoin);
    }

    return () => {
      socket.off("connect", handleAdminJoin);
    };
  }, [adminId]);

  useEffect(() => {
    // Listen for new messages from guests
    socket.on("new-message", (data) => {
      if (data.conversationId) {
        // Always increment unread count for all messages
        setConversations((prev) => {
          const existing = prev.find((c) => c._id === data.conversationId);
          if (existing) {
            return prev.map((c) =>
              c._id === data.conversationId
                ? { 
                    ...c, 
                    lastMessage: data.message, 
                    updatedAt: new Date(),
                    unreadCount: (c.unreadCount || 0) + 1
                  }
                : c
            );
          } else {
            return [
              ...prev,
              {
                _id: data.conversationId,
                guestId: data.message.senderId,
                lastMessage: data.message,
                createdAt: new Date(),
                updatedAt: new Date(),
                unreadCount: 1
              }
            ];
          }
        });

        // If this message is for the selected conversation, add it to messages
        setSelectedConversation((current) => {
          if (current?._id === data.conversationId) {
            setMessages((prev) => [...prev, data.message]);
          }
          return current;
        });
      } else if (data.senderType === "guest") {
        // Direct message object
        setSelectedConversation((current) => {
          if (current?._id === data.conversationId || current?.guestId === data.senderId) {
            setMessages((prev) => [...prev, data]);
          }
          return current;
        });
      }
    });

    socket.on("admin-response", (data) => {
      setSelectedConversation((current) => {
        if (current?._id === data.conversationId) {
          setMessages((prev) => [...prev, data]);
        }
        return current;
      });
    });

    // Listen when another admin marks a conversation as read
    socket.on("conversation-read", (data) => {
      console.log("Received conversation-read for:", data.conversationId);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === data.conversationId ? { ...c, unreadCount: 0 } : c
        )
      );
    });

    // Listen for socket connection events to track online status
    socket.on("connect", () => {
      console.log("Socket connected, setting online to true");
      setIsOnline(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected, setting online to false");
      setIsOnline(false);
    });

    return () => {
      socket.off("new-message");
      socket.off("admin-response");
      socket.off("conversation-read");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    console.log("Conversations state updated:", conversations);
  }, [conversations]);

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setAttachments([]);
    
    // Fetch message history for this conversation
    try {
      const res = await axios.get(
        `${API_BASE_URL_CONVERSATIONS}/messages/${conversation._id}`
      );
      setMessages(res.data.data || []);
      
      // Get the CURRENT unread count from state (not from the clicked object which might be stale)
      setConversations((prevConversations) => {
        const currentConversation = prevConversations.find(c => c._id === conversation._id);
        
        // Clear unread count ONLY if THIS conversation has unread messages
        if (currentConversation && currentConversation.unreadCount > 0) {
          // Notify other admins that this conversation has been read
          socket.emit("conversation-read", {
            conversationId: conversation._id,
            adminId: adminId
          });
          
          // Return updated conversations with unread cleared
          return prevConversations.map((c) =>
            c._id === conversation._id ? { ...c, unreadCount: 0 } : c
          );
        }
        
        // Return unchanged if no unread messages
        return prevConversations;
      });
    } catch (err) {
      console.error("Failed to load messages:", err);
      setMessages([]);
    }
  };

  const getUnreadCount = (conversation) => {
    // Count guest messages that weren't seen
    const unread = conversation.messages?.filter(
      (msg) => msg.senderType === "guest" && !msg.seen
    ).length || 0;
    return unread;
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      setAttachments((prev) => [...prev, { file, name: file.name, type: file.type }]);
    });
    e.target.value = "";
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return;
    if (!selectedConversation) return;

    if (attachments.length > 0) {
      // Upload each file
      for (const attachment of attachments) {
        const formData = new FormData();
        formData.append("file", attachment.file);

        try {
          const res = await axios.post(`${API_BASE_URL_FILES}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });

          const message = {
            conversationId: selectedConversation._id,
            adminId,
            content: res.data.file.url,
            fileName: res.data.file.name,
            fileSize: res.data.file.size,
            messageType: attachment.type.startsWith("image/") ? "image" : "document",
            senderType: "admin"
          };
          socket.emit("admin-message", message);
          setMessages((prev) => [
            ...prev,
            {
              ...message,
              createdAt: new Date()
            }
          ]);
        } catch (err) {
          console.error("File upload error:", err);
        }
      }
      setAttachments([]);
    }

    if (input.trim()) {
      const message = {
        conversationId: selectedConversation._id,
        adminId,
        content: input,
        messageType: "text",
        senderType: "admin"
      };

      socket.emit("admin-message", message);
      setMessages((prev) => [
        ...prev,
        { ...message, createdAt: new Date() }
      ]);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    socket.disconnect();
    window.location.hash = "/adminlogin";
  };

  const closeChat = () => {
    // Just deselect conversation, don't close it
    setSelectedConversation(null);
    setMessages([]);
  };

  return (
    <div className="chat-admin-page">
      {/* Top App Bar */}
      <div className="app-bar">
        <div className="logo">
          <div className="logo-icon">💬</div>
          <span>ChatHub</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginLeft: "auto" }}>
          <div style={{ textAlign: "right", display: "flex", flexDirection: "column" }}>
            <div style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "14px" }}>{adminName}</div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{adminEmail}</div>
          </div>
          <span className="status-pill" style={{ margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: isOnline ? "var(--accent-color)" : "var(--danger-color)", display: "inline-block" }}></span>
            {isOnline ? "Online" : "Offline"}
          </span>
          <button className="logout-btn" onClick={handleLogout} title="Logout">🚪</button>
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
        {/* Conversations List */}
        <div style={{
          width: "300px",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
          backgroundColor: "#f5f5f5"
        }}>
          <div style={{ padding: "15px", fontWeight: "bold", borderBottom: "1px solid #ddd" }}>
            Conversations ({conversations.length})
          </div>
          {conversations.length === 0 ? (
            <div style={{ padding: "15px", textAlign: "center", color: "#999" }}>
              No conversations yet
            </div>
          ) : (
            conversations
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
              .map((conv) => (
                <div
                  key={conv._id}
                  onClick={() => selectConversation(conv)}
                  style={{
                    padding: "12px 15px",
                    borderBottom: "1px solid #e0e0e0",
                    cursor: "pointer",
                    backgroundColor: selectedConversation?._id === conv._id ? "#e3f2fd" : "white",
                    borderLeft: selectedConversation?._id === conv._id ? "4px solid #2196F3" : "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "500", display: "flex", gap: "8px", alignItems: "center", color: "#333" }}>
                      <span>Guest: {conv.guestId.substr(0, 10)}...</span>
                      {conv.unreadCount > 0 && (
                        <span style={{
                          backgroundColor: "var(--accent-color)",
                          color: "white",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "bold"
                        }}>
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                      {conv.lastMessage?.content?.substr(0, 30)}...
                    </div>
                    <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
                      {new Date(conv.updatedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Chat Header */}
            <div className="chat-head">
              <div>
                <span className="chat-id">Guest: {selectedConversation.guestId.substr(0, 15)}...</span>
                <span className="status-pill">Active</span>
              </div>
            </div>

            {/* Messages */}
            <div className="conversation" style={{
              flex: 1,
              overflowY: "auto",
              padding: "15px",
              display: "flex",
              flexDirection: "column"
            }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", color: "#999", marginTop: "50px" }}>
                  No messages yet. Waiting for guest messages...
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`msg-row ${msg.senderType === "admin" ? "left" : "right"}`}>
                    <div className={`msg-bubble ${msg.senderType === "admin" ? "admin" : "guest"}`}>
                      {msg.messageType === "text" && (
                        <div className="msg-text">{msg.content}</div>
                      )}
                      {msg.messageType === "image" && (
                        <div style={{ maxWidth: "250px" }}>
                          <img
                            src={msg.content}
                            alt="Sent image"
                            style={{
                              maxWidth: "100%",
                              borderRadius: "8px",
                              marginBottom: "8px"
                            }}
                            onError={(e) => {
                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect fill='%23ddd' width='200' height='150'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3EImage not found%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          {msg.fileName && <div style={{ fontSize: "12px", color: "#666" }}>{msg.fileName}</div>}
                        </div>
                      )}
                      {msg.messageType === "document" && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "20px" }}>📄</span>
                          <a
                            href={msg.content}
                            download={msg.fileName}
                            style={{
                              color: "#2196F3",
                              textDecoration: "none",
                              fontSize: "14px"
                            }}
                          >
                            {msg.fileName || "Download"}
                          </a>
                          {msg.fileSize && (
                            <span style={{ fontSize: "12px", color: "#999" }}>
                              ({(msg.fileSize / 1024).toFixed(2)} KB)
                            </span>
                          )}
                        </div>
                      )}
                      <div className="msg-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div style={{
                padding: "10px 15px",
                borderTop: "1px solid #e0e0e0",
                backgroundColor: "#f9f9f9",
                maxHeight: "100px",
                overflowY: "auto"
              }}>
                <div style={{ fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>
                  Attachments ({attachments.length}):
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {attachments.map((att, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "6px 10px",
                        backgroundColor: "#e3f2fd",
                        borderRadius: "6px",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <span>{att.type.startsWith("image/") ? "🖼️" : "📄"} {att.name}</span>
                      <button
                        onClick={() => removeAttachment(idx)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px"
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message Composer */}
            <div className="guest-composer">
              <input
                type="text"
                className="composer-input"
                placeholder="Type your response..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                style={{ display: "none" }}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              />
              <button
                className="icon-btn"
                aria-label="attach"
                onClick={() => fileInputRef.current?.click()}
                title="Attach files"
              >
                📎
              </button>
              <button 
                className="send-btn" 
                onClick={sendMessage}
                aria-label="send"
              >
                ➤
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999"
          }}>
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}