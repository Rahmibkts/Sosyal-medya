import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint 1: Generate Social Media Posts
app.post("/api/generate-posts", async (req, res) => {
  try {
    const { topic, platform, tone, audience, language, options, brandName } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Konu veya açıklama gereklidir." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Sen uzman bir sosyal medya stratejisti ve metin yazarısın (Copywriter & Growth Marketer).
Görevin, kullanıcının belirttiği konu ve parametrelere göre tam 3 farklı etkileyici sosyal medya gönderi varyasyonu oluşturmaktır.

Kurallar:
1. Gönderi dili: ${language || "Türkçe"}.
2. Hedef Kitle: ${audience || "Genel"}.
3. Marka Adı: ${brandName || "Belirtilmedi"}.
4. Platform kurallarına ve karakter limitlerine uyun:
   - Instagram: Çarpıcı ilk cümle (hook), detaylı metin, emoji kullanımı, uygun hashtag grubu.
   - LinkedIn: Profesyonel, değer katan, paragraf boşluklu, düşünce lideri tonu.
   - Twitter/X: 280 karakter sınırı içinde vurucu, kısa ve net cümleler.
   - Facebook: Samimi, etkileşim teşvik eden topluluk tonu.
   - TikTok/Reels: Video anlatımı / seslendirme metni formatında visual & audio ipuçları.
5. Her varyasyon için şunları üret:
   - title: Varyasyonun yaklaşımı (Örn: "Hikaye Anlatımlı", "Doğrudan Satış Odaklı", "Soru & Etkileşim").
   - caption: Ana gönderi metni (Emoji, paragraf düzeni ve kanca cümle dahil).
   - hashtags: 5-8 adet doğrudan alakalı hashtag (dizi olarak).
   - callToAction: Okuyucuyu eyleme geçirecek net cümle (Örn: "Yorumlarda düşünceni paylaş!").
   - visualIdea: Bu gönderi için önerilen görsel, carousel slider veya video konsept açıklaması.
   - estimatedViralityScore: 0-100 arası tahmini erişim/etkileşim skoru.
   - improvementTip: Gönderiyi daha da güçlendirecek 1 adet profesyonel tavsiye.`;

    const promptText = `Platform: ${platform || "Instagram"}
Tone of Voice: ${tone || "Profesyonel & Etkileyici"}
Konu / Fikir: ${topic}
İstenen İpuçları: ${options?.includeHashtags ? "Hashtagler olsun" : ""}, ${options?.includeCallToAction ? "CTA olsun" : ""}, ${options?.includeVisualIdea ? "Görsel konsepti olsun" : ""}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  caption: { type: Type.STRING },
                  hashtags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  callToAction: { type: Type.STRING },
                  visualIdea: { type: Type.STRING },
                  estimatedViralityScore: { type: Type.INTEGER },
                  improvementTip: { type: Type.STRING },
                },
                required: ["title", "caption", "hashtags", "callToAction", "visualIdea", "estimatedViralityScore", "improvementTip"],
              },
            },
          },
          required: ["variations"],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    const variationsWithIds = (parsedData.variations || []).map((v: any, index: number) => ({
      ...v,
      id: `var-${Date.now()}-${index}`,
      platform: platform || "Instagram",
      tone: tone || "Profesyonel",
    }));

    return res.json({ variations: variationsWithIds });
  } catch (error: any) {
    console.error("Error generating posts:", error);
    return res.status(500).json({ error: error.message || "Gönderiler oluşturulurken bir hata oluştu." });
  }
});

