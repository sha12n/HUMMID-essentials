// api/chat.js
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { prompt } = req.body;
    
    // This securely pulls your key from Vercel's Environment Variables
    // It is completely invisible to the frontend user.
    const apiKey = process.env.GEMINI_API_KEY;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [{ parts: [{ text: `You are HUMMID AI, a highly intelligent, minimalist tech assistant for HUMMID essentials. Answer briefly and professionally in a cyberpunk tech tone: ${prompt}` }] }] 
            })
        });

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text;
        
        // Send the AI's reply back to your frontend
        res.status(200).json({ text: reply });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to connect to Neural Net.' });
    }
}