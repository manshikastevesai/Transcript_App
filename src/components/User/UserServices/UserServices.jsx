import axiosInstance from "../../Interceptor/Interceptor";

export const ChatWithBot = async (question) => {
  const res = await axiosInstance.post("/chat/chatbot", {
    question: question,
    namespace: "customer1",
  });
  return res.data;
};
export const ShowFiles = async () => {
  const res = await axiosInstance.get("/chat/my-files");
  return res.data;
};

export const ShowAllHistory = async () => {
  const res = await axiosInstance.get("/chat/dashboard");
  return res.data;
};
export const ChatWithFile = async (payload) => {
  const res = await axiosInstance.post("/chat/ask-question", payload);
  return res.data;
};
export const ChatTwoSendMailConversation = async (fileId) => {
  const res = await axiosInstance.post("/chat/send-chat-to-email", fileId);
  return res.data;
};

export const userChatHistory = async (id) => {
  const res = await axiosInstance.get(`/chat/historys/${id}`);
  return res.data;
};
