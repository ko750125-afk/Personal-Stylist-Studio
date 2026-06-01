// src/services/openaiService.ts
import { GoogleGenAI } from '@google/genai';

export interface BodyAnalysisResult {
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

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return '봄 (Spring)';
  if (month >= 6 && month <= 8) return '여름 (Summer)';
  if (month >= 9 && month <= 11) return '가을 (Autumn)';
  return '겨울 (Winter)';
}

const USER_PROMPT = (gender: string, height: string, weight: string) => `
Analyze the provided full-body photo and return a comprehensive style analysis as JSON.

User details:
- Gender: ${gender === 'female' ? '여성 (Female)' : gender === 'male' ? '남성 (Male)' : '기타 (Other)'}
- Height: ${height}cm
- Weight: ${weight}kg
- Current Season: ${getCurrentSeason()}

Return a JSON object with EXACTLY this structure (fill in the real values):
{
  "bodyType": {
    "name": "체형 이름 Korean (e.g. 모래시계형)",
    "englishName": "English body type name (e.g. Hourglass)",
    "description": "2-3 sentences in Korean describing this body type",
    "characteristics": ["특징1", "특징2", "특징3", "특징4"]
  },
  "personalColor": {
    "season": "봄 웜톤 OR 여름 쿨톤 OR 가을 웜톤 OR 겨울 쿨톤",
    "palette": ["#C4A882", "#D4B896", "#E8C9A0", "#F0DEB4", "#F5E6C8"],
    "description": "2 sentences in Korean about personal color",
    "keywords": ["키워드1", "키워드2", "키워드3"]
  },
  "styleRecommendations": [
    {
      "title": "스타일 제목",
      "style": "스타일 카테고리",
      "description": "2 sentences in Korean about why this style suits the user",
      "items": ["색상+소재+아이템 (예: 아이보리 면 오버핏 티셔츠)", "네이비 스트레이트 데님 팬츠", "화이트 캔버스 스니커즈", "베이지 미니 크로스백"],
      "occasion": "어울리는 상황",
      "emoji": "👗",
      "imagePrompt": "A top-down flat lay photography of fashion items: [detailed english list of clothing items], matching [english personal color], clean solid light gray background, studio lighting, professional clothing arrangement, no people, no mannequins, high-end fashion editorial"
    },
    {
      "title": "스타일 제목2",
      "style": "스타일 카테고리2",
      "description": "2 sentences in Korean",
      "items": ["색상+소재+아이템명 형식으로 구체적으로", "예: 라이트블루 린넨 셔츠", "카키 와이드 치노 팬츠", "브라운 레더 로퍼"],
      "occasion": "어울리는 상황2",
      "emoji": "✨",
      "imagePrompt": "A top-down flat lay photography of fashion items..."
    },
    {
      "title": "스타일 제목3",
      "style": "스타일 카테고리3",
      "description": "2 sentences in Korean",
      "items": ["색상+소재+아이템명 형식으로 구체적으로", "예: 블랙 슬림핏 슬랙스", "화이트 폴리 블라우스", "누드 스트랩 힐"],
      "occasion": "어울리는 상황3",
      "emoji": "💼",
      "imagePrompt": "A top-down flat lay photography of fashion items..."
    }
  ],
  "silhouetteTips": ["실루엣 팁1", "팁2", "팁3"],
  "colorsTips": ["컬러 팁1", "팁2", "팁3"],
  "avoidTips": ["피해야 할 스타일1", "팁2", "팁3"],
  "overallScore": 92
}

IMPORTANT:
- styleRecommendations must have EXACTLY 3 complete objects
- palette must have EXACTLY 5 valid hex color codes starting with #
- overallScore must be an integer between 70 and 99
- All descriptive text must be in Korean except for imagePrompt
- imagePrompt MUST be in English, describing a top-down flat lay of the outfit items
- items MUST follow the format: "색상 + 소재/핏 + 아이템명" (예: "코랄 핑크 린넨 와이드 팬츠", "아이보리 오버핏 면 티셔츠")
- items should be specific enough to search on Korean shopping sites
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
          { text: USER_PROMPT(gender, height, weight) },
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

  while (parsed.styleRecommendations.length < 3) {
    parsed.styleRecommendations.push({
      title: '베이직 룩',
      style: '캐주얼',
      description: '편안하고 세련된 기본 스타일입니다.',
      items: ['화이트 티셔츠', '데님 팬츠', '스니커즈', '심플 백'],
      occasion: '일상',
      emoji: '👕',
      imagePrompt:
        'A top-down flat lay photography of a white t-shirt, blue denim pants, white sneakers, and a simple leather bag on a clean light gray background, neat clothing arrangement, fashion editorial quality, no people.',
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
  return `A top-down flat lay photography of fashion outfit: ${card.items.join(', ')}, clean solid light gray background, studio lighting, no people, no mannequins, professional fashion editorial.`;
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