// API Endpoint 2: Refine / Edit Post Draft with AI
app.post("/api/refine-post", async (req, res) => {
  try {
    const { currentPost, action, customInstruction, targetTone } = req.body;

    if (!currentPost || !currentPost.caption) {
      return res.status(400).json({ error: "Mevcut gönderi metni bulunamadı." });
    }

    const ai = getGeminiClient();

    let actionPrompt = "";
    switch (action) {
      case "iyilestir":
      case "smart_enhance":
        actionPrompt = `Gönderi metnini detaylıca analiz et ve iyileştir: Girişte dikkat çeken güçlü bir hook (dikkat çekici cümle) oluştur, akıcılığı artır, varsa dilbilgisi hatalarını düzelt, okuyucuyu harekete geçirecek eksik noktaları ve etkileşim çağrısını mükemmelleştir. Metni çok daha etkileyici, profesyonel ve yüksek dönüşümlü hale getir.`;
        break;
      case "tone_change":
        actionPrompt = `Metnin ana mesajını ve konusunu koruyarak anlatım stilini ve dilini belirgin şekilde '${targetTone || currentPost.tone || "Profesyonel"}' tonuna dönüştür ve adapte et.`;
        break;
      case "daha_kisa":
        actionPrompt = "Metni daha vurucu, öz ve kısa hale getir. Özü koru.";
        break;
      case "daha_profesyonel":
        actionPrompt = "Metnin tonunu kurumsal, uzman ve son derece profesyonel bir dile dönüştür.";
        break;
      case "emoji_ekle":
        actionPrompt = "Metnin uygun yerlerine dikkat çekici ve estetik emojiler ekle.";
        break;
      case "soru_ekle":
        actionPrompt = "Okuyucuların yorum yazmasını sağlayacak güçlü bir soru cümlesi ekle.";
        break;
      case "ingilizceye_ceviri":
        actionPrompt = "Metni ve hashtagleri akıcı, doğal İngilizceye çevir.";
        break;
      case "hashtag_yenile":
        actionPrompt = "Mevcut trendlere ve konuya en uygun yeni 6-8 hashtag türet.";
        break;
      default:
        actionPrompt = customInstruction || "Metni gözden geçir, daha çekici ve yüksek dönüşümlü hale getir.";
    }

    const systemInstruction = `Sen profesyonel bir sosyal medya metin düzenleyicisisin.
Görevin verilen sosyal medya gönderisini istenen direktife göre güncellemek ve yenilemektir.
Yenilenmiş gönderiyi aşağıdaki JSON formatında döndür:
- caption: Güncellenmiş metin.
- hashtags: Güncellenmiş hashtag dizisi.
- callToAction: Güncellenmiş veya korunan eyleme çağrı cümlesi.
- visualIdea: Görsel fikir güncellendiyse yeni açıklama.
- improvementTip: Yapılan değişiklikle ilgili kısa açıklama.`;

    const promptText = `Mevcut Metin:
${currentPost.caption}

Mevcut Hashtagler: ${(currentPost.hashtags || []).join(", ")}
Mevcut CTA: ${currentPost.callToAction || ""}

İstenen Değişiklik Direktifi: ${actionPrompt}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: { type: Type.STRING },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            callToAction: { type: Type.STRING },
            visualIdea: { type: Type.STRING },
            improvementTip: { type: Type.STRING },
          },
          required: ["caption", "hashtags", "callToAction", "visualIdea", "improvementTip"],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json({ refinedPost: parsedData });
  } catch (error: any) {
    console.error("Error refining post:", error);
    return res.status(500).json({ error: error.message || "Gönderi düzenlenirken bir hata oluştu." });
  }
});

// API Endpoint 3: AI Brand Profile Generator & Tone Ideas
app.post("/api/generate-brand-voice", async (req, res) => {
  try {
    const { businessName, industry, description } = req.body;
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Marka Adı: ${businessName}, Sektör: ${industry}, Tanım: ${description}`,
      config: {
        systemInstruction: `Sen bir Marka Kimliği & Sosyal Medya Stratejistisin. Verilen markaya uygun:
1. En etkili 3 ses tonu önerisi (Tone of Voice).
2. Hedef kitle tanımı (Target Audience).
3. Örnek anahtar kelimeler ve imza hashtagler.
4. İçerik sütunları (Content Pillars) önerisi.
Yatıtı JSON formatında ver.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedTones: { type: Type.ARRAY, items: { type: Type.STRING } },
            targetAudience: { type: Type.STRING },
            signatureHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            contentPillars: { type: Type.ARRAY, items: { type: Type.STRING } },
            brandBio: { type: Type.STRING },
          },
          required: ["recommendedTones", "targetAudience", "signatureHashtags", "contentPillars", "brandBio"],
        },
      },
    });

    return res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error generating brand voice:", error);
    return res.status(500).json({ error: error.message || "Marka kimliği oluşturulamadı." });
  }
});

// API Endpoint 4: AI Image Generation for Post Visual Idea
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio, platform } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Görsel açıklaması (visualIdea) gereklidir." });
    }

    const ai = getGeminiClient();

    let ratio = "1:1";
    if (platform === "twitter") ratio = "16:9";
    if (platform === "linkedin") ratio = "4:3";
    if (platform === "tiktok") ratio = "9:16";
    if (aspectRatio) ratio = aspectRatio;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [
          {
            text: `Professional social media marketing photo or illustration: ${prompt}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: ratio as any,
        },
      },
    });

    let imageUrl = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || "image/png";
          imageUrl = `data:${mimeType};base64,${base64Data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      const seed = encodeURIComponent(prompt.substring(0, 30));
      imageUrl = `https://picsum.photos/seed/${seed}/800/800`;
    }

    return res.json({ imageUrl });
  } catch (error: any) {
    console.error("Error generating image:", error);
    const seed = encodeURIComponent((req.body.prompt || "social").substring(0, 30));
    const fallbackUrl = `https://picsum.photos/seed/${seed}/800/800`;
    return res.json({
      imageUrl: fallbackUrl,
      warning: "AI görsel servisi yanıtı hazırlanırken yüksek çözünürlüklü konsept görsel varlığı yerleştirildi."
    });
  }
});

