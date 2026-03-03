const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Önceki hatayı önlemek için: Eğer preview modeli çalışmazsa 'gemini-2.0-flash' deneyebilirsin
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `Generate a concept for a single-page React Native app (SDK 54). 
  Design: clean, minimalist, soft pastel tones. 
  Output: App Title and a 3-sentence description. No code.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    process.stdout.write(response.text().trim());
  } catch (error) {
    console.error("Fikir üretilirken hata oluştu:", error.message);
    process.exit(1);
  }
}

run();
