import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY || 'demo-key', // Use environment variable
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

export const generateMemeCaption = async (templateName, keyword) => {
  try {
    const prompt = `Generate 5 funny and viral meme captions for the "${templateName}" meme template about "${keyword}". 
    Make them relatable, witty, and suitable for social media. Each caption should be different in style:
    1. Relatable everyday situation
    2. Self-deprecating humor
    3. Current trend reference
    4. Exaggerated reaction
    5. Ironic observation
    
    Return only the captions, one per line, without numbering.`

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are a creative meme caption generator. Create funny, viral, and relatable captions that would perform well on social media platforms."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.9,
    })

    const captions = completion.choices[0].message.content
      .trim()
      .split('\n')
      .filter(caption => caption.trim().length > 0)
      .map(caption => caption.replace(/^\d+\.\s*/, '').trim())

    return captions.length > 0 ? captions : getFallbackCaptions(templateName, keyword)
  } catch (error) {
    console.error('Error generating captions:', error)
    return getFallbackCaptions(templateName, keyword)
  }
}

const getFallbackCaptions = (templateName, keyword) => {
  const fallbacks = {
    'Distracted Boyfriend': [
      `Me looking at ${keyword} instead of my responsibilities`,
      `${keyword}: Expectation vs Reality`,
      `When ${keyword} hits different`,
      `Choosing ${keyword} over everything else`,
      `${keyword} got me acting up`
    ],
    'Drake Pointing': [
      `Regular ${keyword} vs Premium ${keyword}`,
      `${keyword} at home vs ${keyword} at work`,
      `Avoiding ${keyword} vs Embracing ${keyword}`,
      `Free ${keyword} vs Paid ${keyword}`,
      `${keyword} before coffee vs after coffee`
    ],
    'Expanding Brain': [
      `Level 1: Basic ${keyword}`,
      `Level 2: Advanced ${keyword}`,
      `Level 3: Expert ${keyword}`,
      `Level 4: Galaxy brain ${keyword}`,
      `Level 5: Transcendent ${keyword}`
    ]
  }

  return fallbacks[templateName] || [
    `When ${keyword} hits different`,
    `Me trying to understand ${keyword}`,
    `${keyword}: Expectation vs Reality`,
    `POV: You're dealing with ${keyword}`,
    `${keyword} be like...`
  ]
}