// API Endpoint 5: Hashtag & Niche Trend Research
app.post("/api/analyze-hashtags", async (req, res) => {
  try {
    const { keyword, topic, platform } = req.body;
    if (!keyword && !topic) {
      return res.status(400).json({ error: "Hashtag analizi için bir konu veya anahtar kelime girin." });
    }

    const ai = getGeminiClient();
    const systemInstruction = `Sen sosyal medya SEO ve hashtag uzmanısın. Kullanıcının konusuna veya anahtar kelimesine göre en etkili hashtag gruplarını üret ve analiz et.
Return JSON with structured categories:
- highReach: Yüksek popülerlikteki hashtagler (örn: #SosyalMedya, #YapayZeka)
- niche: Hedef kitleye özel niş hashtagler
- trending: Yükselişte olan trend hashtagler
- bestGroup: Tek tıkla kopyalanabilir dengeli 7-10 hashtag kombinasyonu
- tips: Bu sektör için 2 adet hashtag strateji tavsiyesi.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Platform: ${platform || "Instagram"}, Konu/Kelime: ${keyword || topic}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            highReach: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tag: { type: Type.STRING },
                  volume: { type: Type.STRING },
                  competition: { type: Type.STRING },
                },
                required: ["tag", "volume", "competition"],
              },
            },
            niche: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tag: { type: Type.STRING },
                  volume: { type: Type.STRING },
                  competition: { type: Type.STRING },
                },
                required: ["tag", "volume", "competition"],
              },
            },
            trending: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tag: { type: Type.STRING },
                  volume: { type: Type.STRING },
                  competition: { type: Type.STRING },
                },
                required: ["tag", "volume", "competition"],
              },
            },
            bestGroup: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["highReach", "niche", "trending", "bestGroup", "tips"],
        },
      },
    });

    return res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error analyzing hashtags:", error);
    return res.status(500).json({ error: error.message || "Hashtag analizi başarısız oldu." });
  }
});

// API Endpoint 6: Cross-Platform Content Repurposer
app.post("/api/repurpose-post", async (req, res) => {
  try {
    const { sourceCaption, sourcePlatform, targetPlatform } = req.body;
    if (!sourceCaption) {
      return res.status(400).json({ error: "Dönüştürülecek gönderi metni bulunamadı." });
    }

    const ai = getGeminiClient();
    const systemInstruction = `Sen çapraz platform sosyal medya içerik dönüşüm uzmanısın.
Görev: ${sourcePlatform || "Mevcut"} platform gönderisini ${targetPlatform} platformunun ruhuna, kuralına ve okuma alışkanlıklarına %100 uygun hale getir.
Örnekler:
- Instagram -> Twitter/X: 2-3 tweetlik etkileyici bir flood/thread'e dönüştür.
- Instagram -> LinkedIn: Ciddi, kurumsal, hikaye anlatımlı ve profesyonel formata çevir.
- Instagram -> TikTok/Reels: Konuşma metni (script), ekrandaki yazılar ve ses yönlendirmeleri ekle.
- Any -> Instagram: Görsel kancalı, emoji düzenli ve hashtagli post yap.

Yanıtı JSON formatında ver.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Orijinal Metin:\n${sourceCaption}\n\nHedef Platform: ${targetPlatform}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            caption: { type: Type.STRING },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            callToAction: { type: Type.STRING },
            visualIdea: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["title", "caption", "hashtags", "callToAction", "visualIdea", "explanation"],
        },
      },
    });

    return res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error repurposing post:", error);
    return res.status(500).json({ error: error.message || "İçerik dönüştürme başarısız oldu." });
  }
});

// API Endpoint 7: Deep Caption & Virality Analysis
app.post("/api/analyze-caption", async (req, res) => {
  try {
    const { caption, platform } = req.body;
    if (!caption || !caption.trim()) {
      return res.status(400).json({ error: "Analiz edilecek metin bulunamadı." });
    }

    const ai = getGeminiClient();
    const systemInstruction = `Sen sosyal medya içerik virallik ve kalite denetçisisin. Metni derinlemesine analiz et ve metrikleri puanla (0-100).
Döndürülecek JSON:
- overallScore: Genel virallik potansiyeli (0-100)
- hookScore: Kanca cümlenin dikkat çekme gücü (0-100)
- readabilityScore: Okunabilirlik ve paragraf düzeni (0-100)
- ctaScore: Harekete geçirici mesaj gücü (0-100)
- toneDetected: Metinde tespit edilen duygu/ton (örn: Heyecanlı, Kurumsal, İlham Verici)
- strengths: Metnin 2 güçlü yönü
- weaknesses: Metnin 2 zayıf / geliştirilebilir yönü
- actionTips: Anında uygulanabilir 2 somut öneri.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Platform: ${platform || "Instagram"}\nMetin:\n${caption}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            hookScore: { type: Type.INTEGER },
            readabilityScore: { type: Type.INTEGER },
            ctaScore: { type: Type.INTEGER },
            toneDetected: { type: Type.STRING },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            actionTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["overallScore", "hookScore", "readabilityScore", "ctaScore", "toneDetected", "strengths", "weaknesses", "actionTips"],
        },
      },
    });

    return res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error analyzing caption:", error);
    return res.status(500).json({ error: error.message || "Analiz başarısız oldu." });
  }
});

// Start Express Server with Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      // Exclude API requests from fallback
      if (req.originalUrl.startsWith("/api")) {
        return next();
      }
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      if (req.originalUrl.startsWith("/api")) {
        return res.status(404).json({ error: "API endpoint bulunamadı" });
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
