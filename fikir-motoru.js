const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("Hata: GEMINI_API_KEY eksik!");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // En güncel ve hızlı model: gemini-2.0-flash
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });

  const prompt = `You are a creative agent for ErsoyLabs. Generate a new daily app idea.
  Aesthetic: "clean", minimalist, airy, soft colors.
  Output: A title and a 3-sentence description of the main feature.
  No code, no markdown, just plain text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    process.stdout.write(response.text().trim());
  } catch (error) {
    console.error("Üretim hatası:", error.message);
    process.exit(1);
  }
}

run();
