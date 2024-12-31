import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction : ``
});

export const generateResult = async (prompt) => {
    
  const result = await model.generateContent(prompt);

  return result.response.text()

};
