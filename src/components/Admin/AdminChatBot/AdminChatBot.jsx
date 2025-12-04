import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { IoMdSend } from "react-icons/io";
import { FaChevronLeft, FaChevronRight, FaRobot } from "react-icons/fa";
import Sidebar from "../../CommonComponent/SideBar/SideBar";
import Navbar from "../../CommonComponent/Navbar/Navbar";
import Loading from "../../CommonComponent/Loading/Loading";
import { ResizableComponent } from "../../User/ResizableComponent";
import { Header } from "../../User/UserDashboard/Header";
import { useAppContext } from "../../Context/AppContext";
import { GetChatHistory } from "../AdminServices/AdminServices";
import { toast } from "react-toastify";

const AdminChatBot = () => {
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [resizableChange, setResizableChange] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingBotSideBar, setLoadingBotSideBar] = useState(false);
  const { user } = useAppContext();

  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "Hello! How can I help you with the transcript?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const chatWindowRef = useRef(null);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleChatBotOne = async () => {
    const message = chatInput.trim();
    if (!message) return;
    setChatInput("");
    const userMsg = {
      sender: "user",
      text: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setLoadingBotSideBar(true);
    try {
      const res = await ChatWithBot(message);
      const botMsg = {
        sender: "bot",
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Failed to get response.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoadingBotSideBar(false);
    }
  };
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const showHistory = async (user_id) => {
    setIsLoading(true);
    try {
      const response = GetChatHistory(user_id);
      if (response) {
      }
    } catch (error) {
      toast.error(err || "Couldn't fetch old conversation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSend = async () => {
    const message = chatInput.trim();
    if (!message) return;
    setChatInput("");
    const userMsg = {
      sender: "user",
      text: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatLoading(true);
    try {
      // const res = await AdminChatWithFile(payload);

      const botMsg = {
        sender: "bot",
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Failed to get response.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };
  const WhatsAppBubble = ({ msg }) => (
    <div
      className={`userdashboard-bubble ${
        msg.sender === "user"
          ? "userdashboard-bubble-user"
          : "userdashboard-bubble-bot"
      }`}
    >
      <p className="name01">
        {msg.sender === "user"
          ? user?.name
            ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
            : "User"
          : "Agent"}
      </p>

      <ReactMarkdown>{msg.text}</ReactMarkdown>
      <div className="userdashboard-timestamp">{msg.timestamp}</div>
    </div>
  );
  const handleResizableChange = () => {
    setResizableChange((prev) => !prev);
    setSidebarHidden((prev) => !prev);
  };
  const Bubble = ({ msg }) => (
    <div
      className={`userdashboard-bubble ${
        msg.sender === "user"
          ? "userdashboard-bubble-user"
          : "userdashboard-bubble-bot"
      }`}
    >
      <p className="name01">{msg.sender === "user" ? "Admin" : "Agent"}</p>
      <ReactMarkdown>{msg.text}</ReactMarkdown>
      <div className="userdashboard-timestamp">{msg.timestamp}</div>
    </div>
  );

  return (
    <div id="wrapper" className={`d-flex ${isOpen ? "toggled" : ""}`}>
      {isLoading && <Loading />}
      <Sidebar isOpen={isOpen} />
      <Navbar onToggleSidebar={toggleSidebar} />

      <div className="adminchatbot-wrapper">
        <div className="adminchatbot-box">
          <h3>
            <FaRobot className="me-2" /> Chatbot Assistant
          </h3>

          <div className="adminchatbot-2" ref={chatWindowRef}>
            {chatMessages.map((msg, idx) => (
              <Bubble msg={msg} key={idx} />
            ))}

            {chatLoading && (
              <div className="userdashboard-bubble userdashboard-bubble-bot">
                <div className="bot-loading">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
          </div>

          <div className="main-sendbtn">
            <input
              type="text"
              placeholder="Type a message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
              style={{
                flex: 1,
                padding: "10px 14px",
                background: "#f6f6f6",
                borderRadius: "25px",
                border: "1px solid rgb(191 180 180)",
              }}
            />

            <button
              className="send-btn"
              onClick={handleChatSend}
              disabled={chatLoading}
            >
              <IoMdSend size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* <ResizableComponent /> */}
      <div className="back" id="toggleSidebar" onClick={handleResizableChange}>
        {sidebarHidden ? <FaChevronRight /> : <FaChevronLeft />}
      </div>
      {resizableChange && (
        <ResizableComponent>
          <div>
            <div className="sidebar " id="sidebar">
              <div>
                <h3 style={{ paddingTop: "26px", fontSize: "24px" }}>
                  Control Panel
                </h3>
                <div className="chatbot-container">
                  <h3 style={{ fontSize: "18px" }} className="mb-0">
                    Assistant Chat
                  </h3>
                  <br />
                  <div>
                    <Header />
                    <div className="chat-window-ref" ref={chatWindowRef}>
                      {chatMessages.map((msg, idx) => (
                        <WhatsAppBubble msg={msg} key={idx} />
                      ))}
                      {loadingBotSideBar && (
                        <div className="userdashboard-bubble userdashboard-bubble-bot">
                          <div className="bot-loading">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "#fff",

                      borderRadius: "10px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleChatBotOne();
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: "10px 14px",
                        background: "#fff",
                        borderRadius: "25px",
                        border: "1px solid rgb(191 180 180)",
                      }}
                    />

                    <button
                      onClick={handleChatBotOne}
                      disabled={loadingBotSideBar}
                      style={{
                        width: "auto",
                        borderRadius: "50%",
                        background: loadingBotSideBar
                          ? "rgba(2, 9, 53, 0.4)"
                          : "rgb(2, 9, 53)",
                        border: "none",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: loadingBotSideBar ? "not-allowed" : "pointer",
                      }}
                    >
                      <IoMdSend />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ResizableComponent>
      )}
    </div>
  );
};

export default AdminChatBot;
