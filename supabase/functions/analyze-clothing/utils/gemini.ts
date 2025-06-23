
export async function callGeminiVision(imageUrl: string): Promise<string> {
  const apiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
  
  if (!apiKey) {
    throw new Error('Google Gemini API key not configured');
  }

  console.log('Starting Gemini analysis for image:', imageUrl);

  try {
    // Fetch the image with proper error handling
    console.log('Fetching image for Gemini analysis...');
    const imageResponse = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ClothingAnalyzer/1.0)'
      }
    });
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
    }
    
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    console.log('Image fetched, size:', imageArrayBuffer.byteLength);
    
    // Convert to base64 safely
    const uint8Array = new Uint8Array(imageArrayBuffer);
    const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
    const base64Image = btoa(binaryString);
    
    console.log('Image converted to base64, length:', base64Image.length);
    
    const requestBody = {
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
    };

    console.log('Making request to Gemini API...');
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response received, checking structure...');
    
    if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
      console.error('Invalid Gemini response - no candidates:', JSON.stringify(data, null, 2));
      throw new Error('Invalid response from Gemini API - no candidates found');
    }

    const candidate = data.candidates[0];
    if (!candidate.content || !candidate.content.parts || !Array.isArray(candidate.content.parts) || candidate.content.parts.length === 0) {
      console.error('Invalid Gemini response - no content parts:', JSON.stringify(candidate, null, 2));
      throw new Error('Invalid response from Gemini API - no content parts found');
    }

    const content = candidate.content.parts[0].text;
    if (!content || typeof content !== 'string') {
      console.error('Invalid Gemini response - no text content:', JSON.stringify(candidate.content.parts[0], null, 2));
      throw new Error('Invalid response from Gemini API - no text content found');
    }

    console.log('Gemini analysis completed successfully, content length:', content.length);
    return content;

  } catch (error) {
    console.error('Error in Gemini analysis:', error.message);
    console.error('Stack trace:', error.stack);
    throw new Error(`Gemini analysis failed: ${error.message}`);
  }
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
