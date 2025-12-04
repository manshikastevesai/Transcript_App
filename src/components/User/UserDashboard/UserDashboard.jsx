import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import {
  FaChevronLeft,
  FaChevronRight,
  FaSyncAlt,
  FaEnvelope,
  FaBars,
  FaRobot,
} from "react-icons/fa";

import { IoMdSend } from "react-icons/io";
import { useAppContext } from "../../Context/AppContext";
import {
  ChatTwoSendMailConversation,
  ChatWithBot,
  ChatWithFile,
  ShowAllHistory,
  ShowFiles,
  userChatHistory,
} from "../UserServices/UserServices";

import { ResizableComponent } from "../ResizableComponent";
import { Header } from "./Header";
import { toast } from "react-toastify";
import Loading from "../../CommonComponent/Loading/Loading";

const UserDashboard = () => {
  const ws = useRef(null);
  const [messages, setMessages] = useState([]);

  const [customerLoaded, setCustomerLoaded] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [resizableChange, setResizableChange] = useState(true);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const { user, handleLogout } = useAppContext();

  const navigate = useNavigate();
  const [FileItem, setFileItem] = useState([]);
  const [selected, setSelected] = useState("");
  const [fileError, setFileError] = useState(false);
  const [loadingBot, setLoadingBot] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [loadingBotSideBar, setLoadingBotSideBar] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [staticData, setstaticData] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "Hello! How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);

  const chatWindowRef = useRef(null);

  const [chatInput2, setChatInput2] = useState("");
  const [chatMessages2, setChatMessages2] = useState([
    {
      sender: "bot",
      text: "Hello! How can I help you with the transcript?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const chatWindowRef2 = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (chatWindowRef2.current) {
      chatWindowRef2.current.scrollTop = chatWindowRef2.current.scrollHeight;
    }
  }, [chatMessages2]);

  useEffect(() => {
    const updateSidebarForViewport = () => {
      const isSmall = window.innerWidth < 900;
      setSidebarHidden(isSmall);
      setResizableChange(!isSmall);
    };
    updateSidebarForViewport();
    window.addEventListener("resize", updateSidebarForViewport);
    return () => window.removeEventListener("resize", updateSidebarForViewport);
  }, []);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const [res, data] = await Promise.all([ShowAllHistory(), ShowFiles()]);
      setFileItem(data?.files || []);
      setstaticData(res || {});
      setHistoryData(res?.chat_history || []);
      setCustomerLoaded(true);
    } catch (error) {
      console.log("Error fetching files", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => setSidebarHidden((prev) => !prev);

  const handleResizableChange = () => {
    setResizableChange((prev) => !prev);
    setSidebarHidden((prev) => !prev);
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

  const handleChatBotTwo = async () => {
    const message = chatInput2.trim();

    if (!selected) {
      setFileError(true);
      return;
    }
    if (!message) return;

    setChatInput2("");
    setFileError(false);

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // 1. Add user message to UI
    const userMsg = {
      sender: "user",
      text: message,
      timestamp,
    };

    setChatMessages2((prev) => [...prev, userMsg]);

    // 2. Show loading until bot responds
    setLoadingBot(true);

    // 3. Send through WebSocket instead of API
    const payload = {
      sender: "user",
      file_id: selected,
      question: message,
      timestamp,
    };

    try {
      // send message to backend over WebSocket
      ws.current.send(JSON.stringify(payload));
    } catch (err) {
      setLoadingBot(false);

      // WS failed → show error message
      setChatMessages2((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Failed to send message.",
          timestamp,
        },
      ]);
    }
  };

  const handleSendEmail = async () => {
    if (!selected) return;
    setLoadingEmail(true);
    try {
      const payload = { file_id: selected };
      const res = await ChatTwoSendMailConversation(payload);
      console.log("Email sent successfully:", res);
      toast.success("Chat history sent to your email successfully");
    } catch (err) {
      console.log("Failed to send email:", err);
    } finally {
      setLoadingEmail(false);
    }
  };

  const toggleHistory = (fileId) => {
    setHistoryData((prev) =>
      prev.map((item) =>
        item.fileId === fileId
          ? { ...item, isCollapsed: !item.isCollapsed }
          : item
      )
    );
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
  const toggleLeftSidebar = () => {
    setLeftSidebarOpen((prev) => !prev);
  };

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("history", history);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);

        const data = await userChatHistory(user?.user_id);
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.user_id) {
      fetchHistory();
    }
  }, [user?.user_id]);
  return (
    <div style={{ width: "100%" }}>
      {/* right panel */}
      <>
        <div
          className="back"
          id="toggleSidebar"
          onClick={handleResizableChange}
        >
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
                  <div
                    className="chatbot-container"
                    style={{ marginTop: "15px" }}
                  >
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

                <div>
                  <h3>Send Summary Email</h3>
                  <button
                    disabled={loadingEmail || !customerLoaded || !selected}
                    onClick={handleSendEmail}
                  >
                    {loadingEmail ? (
                      <>
                        <FaSyncAlt className="spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <FaEnvelope /> Send Email to Customer
                      </>
                    )}
                  </button>
                </div>

                <div className="list-group list-group-flush">
                  <Link
                    to="#"
                    onClick={() => handleLogout()}
                    className="list-group-item list-group-item-action p-3"
                  >
                    <i className="bi bi-box-arrow-right me-2"></i> Log Out
                  </Link>
                </div>
              </div>
            </div>
          </ResizableComponent>
        )}
      </>
      {isloading && <Loading />}

      {/* <div
        className="back02"
        // id="toggleSidebar"
        // onClick={handleResizableChange}
      >
        <FaBars />
      </div> */}
      <div className="content-wrapper">
        <div className="back02" onClick={toggleLeftSidebar}>
          {leftSidebarOpen ? <FaBars /> : <FaBars />}
        </div>

        <div className={`left-panel ${leftSidebarOpen ? "open" : "closed"}`}>
          <h3 className="rp-title">Customer Details</h3>

          <div className="rp-card">
            <p>
              <strong>Name:</strong>{" "}
              {staticData?.customer_details?.customer_name}
            </p>
            <p>
              <strong>Email:</strong> {staticData?.customer_details?.email}
            </p>
            <p>
              <strong>Account:</strong>{" "}
              {staticData?.customer_details?.account_id}
            </p>
          </div>

          <h3 className="rp-title">History</h3>

          <div className="rp-history">
            {historyData.length === 0 ? (
              <p className="no-history">No history found</p>
            ) : (
              historyData.map((item) => (
                <div key={item.fileId} className="rp-history-item">
                  <div
                    className="rp-history-header"
                    onClick={() => toggleHistory(item.fileId)}
                  >
                    <span>{item.fileName}</span>
                    <span>{item.isCollapsed ? "▼" : "▲"}</span>
                  </div>

                  {!item.isCollapsed && (
                    <div className="rp-history-content">
                      {item.details.map((d, i) => (
                        <div key={i} className="rp-detail-block">
                          <div className="rp-question">
                            <p className="question-label">Question:</p>

                            <div className="rp-detail-title">
                              <ReactMarkdown>{d.title}</ReactMarkdown>
                            </div>
                          </div>

                          <div className="rp-answer">
                            <p className="question-label">Answer:</p>
                            <div className="rp-detail-desc">
                              <ReactMarkdown>{d.description}</ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* TRANSACTIONS */}
          <h3 className="rp-title">Transactions</h3>

          <div className="rp-transactions">
            {staticData?.customer_details?.transactions?.length > 0 ? (
              staticData.customer_details.transactions.map((txn, i) => (
                <div key={i} className="rp-transaction-card">
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(txn.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Type:</strong> {txn.type}
                  </p>
                  <p>
                    <strong>Amount:</strong> {txn.currency} {txn.amount}
                  </p>
                  <p>
                    <strong>Status:</strong> {txn.status}
                  </p>
                  {txn.notes && (
                    <p>
                      <strong>Notes:</strong> {txn.notes}
                    </p>
                  )}
                  <p>
                    <strong>Transaction ID:</strong> {txn.transactionId}
                  </p>
                </div>
              ))
            ) : (
              <p className="no-history">No transactions found</p>
            )}
          </div>

          <h3 className="rp-title">Resolution Steps</h3>

          <ul className="rp-steps">
            {staticData?.customer_details?.resolution_steps?.map(
              (step, idx) => (
                <li key={idx}>{step}</li>
              )
            )}
          </ul>
        </div>

        {/* center panel */}
        <div
          className={`main ${sidebarHidden ? "fullwidth" : ""}`}
          id="main-content"
        >
          <h1>
            {" "}
            <FaRobot className="me-2 " style={{ marginTop: "-10px" }} />
            Live Chat Assistant
          </h1>

          <div className="chatbot-container">
            <div className="d-flex justify-content-between align-items-center mb-3">
              {/* <div className="service-dropdown">
                <div
                  className="file-select-container"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <button
                    className={`service-btn ${fileError ? "blink-border" : ""}`}
                    onClick={() => setOpenDropdown(!openDropdown)}
                    style={{
                      border: fileError ? "2px solid red" : "1px solid #ccc",
                    }}
                  >
                    <span className="service-btn-text">
                      {FileItem.find((x) => x.file_id === selected)?.filename ||
                        "Select File"}
                    </span>
                    <span className="dropdown-arrow">
                      {openDropdown ? "▲" : "▼"}
                    </span>
                  </button>
                </div>

                <div className={`service-menu ${openDropdown ? "open" : ""}`}>
                  {FileItem.length > 0 ? (
                    FileItem.map((item) => (
                      <div
                        key={item.file_id}
                        className={`service-item ${
                          selected === item.file_id ? "selected" : ""
                        }`}
                        onClick={() => {
                          setSelected(item.file_id);
                          setOpenDropdown(false);
                          setFileError(false);
                          setChatMessages2([
                            {
                              sender: "bot",
                              text: "Hello! How can I help you with the transcript?",
                              timestamp: new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              }),
                            },
                          ]);
                        }}
                      >
                        {item.filename}
                      </div>
                    ))
                  ) : (
                    <div className="service-item no-file">
                      No file assigned for this user
                    </div>
                  )}
                </div>
              </div> */}
            </div>

            <Header />

            <div ref={chatWindowRef2} className="chatbot-2">
              {chatMessages2.map((msg, idx) => (
                <WhatsAppBubble msg={msg} key={idx} />
              ))}
              {loadingBot && (
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
                value={chatInput2}
                onChange={(e) => setChatInput2(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleChatBotTwo();
                  }
                }}
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
                onClick={handleChatBotTwo}
                disabled={loadingBot}
                style={{
                  cursor: loadingBot ? "not-allowed" : "pointer",
                  opacity: loadingBot ? 0.6 : 1,
                }}
              >
                <IoMdSend size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
