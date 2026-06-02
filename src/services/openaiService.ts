// src/services/openaiService.ts
import { GoogleGenAI } from '@google/genai';

export interface BodyAnalysisResult {
  avatarDescription: string;
  bodyType: {
    name: string;
    englishName: string;
    description: string;
    characteristics: string[];
  };
  personalColor: {
    season: string;
    palette: string[];
    description: string;
    keywords: string[];
  };
  styleRecommendations: StyleCard[];
  silhouetteTips: string[];
  colorsTips: string[];
  avoidTips: string[];
  overallScore: number;
}

export interface StyleCard {
  title: string;
  style: string;
  description: string;
  items: string[];
  occasion: string;
  emoji: string;
  imagePrompt: string;
}

const SYSTEM_PROMPT = `You are a world-class personal stylist and fashion consultant with expertise in body type analysis and personal color theory.
You MUST respond with valid JSON only. Do not include any markdown, code blocks, or explanatory text outside the JSON.
Your entire response must be a single valid JSON object.`;

function getBodyDescription(gender: string, heightStr: string, weightStr: string): string {
  const height = parseFloat(heightStr);
  const weight = parseFloat(weightStr);
  
  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    return gender === 'female' ? 'female model' : gender === 'male' ? 'male model' : 'model';
  }

  const bmi = weight / Math.pow(height / 100, 2);
  const genderNoun = gender === 'female' ? 'female' : gender === 'male' ? 'male' : 'person';

  // 1. Extreme obesity (BMI >= 40)
  if (bmi >= 40) {
    return `extremely obese and very heavy, round plus-size ${genderNoun} with a very heavy and large round body build, thick waist and double chin`;
  }
  // 2. Obese (30 <= BMI < 40)
  if (bmi >= 30) {
    return `obese and heavy, large plus-size ${genderNoun} with a round body shape and thick waist`;
  }
  // 3. Overweight (25 <= BMI < 30)
  if (bmi >= 25) {
    return `chubby and curvy, overweight ${genderNoun} with a plump and soft body shape`;
  }
  // 4. Normal weight (18.5 <= BMI < 25)
  if (bmi >= 18.5) {
    if (height >= (gender === 'male' ? 178 : 168)) {
      return `tall and slender, fit ${genderNoun} model with well-proportioned body shape`;
    }
    if (height <= (gender === 'male' ? 165 : 155)) {
      return `petite and slim, fit ${genderNoun} model with well-proportioned body shape`;
    }
    return `slim and well-proportioned ${genderNoun} model`;
  }
  // 5. Underweight (BMI < 18.5)
  if (height >= (gender === 'male' ? 178 : 168)) {
    return `tall and very thin, skinny ${genderNoun} model`;
  }
  if (height <= (gender === 'male' ? 165 : 155)) {
    return `petite and very thin, skinny ${genderNoun} model`;
  }
  return `very thin and slender ${genderNoun} model`;
}

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'Spring';
  if (month >= 6 && month <= 8) return 'Summer';
  if (month >= 9 && month <= 11) return 'Autumn';
  return 'Winter';
}

