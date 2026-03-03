const apiKey = process.env.GEMINI_API_KEY;

// API Anahtarı kontrolü
if (!apiKey) {
  console.error("HATA: GEMINI_API_KEY bulunamadı. GitHub Secrets kısmını kontrol et.");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${apiKey}`;

const prompt = `You are a creative app ideation engine for ErsoyLabs. Generate a consumer app idea using React Native (SDK 54).
The aesthetic must be "clean": minimalist, airy, with soft highlights.
Output ONLY the App Title followed by a brief 3-sentence description of the main feature. Do not include any code, intro text, or markdown formatting.`;

const options = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }]
  })
};

fetch(url, options)
  .then(async (res) => {
    const data = await res.json();
    
    // API Hatası kontrolü
    if (data.error) {
      console.error("API Hatası Detayı:", JSON.stringify(data.error, null, 2));
      process.exit(1);
    }

    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
      const result = data.candidates[0].content.parts[0].text;
      process.stdout.write(result.trim());
    } else {
      console.error("API'den beklenen veri gelmedi. Yanıt:", JSON.stringify(data, null, 2));
      process.exit(1);
    }
  })
  .catch(err => {
    console.error("Bağlantı/Fetch Hatası:", err);
    process.exit(1);
  });
