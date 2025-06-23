
export async function callGeminiVision(imageUrl: string): Promise<any> {
  const apiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
  
  if (!apiKey) {
    throw new Error('Google Gemini API key not configured');
  }

  // First, fetch the image to convert to base64
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error('Failed to fetch image for Gemini analysis');
  }
  
  const imageBuffer = await imageResponse.arrayBuffer();
  const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            text: generateGeminiClothingPrompt()
          },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', response.status, errorText);
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response from Gemini API');
  }

  return data.candidates[0].content.parts[0].text;
}

function generateGeminiClothingPrompt(): string {
  return `Analyze this clothing item image and provide a detailed JSON response with the following structure. Be precise and conservative with your confidence ratings.

CRITICAL ANALYSIS PRINCIPLES:
1. ONLY describe what you can CLEARLY see - avoid assumptions
2. If uncertain about any detail, mark it as "Unknown" or use lower confidence
3. Look at the ENTIRE garment structure, not just surface appearance
4. Consider the context and positioning of the item in the image
5. Be especially careful with similar-looking items (jacket vs shirt vs blazer)

Respond with ONLY valid JSON in this exact format:
{
  "name": "Turkish name with color and type (e.g., 'Bej Denim Ceket', 'Lacivert Polo Tişört')",
  "brand": "Brand name if clearly visible, otherwise 'Bilinmiyor'",
  "category": "Choose from: Tops, Bottoms, Outerwear, Dresses & Suits, Footwear, Accessories",
  "subcategory": "Specific item type (e.g., 'Denim Jacket', 'Blazer', 'T-Shirt', 'Polo Shirt', 'Jeans')",
  "primary_color": "Dominant color in English",
  "secondary_colors": ["Additional colors if clearly present"],
  "color_tone": "Light, Medium, or Dark",
  "pattern": "Solid, Striped, Checkered, Printed, Logo Print, or Graphic",
  "pattern_type": "Specific pattern details or null",
  "material": "Primary fabric if identifiable (Cotton, Denim, Wool, etc.)",
  "fit": "Slim, Regular, Relaxed, or Oversized",
  "collar": "Specific collar type or 'No Collar'",
  "sleeve": "Sleeve length and style",
  "neckline": "Neckline style",
  "design_details": ["Visible design elements as array"],
  "closure_type": "How the garment closes",
  "waist_style": "Waist style or null",
  "pocket_style": "Pocket style or 'Unknown'",
  "hem_style": "Hem style",
  "lapel_style": "Lapel style or null",
  "has_lining": false,
  "button_count": "Number or 'Unknown'",
  "accessories": [],
  "season_suitability": ["Appropriate seasons"],
  "occasions": ["Suitable occasions"],
  "image_description": "Detailed objective description of what you observe",
  "style_tags": ["Fashion style descriptors"],
  "confidence": 85
}

IMPORTANT: Return ONLY the JSON object, no other text or formatting.`;
}
