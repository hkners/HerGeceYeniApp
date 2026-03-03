const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${apiKey}`;

const prompt = `You are a creative app ideation engine. Generate a app with React Native mobile app. Use SDK 54.
Focus on consumer mobile apps. 
Design must follow "clean" aesthetic.
Output ONLY the App Title and a brief 3-sentence description of the main feature. Do not include any code or intro text.`;

const options = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }]
  })
};

fetch(url, options)
  .then(res => res.json())
  .then(data => {
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
      const result = data.candidates[0].content.parts[0].text;
      process.stdout.write(result.trim());
    } else {
      process.exit(1);
    }
  })
  .catch(err => {
    process.exit(1);
  });
