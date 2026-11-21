// serveless function to get key (trying)
export default function handler(req, res) {
    try {
      const key = process.env.STREAM_CHAT_KEY; // ✅ safe, not exposed in frontend
      if (!key) {
        return res.status(500).json({ error: "Stream Chat key not found" });
      }
  
      return res.status(200).json({ key });
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch Stream key" });
    }
  }
  
