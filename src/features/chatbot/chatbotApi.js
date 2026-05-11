import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export const sendChatMessage = async (message) => {
  try {
    const res = await axios.post(`${BASE_URL}/chat`, {
      question: message, // ✅ must match FastAPI model
    });

    return res.data.response;

  } catch (error) {
    console.error("Chat API error:", error);
    return "⚠️ I couldn't connect to the server. Please try again.";
  }
};