const USER_PROMPT = (
  gender: string,
  height: string,
  weight: string,
  bodyDescription: string
) => `
Analyze the provided full-body photo and return a comprehensive style analysis as JSON.

User details:
- Gender: ${gender === 'female' ? 'Female' : gender === 'male' ? 'Male' : 'Other'}
- Height: ${height}cm
- Weight: ${weight}kg
- Computed Physical Build: ${bodyDescription}
- Current Season: ${getCurrentSeason()}

Analyze the user's hair style, hair color, skin tone, face shape, estimated age range, and general ethnicity/race directly from their uploaded photo, and summarize it as a short English descriptive subject (e.g. "a 30s East Asian female with shoulder-length straight black hair and warm light skin tone").

Return a JSON object with EXACTLY this structure (fill in the real values):
{
  "avatarDescription": "English description of the user's facial features, hair, skin, and age range from the photo (e.g., 'a 20s East Asian female with long straight black hair, a warm light skin tone, and an oval face')",
  "bodyType": {
    "name": "English body type name (e.g. Hourglass)",
    "englishName": "English body type name (e.g. Hourglass)",
    "description": "2-3 sentences in English describing this body type",
    "characteristics": ["trait 1", "trait 2", "trait 3"]
  },
  "personalColor": {
    "season": "Spring Warm OR Summer Cool OR Autumn Warm OR Winter Cool",
    "palette": ["#C4A882", "#D4B896", "#E8C9A0", "#F0DEB4", "#F5E6C8"],
    "description": "2 sentences in English about personal color",
    "keywords": ["keyword 1", "keyword 2", "keyword 3"]
  },
  "styleRecommendations": [
    {
      "title": "Style title in English",
      "style": "Style category in English",
      "description": "2 sentences in English about why this style suits the user",
      "items": ["Color + Material + Item (e.g. Ivory cotton oversized t-shirt)", "Navy straight denim pants", "White canvas sneakers"],
      "occasion": "Suitable occasion in English",
      "emoji": "👗",
      "imagePrompt": "A full-body fashion photography of [avatarDescription] with [bodyDescription], having a [English body type] body shape, wearing [detailed english list of clothing items], posing naturally at [fitting background/location for the occasion], wearing stylish sunglasses, highly detailed fashion editorial"
    },
    {
      "title": "Style title 2 in English",
      "style": "Style category 2 in English",
      "description": "2 sentences in English",
      "items": ["Color + Material + Item", "e.g. Light blue linen shirt", "Khaki wide chino pants"],
      "occasion": "Suitable occasion 2 in English",
      "emoji": "✨",
      "imagePrompt": "A full-body fashion photography of [avatarDescription] with [bodyDescription], having a [English body type] body shape, wearing [detailed english list of clothing items], posing naturally at [fitting background/location for the occasion], wearing stylish sunglasses, highly detailed fashion editorial"
    },
    {
      "title": "Style title 3 in English",
      "style": "Style category 3 in English",
      "description": "2 sentences in English",
      "items": ["Color + Material + Item", "e.g. Black slim fit slacks", "White poly blouse"],
      "occasion": "Suitable occasion 3 in English",
      "emoji": "💼",
      "imagePrompt": "A full-body fashion photography of [avatarDescription] with [bodyDescription], having a [English body type] body shape, wearing [detailed english list of clothing items], posing naturally at [fitting background/location for the occasion], wearing stylish sunglasses, highly detailed fashion editorial"
    }
  ],
  "silhouetteTips": ["Tip 1", "Tip 2", "Tip 3"],
  "colorsTips": ["Tip 1", "Tip 2", "Tip 3"],
  "avoidTips": ["Tip 1", "Tip 2", "Tip 3"],
  "overallScore": 92
}

IMPORTANT:
- styleRecommendations must have EXACTLY 3 complete objects
- palette must have EXACTLY 5 valid hex color codes starting with #
- overallScore must be an integer between 70 and 99
- All text must be in English
- imagePrompt MUST be in English, describing a full-body fashion photography of the avatar model wearing the outfit in a suitable background
- In the generated imagePrompt fields:
  1. Replace "[avatarDescription]" with the EXACT English description you wrote in the "avatarDescription" field (representing the user's face, hair, and skin tone from the photo).
  2. Replace "[bodyDescription]" with the EXACT computed body build description: "${bodyDescription}" provided in the details. Do NOT omit or simplify it.
- items MUST follow the format: "Color + Material/Fit + Item name" (e.g., "Coral pink linen wide pants")
- ALL recommended clothing must be appropriate for the current season
- Do NOT include any text before or after the JSON object
`;

