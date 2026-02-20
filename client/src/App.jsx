import LiveChatGuest from "./LiveChatGuest";
import LiveChatAdmin from "./LiveChatAdmin";
import AdminLogin from "./AdminLogin";
import ForgotPassword from "./ForgotPassword";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const getRoute = () => window.location.hash.replace("#", "") || "/livechatadmin";
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const renderRoute = () => {
    switch (route) {
      case "/adminlogin":
        return <AdminLogin />;
      case "/forgot-password":
        return <ForgotPassword />;
      case "/livechatadmin":
        return <LiveChatAdmin />;
      case "/livechatguest":
        return <LiveChatGuest />;
      default:
        return <AdminLogin />;
    }
  };

  return (
    <>
      {route === "/adminlogin" || route === "/forgot-password" ? null : (
        <div className="top-nav">
          <div className="nav-brand">
            <div className="nav-logo">💬</div>
            <div className="nav-title">ChatHub</div>
          </div>
          <div className="links">
            <a
              href="#/adminlogin"
              className={`link ${route === "/adminlogin" ? "active" : ""}`}
            >
              Login
            </a>
            <a
              href="#/livechatadmin"
              className={`link ${route === "/livechatadmin" ? "active" : ""}`}
            >
              Admin
            </a>
            <a
              href="#/livechatguest"
              className={`link ${route === "/livechatguest" ? "active" : ""}`}
            >
              Guest
            </a>
          </div>
        </div>
      )}
      {renderRoute()}
    </>
  );
}

export default App;
