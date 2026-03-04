const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // En stabil model: gemini-2.0-flash
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `Generate a new mobile app concept
  Aesthetic: "clean", minimalist, airy, use soft highlights.
  React Native SDK 54. 
  Output: Give really detailed app prompt for it design language and features. Make it really detailed.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(response.text().trim());
  } catch (error) {
    process.exit(1);
  }
}

run();
