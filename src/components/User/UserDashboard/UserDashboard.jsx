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
} from "../UserServices/UserServices";
import { ResizableComponent } from "../ResizableComponent";
import { Header } from "./Header";
import { toast } from "react-toastify";
import Loading from "../../CommonComponent/Loading/Loading";
const UserDashboard = () => {
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
  console.log(staticData, "staticData");

  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [customerData, setCustomerData] = useState(null);

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
      const [res, data] = await Promise.all([ShowAllHistory()]);
      console.log(res, "data1111");

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
    if (!message) return;
    setChatInput2("");
    setFileError(false);

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMsg = {
      sender: "user",
      text: message,
      timestamp,
    };
    setChatMessages2((prev) => [...prev, userMsg]);
    setLoadingBot(true);
    const payload = {
      sender: "user",
      file_id: selected,
      question: message,
      timestamp,
    };
    try {
      const res = await ChatWithFile(payload);
      const botMsg = {
        sender: "bot",
        text: res.answer,
        query_type: res.query_type,
        timestamp,
      };
      setChatMessages2((prev) => [...prev, botMsg]);
      setLoadingBot(false);
    } catch (err) {
      setLoadingBot(false);

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

  useEffect(() => {
    const fetchHistory = async () => {
      try {
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
      <div style={{ width: "100%" }}>
        <div
          className="back"
          id="toggleSidebar"
          onClick={handleResizableChange}
        >
          {sidebarHidden ? <FaChevronRight /> : <FaChevronLeft />}
        </div>

        {resizableChange && (
          <ResizableComponent extraStyles={{ top: "0px" }}>
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
      </div>
      {isloading && <Loading />}

      <div className="content-wrapper">
        <div className="back02" onClick={toggleLeftSidebar}>
          {leftSidebarOpen ? <FaBars /> : <FaBars />}
        </div>

        <div className={`left-panel ${leftSidebarOpen ? "open" : "closed"}`}>
          <h3 className="rp-title">Customer Details</h3>
          <div className="rp-card">
            <div className="customer-details">
              <div className="detail-row">
                <strong>Name:</strong>{" "}
                <span>
                  {staticData?.customer_details?.customer_name || "N/A"}
                </span>
              </div>

              <div className="detail-row">
                <strong>Email:</strong>{" "}
                <span>
                  {staticData?.customer_details?.email
                    ? staticData.customer_details.email.length > 20
                      ? `${staticData.customer_details.email.slice(0, 20)}...`
                      : staticData.customer_details.email
                    : "N/A"}
                </span>
              </div>

              <div className="detail-row">
                <strong>Account ID:</strong>{" "}
                <span>{staticData?.customer_details?.account_id || "N/A"}</span>
              </div>
            </div>
          </div>

          <h3 className="rp-title">Services</h3>
          <div className="rp-card">
            {staticData?.customer_details?.services?.length > 0 ? (
              <ul className="service-list">
                {staticData.customer_details.services.map((service, i) => (
                  <li key={i}>• {service}</li>
                ))}
              </ul>
            ) : (
              <p className="no-history">No services found</p>
            )}
          </div>

          <h3 className="rp-title">Active Issues</h3>
          <div className="rp-card">
            {staticData?.customer_details?.issues?.length > 0 ? (
              staticData.customer_details.issues.map((issue, i) => (
                <div key={i} className="rp-issue-block">
                  <p>
                    <strong>Reason:</strong> {issue.reason}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span className={`{issue.status}`}>
                      {issue.status.charAt(0).toUpperCase() +
                        issue.status.slice(1)}
                    </span>
                  </p>
                  <p>
                    <strong>Start:</strong>{" "}
                    {new Date(issue.startTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>End:</strong>{" "}
                    {issue.endTime
                      ? new Date(issue.endTime).toLocaleString()
                      : "Ongoing"}
                  </p>
                </div>
              ))
            ) : (
              <p className="no-history">No active issues</p>
            )}
          </div>

          <h3 className="rp-title">Restrictions</h3>
          <div className="rp-card">
            {staticData?.customer_details?.restrictions?.length > 0 ? (
              staticData.customer_details.restrictions.map((item, i) => (
                <div key={i} className="rp-restriction-block">
                  <p>
                    <strong>Type:</strong> {item.type.replace(/_/g, " ")}
                  </p>
                  <p>
                    <strong>Description:</strong> {item.description}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(item.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>End Date:</strong>{" "}
                    {item.endDate
                      ? new Date(item.endDate).toLocaleDateString()
                      : "No end date"}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={` ${item.isActive ? "active" : "inactive"}`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <p className="no-history">No restrictions applied</p>
            )}
          </div>

          <h3 className="rp-title">Recent Transactions</h3>
          <div className="rp-transactions">
            {staticData?.customer_details?.transactions?.length > 0 ? (
              staticData.customer_details.transactions
                .slice(0, 4)
                .map((txn, i) => (
                  <div key={i} className="rp-transaction-card">
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(txn.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Type:</strong>{" "}
                      {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                    </p>
                    <p>
                      <strong>Amount:</strong>{" "}
                      <strong
                        style={{
                          color: "#000",
                        }}
                      >
                        {txn.currency} {txn.amount.toFixed(2)}
                      </strong>
                    </p>
                    {txn.notes && (
                      <p className="txn-note">
                        <em>{txn.notes}</em>
                      </p>
                    )}
                  </div>
                ))
            ) : (
              <p className="no-history">No transactions found</p>
            )}
          </div>

          <h3 className="rp-title">Standard Resolution Steps</h3>
          <ul className="rp-steps">
            {staticData?.customer_details?.resolution_steps?.map(
              (step, idx) => (
                <li key={idx}>{step}</li>
              )
            )}
          </ul>
        </div>

        <div
          className={`main ${sidebarHidden ? "fullwidth" : ""}`}
          id="main-content"
        >
          <h1>
            {" "}
            <FaRobot className="me-2 " style={{ marginTop: "10px" }} />
            Live Chat Assistant
          </h1>

          <div className="chatbot-container">
            <div className="d-flex justify-content-between align-items-center mb-3"></div>

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
