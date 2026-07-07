import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "sensi-ai", // Unique app ID
  name: "Sensi-ai",
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});
