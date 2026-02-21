import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { socket } from "./socket";
import "./LiveChatGuest.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1/admin";
const API_BASE_URL_FILES = (import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1/admin").replace('/admin', '') + "/files";

export default function LiveChatGuest() {
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [guestId, setGuestId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😌", "😔", "😑", "😐", "😶", "🥱", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐", "😕", "😟", "🙁", "☹️", "😲", "😳", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥺", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🖤", "🤍", "🤎", "💔", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟", "🤘", "🤙", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🤜", "🤛"];

  const insertEmoji = (emoji) => {
    setInput(input + emoji);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    // Generate a unique guest ID for each tab/session
    // Use sessionStorage so each tab gets its own guest ID
    let id = sessionStorage.getItem("guestId");
    if (!id) {
      id = "guest_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
      sessionStorage.setItem("guestId", id);
    }
    setGuestId(id);

    // Connect socket
    socket.connect();
    setIsConnected(true);

    // Emit guest-join
    socket.emit("guest-join", { guestId: id });

    // Listen for messages and responses
    socket.on("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("admin-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("guest-join", { guestId: id });
    });

    return () => {
      socket.off("new-message");
      socket.off("admin-message");
      socket.off("disconnect");
      socket.off("connect");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    // Add text message immediately (optimistic update)
    if (input.trim()) {
      const textMessage = {
        guestId,
        content: input,
        messageType: "text",
        senderType: "guest",
        createdAt: new Date(),
        loading: false
      };
      setMessages((prev) => [...prev, textMessage]);
      socket.emit("guest-message", {
        guestId,
        content: input,
        messageType: "text"
      });
      setInput("");
    }

    // Handle file uploads separately and in parallel for speed
    if (attachments.length > 0) {
      const filesToUpload = attachments.map((att) => ({
        ...att,
        tempId: Math.random().toString(36).substr(2, 9) // Unique ID for tracking
      }));

      // Add all files to UI immediately with loading state
      setMessages((prev) => [
        ...prev,
        ...filesToUpload.map((file) => ({
          guestId,
          content: "",
          fileName: file.name,
          fileSize: file.file.size,
          messageType: file.type.startsWith("image/") ? "image" : "document",
          senderType: "guest",
          createdAt: new Date(),
          loading: true,
          tempId: file.tempId
        }))
      ]);

      // Upload all files in parallel (not sequential)
      const uploadPromises = filesToUpload.map(async (attachment) => {
        const formData = new FormData();
        formData.append("file", attachment.file);

        try {
          const res = await axios.post(`${API_BASE_URL_FILES}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });

          // Update this specific message
          setMessages((prev) =>
            prev.map((msg) =>
              msg.tempId === attachment.tempId
                ? {
                    ...msg,
                    content: res.data.file.url,
                    loading: false,
                    fileName: res.data.file.name,
                    fileSize: res.data.file.size
                  }
                : msg
            )
          );

          // Emit to server immediately after upload
          socket.emit("guest-message", {
            guestId,
            content: res.data.file.url,
            messageType: attachment.type.startsWith("image/") ? "image" : "document",
            fileName: res.data.file.name,
            fileSize: res.data.file.size
          });
        } catch (err) {
          console.error("File upload error:", err);
          // Remove failed message by tempId
          setMessages((prev) => prev.filter((msg) => msg.tempId !== attachment.tempId));
          setError("Failed to upload file");
        }
      });

      // Don't wait for uploads - continue immediately
      Promise.all(uploadPromises).catch(console.error);

      setAttachments([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="guest-page">
      <div className="guest-topbar">
        <span>Guest Chat Support</span>
        <span style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <span className="status-indicator" style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: isConnected ? "#4CAF50" : "#f44336",
            display: "inline-block"
          }}></span>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="guest-header">
        <div className="header-left">
          <div className="header-icon">💬</div>
          <div>
            <div className="header-title">ChatHub Support</div>
            <div className="header-subtitle">ID: {guestId.substr(0, 8)}</div>
          </div>
        </div>
        <div className="header-right">
          <span className="status-pill">{isConnected ? "Open" : "Offline"}</span>
        </div>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div style={{
          padding: "10px",
          backgroundColor: "var(--surface-light)",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
          maxHeight: "150px",
          overflowY: "auto"
        }}>
          {emojis.map((emoji, idx) => (
            <button
              key={idx}
              onClick={() => insertEmoji(emoji)}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                padding: "5px",
                borderRadius: "5px",
                transition: "background 0.2s",
                hover: { backgroundColor: "#e0e0e0" }
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#e0e0e0"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}      <div className="guest-conversation">
        {messages.length === 0 ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#999",
            fontSize: "14px"
          }}>
            Start a conversation by sending a message or file
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`msg-row ${msg.senderType === "guest" ? "right" : "left"}`}>
              <div className={`msg-bubble ${msg.senderType === "guest" ? "right-bubble" : "left-bubble"}`} style={{opacity: msg.loading ? 0.7 : 1}}>
                {msg.loading && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#666" }}>Uploading...</span>
                    <div style={{
                      display: "inline-block",
                      width: "16px",
                      height: "16px",
                      border: "2px solid #e0e0e0",
                      borderTop: "2px solid #2196F3",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite"
                    }}></div>
                  </div>
                )}
                {msg.messageType === "text" && (
                  <div className="msg-text">{msg.content}</div>
                )}
                {msg.messageType === "image" && (
                  <div style={{ maxWidth: "250px" }}>
                    {msg.loading && msg.content && (
                      // Show preview while uploading
                      <img
                        src={msg.content}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          borderRadius: "8px",
                          marginBottom: "8px",
                          opacity: 0.6
                        }}
                      />
                    )}
                    {!msg.loading && (
                      <img
                        src={msg.content}
                        alt="Shared image"
                        style={{
                          maxWidth: "100%",
                          borderRadius: "8px",
                          marginBottom: "8px"
                        }}
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect fill='%23ddd' width='200' height='150'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3EImage not found%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    )}
                    {msg.fileName && <div style={{ fontSize: "12px", color: "#666" }}>{msg.fileName}</div>}
                  </div>
                )}
                {msg.messageType === "document" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "20px" }}>📄</span>
                    <div>
                      <a
                        href={msg.content}
                        download={msg.fileName}
                        style={{
                          color: msg.loading ? "#ccc" : "#2196F3",
                          textDecoration: "none",
                          fontSize: "14px",
                          pointerEvents: msg.loading ? "none" : "auto"
                        }}
                      >
                        {msg.fileName || "Download"}
                      </a>
                      {msg.fileSize && (
                        <div style={{ fontSize: "12px", color: "#999" }}>
                          ({(msg.fileSize / 1024).toFixed(2)} KB)
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="msg-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
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

      <div className="guest-composer">
        <input
          type="text"
          className="composer-input"
          placeholder="Type your message here..."
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
        <button className="icon-btn" aria-label="emoji" title="Emoji" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          🙂
        </button>
        <button className="send-btn" aria-label="send" onClick={sendMessage}>
          ➤
        </button>
      </div>
    </div>
  );
}
