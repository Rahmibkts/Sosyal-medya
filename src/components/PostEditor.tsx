import React, { useState, useRef } from 'react';
import { PostVariation, SocialPlatform, ContentStatus, ScheduledPost } from '../types';
import { PlatformPreview } from './PlatformPreview';
import { Edit3, Sparkles, Loader2, Save, Calendar, Copy, Check, Wand2, Hash, Smile, Globe, HelpCircle, Scissors, Briefcase, Mic, MicOff, Sliders, Volume2, Image as ImageIcon, Trash2, RefreshCw, Palette, CheckCircle2, BarChart3, Zap } from 'lucide-react';

interface PostEditorProps {
  currentPost: Partial<PostVariation>;
  setCurrentPost: React.Dispatch<React.SetStateAction<Partial<PostVariation>>>;
  onSavePost: (post: ScheduledPost) => void;
  brandName?: string;
}

export const PostEditor: React.FC<PostEditorProps> = ({
  currentPost,
  setCurrentPost,
  onSavePost,
  brandName = 'SaaS Brand',
}) => {
  const [isRefining, setIsRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);
  const [customInstruction, setCustomInstruction] = useState('');
  const [copied, setCopied] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(
    currentPost.scheduledDate || new Date().toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState(
    (currentPost as Partial<ScheduledPost>).scheduledTime || '12:00'
  );
  const [status, setStatus] = useState<ContentStatus>(currentPost.status || 'taslak');
  const [rawHashtags, setRawHashtags] = useState<string>(
    (currentPost.hashtags || []).join(' ')
  );

  React.useEffect(() => {
    setRawHashtags((currentPost.hashtags || []).join(' '));
    setScheduledDate(currentPost.scheduledDate || new Date().toISOString().split('T')[0]);
    setScheduledTime((currentPost as Partial<ScheduledPost>).scheduledTime || '12:00');
    setStatus(currentPost.status || 'taslak');
  }, [currentPost.id]);

  const handleHashtagsChange = (val: string) => {
    setRawHashtags(val);
    const parsed = val
      .split(/[\s,]+/)
      .map((h) => h.trim())
      .filter(Boolean)
      .map((h) => (h.startsWith('#') ? h : `#${h}`));
    setCurrentPost((prev) => ({ ...prev, hashtags: parsed }));
  };

  // Voice-to-text (Sesle Yaz) state & handler
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  React.useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // AI Image Generation state & handler
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageGenError, setImageGenError] = useState<string | null>(null);

  // Virality & Hook Deep Analysis State
  const [isAnalyzingCaption, setIsAnalyzingCaption] = useState(false);
  const [captionAnalysis, setCaptionAnalysis] = useState<{
    overallScore: number;
    hookScore: number;
    readabilityScore: number;
    ctaScore: number;
    toneDetected: string;
    strengths: string[];
    weaknesses: string[];
    actionTips: string[];
  } | null>(null);

  const handleAnalyzeVirality = async () => {
    if (!currentPost.caption || !currentPost.caption.trim()) {
      return;
    }
    setIsAnalyzingCaption(true);
    try {
      const res = await fetch('/api/analyze-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: currentPost.caption,
          platform: activePlatform,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCaptionAnalysis(data);
        if (data.overallScore) {
          setCurrentPost((prev) => ({
            ...prev,
            estimatedViralityScore: data.overallScore,
          }));
        }
      }
    } catch (err) {
      console.error('Caption analysis error:', err);
    } finally {
      setIsAnalyzingCaption(false);
    }
  };

  const handleGenerateImage = async () => {
    const promptToUse = currentPost.visualIdea || currentPost.caption || currentPost.title;
    if (!promptToUse || !promptToUse.trim()) {
      setImageGenError("Lütfen önce bir 'Görsel Konsept Notu' veya gönderi açıklaması girin.");
      return;
    }

    setIsGeneratingImage(true);
    setImageGenError(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToUse,
          platform: activePlatform,
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        setCurrentPost((prev) => ({
          ...prev,
          mediaUrl: data.imageUrl,
        }));
      } else {
        throw new Error(data.error || "Görsel üretilemedi.");
      }
    } catch (err: any) {
      console.error("Image generation error:", err);
      setImageGenError(err.message || "Görsel oluşturulurken bir hata oluştu.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Tarayıcınız sesle yazma özelliğini desteklemiyor. Lütfen Chrome veya Edge kullanın.');
      return;
    }

    setSpeechError(null);

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'tr-TR';
      recognition.continuous = true;
      recognition.interimResults = true;

      let baseText = currentPost.caption ? (currentPost.caption.trim() + ' ') : '';
      let accumulatedFinal = '';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinal += transcript;
          } else {
            currentInterim += transcript;
          }
        }

        if (currentFinal) {
          accumulatedFinal += currentFinal + ' ';
        }

        const newCaption = baseText + accumulatedFinal + currentInterim;
        setCurrentPost((prev) => ({
          ...prev,
          caption: newCaption,
        }));
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Mikrofon erişimine izin verilmedi. Lütfen tarayıcınızda mikrofon iznini etkinleştirin.');
        } else if (event.error === 'no-speech') {
          setSpeechError('Ses algılanamadı, lütfen mikrofonunuza doğru tekrar konuşun.');
        } else {
          setSpeechError(`Ses tanıma hatası: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setSpeechError('Mikrofon başlatılamadı: ' + err.message);
      setIsListening(false);
    }
  };

  // Character Limit calculation
  const platformLimits: Record<SocialPlatform, number> = {
    twitter: 280,
    instagram: 2200,
    linkedin: 3000,
    facebook: 5000,
    tiktok: 2200,
    youtube: 1000,
  };

  const activePlatform = currentPost.platform || 'instagram';
  const charLimit = platformLimits[activePlatform] || 2200;
  const currentLength = (currentPost.caption || '').length;

  const handleAIRefine = async (action: string, overrideTone?: string) => {
    setIsRefining(true);
    setRefineError(null);

    const activeTone = overrideTone || currentPost.tone || 'Profesyonel';

    try {
      const response = await fetch('/api/refine-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPost: { ...currentPost, tone: activeTone },
          action,
          targetTone: activeTone,
          customInstruction: action === 'custom' ? customInstruction : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gönderi düzenlenirken hata oluştu.');
      }

      if (data.refinedPost) {
        setCurrentPost((prev) => ({
          ...prev,
          tone: activeTone,
          caption: data.refinedPost.caption || prev.caption,
          hashtags: data.refinedPost.hashtags || prev.hashtags,
          callToAction: data.refinedPost.callToAction || prev.callToAction,
          visualIdea: data.refinedPost.visualIdea || prev.visualIdea,
          improvementTip: data.refinedPost.improvementTip || prev.improvementTip,
        }));
      }
    } catch (err: any) {
      setRefineError(err.message || 'Yapay zeka yanıt veremedi.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleToneSelect = (selectedTone: string) => {
    setCurrentPost((prev) => ({ ...prev, tone: selectedTone }));
    if (currentPost.caption && currentPost.caption.trim().length > 5) {
      handleAIRefine('tone_change', selectedTone);
    }
  };

  const handleSave = () => {
    const fullSavedPost: ScheduledPost = {
      id: currentPost.id || `saved-${Date.now()}`,
      title: currentPost.title || 'Düzenlenen Gönderi',
      caption: currentPost.caption || '',
      hashtags: currentPost.hashtags || [],
      callToAction: currentPost.callToAction || '',
      visualIdea: currentPost.visualIdea || '',
      estimatedViralityScore: currentPost.estimatedViralityScore || 85,
      improvementTip: currentPost.improvementTip || '',
      platform: activePlatform,
      tone: currentPost.tone || 'Profesyonel',
      scheduledDate,
      scheduledTime,
      status,
      createdAt: new Date().toISOString(),
      brandName,
      mediaUrl: currentPost.mediaUrl,
    };

    onSavePost(fullSavedPost);
  };

  const handleCopyFull = () => {
    const text = `${currentPost.caption || ''}\n\n${(currentPost.hashtags || []).join(' ')}\n\n${currentPost.callToAction || ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Edit3 className="w-6 h-6 text-indigo-400" />
            Canlı Metin Düzenleyici & Platform Önizlemesi
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Gönderinizi anlık olarak düzenleyin, platform kardı görünümünü inceleyin ve AI ile dokunuşlar yapın.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 hover:opacity-95 transition-all flex items-center gap-2 active:scale-95"
        >
          <Save className="w-4 h-4" />
          Takvime Kaydet / Yayınla
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Editor Area (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 shadow-xl">
          {/* Platform Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Önizleme Platformu Seçin</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'instagram', label: 'Instagram' },
                { id: 'linkedin', label: 'LinkedIn' },
                { id: 'twitter', label: 'Twitter / X' },
                { id: 'facebook', label: 'Facebook' },
                { id: 'tiktok', label: 'TikTok' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentPost((prev) => ({ ...prev, platform: p.id as SocialPlatform }))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                    activePlatform === p.id
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick AI Refine Toolbar */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-indigo-400" />
                Hızlı AI Düzenleme Dokunuşları:
              </span>
              {isRefining && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Prominent Yapay Zeka ile İyileştir Button */}
              <button
                disabled={isRefining || !currentPost.caption}
                onClick={() => handleAIRefine('iyilestir')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 border border-indigo-400/30 transition-all active:scale-95 disabled:opacity-50"
                title="Girdiğiniz metni analiz ederek hook, akıcılık, etkileşim çağrısı ve dilbilgisi açısından en mükemmel hale getirir"
              >
                {isRefining ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                )}
                <span>✨ Yapay Zeka ile İyileştir</span>
              </button>

              <button
                disabled={isRefining}
                onClick={() => handleAIRefine('daha_kisa')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all disabled:opacity-50"
              >
                <Scissors className="w-3.5 h-3.5 text-pink-400" />
                Daha Kısa Yap
              </button>

              <button
                disabled={isRefining}
                onClick={() => handleAIRefine('daha_profesyonel')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all disabled:opacity-50"
              >
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                Daha Kurumsal
              </button>

              <button
                disabled={isRefining}
                onClick={() => handleAIRefine('emoji_ekle')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all disabled:opacity-50"
              >
                <Smile className="w-3.5 h-3.5 text-amber-400" />
                Emoji Ekle
              </button>

              <button
                disabled={isRefining}
                onClick={() => handleAIRefine('soru_ekle')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all disabled:opacity-50"
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                Soru Cümlesi Ekle
              </button>

              <button
                disabled={isRefining}
                onClick={() => handleAIRefine('hashtag_yenile')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all disabled:opacity-50"
              >
                <Hash className="w-3.5 h-3.5 text-purple-400" />
                Hashtag Yenile
              </button>

              <button
                disabled={isRefining}
                onClick={() => handleAIRefine('ingilizceye_ceviri')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all disabled:opacity-50"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                İngilizceye Çevir
              </button>
            </div>

            {/* Custom instruction prompt input */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="Özel AI direktifi örn: 'Metne 1 tane eğlenceli esprili cümle ekle'..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                disabled={isRefining || !customInstruction.trim()}
                onClick={() => handleAIRefine('custom')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                Uygula
              </button>
            </div>
          </div>

          {refineError && (
            <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-300 text-xs">
              ⚠️ {refineError}
            </div>
          )}

          {/* İçerik Tonu (Tone of Voice) Dropdown & Adapter */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <label className="text-xs font-bold text-slate-200">
                  İçerik Tonu & Dil Üslubu
                </label>
                <span className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800/60 px-2.5 py-0.5 rounded-full font-bold">
                  {currentPost.tone || 'Profesyonel'}
                </span>
              </div>

              <button
                type="button"
                disabled={isRefining || !currentPost.caption}
                onClick={() => handleAIRefine('tone_change', currentPost.tone || 'Profesyonel')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
                title="Metni seçilen içerik tonuna göre AI ile anında yeniden yapılandırır"
              >
                {isRefining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                <span>Metni Tona Göre Güncelle (AI)</span>
              </button>
            </div>

            <div className="relative">
              <select
                value={currentPost.tone || 'Profesyonel'}
                onChange={(e) => handleToneSelect(e.target.value)}
                className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-3 border border-slate-700/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none font-medium cursor-pointer shadow-inner"
              >
                <option value="Profesyonel">💼 Profesyonel (Kurumsal, Saygın & Güven Verici)</option>
                <option value="Resmi">🏛️ Resmi (Ciddi, Mesafeli & Net)</option>
                <option value="Eğlenceli">🎉 Eğlenceli (Esprili, Enerjik & Trendler)</option>
                <option value="Samimi">🤝 Samimi (Dostane, İptal Edilemez Bağ & Doğal)</option>
                <option value="Minimal">✨ Minimal (Öz, Kısa & Vurucu)</option>
                <option value="Motive Edici">🚀 Motive Edici (İlham Verici, Güçlü & Heyecanlı)</option>
                <option value="İkna Edici">🔥 İkna Edici (Satış Odaklı, Harekete Geçiren)</option>
                <option value="Hikaye Anlatımı">📖 Hikaye Anlatımı (Storytelling, Merak Uyandıran)</option>
              </select>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              💡 Bir ton seçtiğinizde, AI metninizi otomatik olarak o anlatım tarzına (resmi, eğlenceli, minimal vb.) uyarlar ve önizleme kartı anında güncellenir.
            </p>
          </div>

          {/* Main Caption Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-slate-300">Açıklama Metni (Caption)</label>

                {/* Voice-to-Text Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border ${
                    isListening
                      ? 'bg-red-600 text-white border-red-500 animate-pulse shadow-lg shadow-red-600/30'
                      : 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border-indigo-800/60 hover:text-indigo-200'
                  }`}
                  title="Mikrofonunuzu kullanarak sesle metin yazdırın"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Dinleniyor... (Durdur)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-indigo-400" />
                      <span>🎤 Sesle Yaz</span>
                    </>
                  )}
                </button>

                {/* AI Enhance Button next to Voice input */}
                <button
                  type="button"
                  disabled={isRefining || !currentPost.caption}
                  onClick={() => handleAIRefine('iyilestir')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border bg-gradient-to-r from-purple-900/80 to-indigo-900/80 hover:from-purple-800 hover:to-indigo-800 text-purple-200 border-purple-700/50 hover:text-white disabled:opacity-50 active:scale-95 shadow-sm"
                  title="Açıklama metnini analiz edip AI ile anında geliştirir"
                >
                  {isRefining ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-300" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  <span>✨ Yapay Zeka ile İyileştir</span>
                </button>
              </div>

              <span
                className={`font-mono text-xs ${
                  currentLength > charLimit ? 'text-red-400 font-bold' : 'text-slate-400'
                }`}
              >
                {currentLength} / {charLimit} Karakter
              </span>
            </div>

            {speechError && (
              <div className="p-2.5 bg-amber-950/60 border border-amber-800/60 rounded-xl text-amber-300 text-xs flex items-center justify-between">
                <span>⚠️ {speechError}</span>
                <button
                  onClick={() => setSpeechError(null)}
                  className="text-amber-400 hover:text-amber-200 font-bold text-xs ml-2"
                >
                  ✕
                </button>
              </div>
            )}

            {isListening && (
              <div className="p-2.5 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-indigo-300 text-xs flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span>Mikrofon aktif: Konuştuğunuz cümleler anında metne dökülecektir...</span>
              </div>
            )}

            <textarea
              value={currentPost.caption || ''}
              onChange={(e) => setCurrentPost({ ...currentPost, caption: e.target.value })}
              rows={8}
              placeholder="Gönderi açıklamanızı yazın veya 'Sesle Yaz' butonuna basarak mikrofonla konuşun..."
              className="w-full bg-slate-950 text-slate-100 text-sm rounded-2xl p-4 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-y leading-relaxed"
            />

            {/* Deep Virality Analysis Button & Drawer */}
            <div className="pt-1">
              <button
                type="button"
                disabled={isAnalyzingCaption || !currentPost.caption?.trim()}
                onClick={handleAnalyzeVirality}
                className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800/80 border border-indigo-500/30 rounded-xl text-xs font-bold text-indigo-300 hover:text-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isAnalyzingCaption ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>AI Virallik Metrikleri Hesaplanıyor...</span>
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 text-indigo-400" />
                    <span>📊 Derin Virallik & Kanca Skoru Analizi Yap</span>
                  </>
                )}
              </button>

              {captionAnalysis && (
                <div className="mt-3 p-4 bg-slate-950/90 rounded-2xl border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400" />
                      Virallik Raporu ({captionAnalysis.toneDetected} Ton)
                    </span>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-600 text-white">
                      Genel Skor: %{captionAnalysis.overallScore}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Kanca Cümle</span>
                      <span className="font-bold text-indigo-300">%{captionAnalysis.hookScore}</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Okunabilirlik</span>
                      <span className="font-bold text-emerald-300">%{captionAnalysis.readabilityScore}</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">CTA Gücü</span>
                      <span className="font-bold text-amber-300">%{captionAnalysis.ctaScore}</span>
                    </div>
                  </div>

                  {captionAnalysis.actionTips?.length > 0 && (
                    <div className="space-y-1 text-xs">
                      <span className="text-[11px] font-bold text-amber-300 block">💡 AI İyileştirme Tavsiyesi:</span>
                      {captionAnalysis.actionTips.map((tip, i) => (
                        <p key={i} className="text-slate-300 text-[11px] leading-relaxed">
                          • {tip}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Hashtags Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Hashtagler (Virgül veya Boşluk ile ayırın)</label>
            <input
              type="text"
              value={rawHashtags}
              onChange={(e) => handleHashtagsChange(e.target.value)}
              placeholder="#hashtag1 #hashtag2 #marka..."
              className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-3 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>

          {/* CTA & Visual Idea Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Eyleme Çağrı (Call To Action)</label>
                <input
                  type="text"
                  value={currentPost.callToAction || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, callToAction: e.target.value })}
                  placeholder="Örn: 'Web sitemizi ziyaret edin!', 'Yorumlarda düşünceni paylaş!'"
                  className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-3 border border-slate-800 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Görsel Konsept Notu</span>
                </label>
                <input
                  type="text"
                  value={currentPost.visualIdea || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, visualIdea: e.target.value })}
                  placeholder="Görsel veya video konsepti açıklaması..."
                  className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-3 border border-slate-800 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* AI Image Generation Panel */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-slate-200">Yapay Zeka ile Görsel Üretici</span>
                  <span className="text-[10px] bg-purple-950/90 text-purple-300 border border-purple-800/60 px-2 py-0.5 rounded-full font-semibold">
                    Gemini Imagine
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isGeneratingImage || (!currentPost.visualIdea && !currentPost.caption)}
                  onClick={handleGenerateImage}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 border border-purple-400/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  title="'Görsel Konsept Notu'ndaki açıklamayı AI ile gerçek bir görsele dönüştürür"
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Görsel Oluşturuluyor...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                      <span>🎨 Görsel Oluştur</span>
                    </>
                  )}
                </button>
              </div>

              {imageGenError && (
                <div className="p-2.5 bg-red-950/60 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center justify-between">
                  <span>⚠️ {imageGenError}</span>
                  <button
                    type="button"
                    onClick={() => setImageGenError(null)}
                    className="text-red-400 hover:text-red-200 font-bold text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Media Preview Box inside Editor */}
              {currentPost.mediaUrl ? (
                <div className="flex items-center gap-4 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700 shrink-0 bg-slate-950">
                    <img
                      src={currentPost.mediaUrl}
                      alt="AI üretilen görsel"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Görsel Varlığı Gönderiye Eklendi</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {currentPost.visualIdea || 'AI tarafından konsept görseli oluşturuldu'}
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        disabled={isGeneratingImage}
                        onClick={handleGenerateImage}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Yeniden Oluştur
                      </button>
                      <span className="text-slate-700">•</span>
                      <button
                        type="button"
                        onClick={() => setCurrentPost((prev) => ({ ...prev, mediaUrl: undefined }))}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Görseli Kaldır
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  💡 'Görsel Konsept Notu' alanındaki yazılı fikrinizi tek tıkla yapay zeka ile görsel bir medya varlığına dönüştürebilirsiniz. Üretilen görsel anında gönderi varlıklarına ve canlı önizleme kartına eklenir.
                </p>
              )}
            </div>
          </div>

          {/* Plan Settings */}
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Yayın Tarihi</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-2.5 border border-slate-800 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Yayın Saati</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-2.5 border border-slate-800 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Durum</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-2.5 border border-slate-800 outline-none font-semibold"
              >
                <option value="taslak">📝 Taslak</option>
                <option value="onaylandi">✅ Onaylandı</option>
                <option value="planlandi">📅 Planlandı</option>
                <option value="yayinlandi">🚀 Yayınlandı</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Live Preview Area (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-24 self-start">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Canlı Önizleme ({activePlatform.toUpperCase()})
            </h3>

            <button
              onClick={handleCopyFull}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Kopyalandı' : 'Tümünü Kopyala'}
            </button>
          </div>

          <PlatformPreview
            post={currentPost}
            platform={activePlatform}
            brandName={brandName}
            mediaUrl={currentPost.mediaUrl}
          />
        </div>
      </div>
    </div>
  );
};
