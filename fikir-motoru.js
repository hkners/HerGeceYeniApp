const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${apiKey}`;
const prompt = `You are a creative app ideation engine. Generate a concept for a React Native mobile app. 
Focus on consumer apps.
Output ONLY the App Title and a brief 3-sentence description of the main feature. Do not include any code or pleasantries.`;

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
    const fikir = data.candidates[0].content.parts[0].text;
    console.log(fikir);
  })
  .catch(err => console.error(err));