function extractJSON(raw: string): string {
  let cleaned = raw
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```\s*$/im, '')
    .trim();

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');

  if (start === -1 || end === -1 || end < start) {
    throw new Error(`JSON 블록을 찾을 수 없습니다.\n원본(처음 300자): ${raw.slice(0, 300)}`);
  }

  return cleaned.slice(start, end + 1);
}

function parseDataUrl(dataUrl: string): { mimeType: string; data: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('유효하지 않은 이미지 형식입니다.');
  return { mimeType: match[1], data: match[2] };
}

export async function analyzeStyle(
  imageBase64: string,
  gender: string,
  height: string,
  weight: string
): Promise<BodyAnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
  }

  const bodyDescription = getBodyDescription(gender, height, weight);
  const ai = new GoogleGenAI({ apiKey });
  const { mimeType, data } = parseDataUrl(imageBase64);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      temperature: 0.5,
      maxOutputTokens: 8192,
    },
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { mimeType, data } },
          { text: USER_PROMPT(gender, height, weight, bodyDescription) },
        ],
      },
    ],
  });

  const content = response.text;
  if (!content) throw new Error('AI 응답이 비어 있습니다.');

  let parsed: BodyAnalysisResult;
  try {
    parsed = JSON.parse(content) as BodyAnalysisResult;
  } catch {
    // JSON 모드에서 마크다운이 붙은 경우 fallback
    try {
      parsed = JSON.parse(extractJSON(content)) as BodyAnalysisResult;
    } catch (e) {
      console.error('[StyleAI] 파싱 실패 원문 (처음 500자):', content?.slice(0, 500));
      throw new Error('AI 응답 파싱에 실패했습니다. 다시 시도해주세요.');
    }
  }

  if (!parsed.bodyType || !parsed.personalColor || !Array.isArray(parsed.styleRecommendations)) {
    throw new Error('AI 응답에 필수 데이터가 없습니다. 다시 시도해주세요.');
  }

  const avatarDesc = parsed.avatarDescription || `${gender === 'female' ? 'female' : 'male'} model`;

  while (parsed.styleRecommendations.length < 3) {
    parsed.styleRecommendations.push({
      title: 'Basic Look',
      style: 'Casual',
      description: 'Comfortable and stylish basic look.',
      items: ['White t-shirt', 'Denim pants', 'Sneakers', 'Simple bag'],
      occasion: 'Daily',
      emoji: '👕',
      imagePrompt:
        `A full-body fashion photography of ${avatarDesc} with ${bodyDescription}, wearing a white t-shirt, blue denim pants, white sneakers, and a simple leather bag, posing in a modern street, wearing stylish sunglasses, fashion editorial quality.`,
    });
  }

  return parsed;
}

/* ─────────────────────────────────────────────────────────
 * 코디 이미지 생성 - Imagen 3 (SDK)
 * ───────────────────────────────────────────────────────── */

function buildImagePrompt(card: StyleCard): string {
  if (card.imagePrompt && card.imagePrompt.length > 10) {
    return card.imagePrompt.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, '').replace(/\s+/g, ' ').trim();
  }
  return `A full-body fashion photography of a model wearing: ${card.items.join(', ')}, natural background, wearing stylish sunglasses, professional fashion editorial.`;
}

export async function generateOutfitImage(
  card: StyleCard,
  _colorSeason: string,
  apiKey: string
): Promise<string | null> {
  const prompt = buildImagePrompt(card);

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt,
      config: { numberOfImages: 1, aspectRatio: '1:1' },
    });

    const base64 = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64) {
      const b64 = typeof base64 === 'string' ? base64 : Buffer.from(base64).toString('base64');
      return `data:image/png;base64,${b64}`;
    }
  } catch (e) {
    console.warn('[StyleAI] Imagen 생성 실패:', e);
  }

  // 폴백: Pollinations AI
  const seed = Math.floor(Math.random() * 1000000);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&nologo=true&seed=${seed}&model=flux`;
}

export async function generateAllOutfitImages(
  cards: StyleCard[],
  colorSeason: string,
  apiKey: string
): Promise<(string | null)[]> {
  const results = await Promise.allSettled(
    cards.map((card) => generateOutfitImage(card, colorSeason, apiKey))
  );
  return results.map((r) => (r.status === 'fulfilled' ? r.value : null));
}
