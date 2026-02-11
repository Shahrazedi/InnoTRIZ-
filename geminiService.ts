
import { GoogleGenAI, Type } from "@google/genai";
import { TRIZ_PARAMETERS, INVENTIVE_PRINCIPLES } from "./constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeProblemWithAI(problemDescription: string, lang: 'ar' | 'en' = 'ar') {
  const parametersContext = TRIZ_PARAMETERS.map(p => `${p.id}: ${lang === 'ar' ? p.name : p.nameEn}`).join(", ");
  
  try {
    const prompt = lang === 'ar' 
      ? `بصفتك خبيراً في منهجية TRIZ، قم بتحليل المشكلة التالية: "${problemDescription}"
      يجب عليك تحديد التناقض التقني باستخدام المعايير الـ 39 التالية حصراً: [${parametersContext}]
      المطلوب:
      1. اختيار ID المعيار الذي نريد تحسينه.
      2. اختيار ID المعيار الذي سيتأثر سلباً.
      3. شرح هندسي منطقي باللغة العربية.`
      : `As a TRIZ expert, analyze this problem: "${problemDescription}"
      You must identify the technical contradiction using exclusively the following 39 parameters: [${parametersContext}]
      Required:
      1. Select the ID of the Improving Parameter.
      2. Select the ID of the Worsening Parameter.
      3. Provide a logical engineering explanation in English.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            improvingParamId: { type: Type.INTEGER },
            worseningParamId: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["improvingParamId", "worseningParamId", "explanation"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
}

export async function generateInnovationDraft(problem: string, principleNames: string[], lang: 'ar' | 'en' = 'ar') {
  const principlesContext = INVENTIVE_PRINCIPLES.map(p => `${p.id}: ${lang === 'ar' ? p.name : p.nameEn} - ${lang === 'ar' ? p.description : p.descriptionEn}`).join("\n");

  try {
    const prompt = lang === 'ar'
      ? `أنت مهندس ابتكار رائد تستخدم منهجية TRIZ.
      المشكلة: "${problem}"
      المبادئ: [${principleNames.join(", ")}]
      دليل المبادئ: ${principlesContext}
      المطلوب توليد تقرير حلول ابتكاري احترافي باللغة العربية يتضمن:
      1. مقدمة تحليلية. 2. 3 حلول هندسية. 3. خطوات تنفيذية.`
      : `You are a leading innovation engineer using TRIZ.
      Problem: "${problem}"
      Principles: [${principleNames.join(", ")}]
      Principles Guide: ${principlesContext}
      Generate a professional innovation report in English including:
      1. Analytical introduction. 2. 3 engineering solutions. 3. Action plan steps.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            introduction: { type: Type.STRING },
            solutions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  principleApplied: { type: Type.STRING },
                  feasibility: { type: Type.STRING }
                },
                required: ["title", "description", "principleApplied", "feasibility"]
              }
            },
            nextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["introduction", "solutions", "nextSteps"]
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Draft generation failed:", error);
    return null;
  }
}
