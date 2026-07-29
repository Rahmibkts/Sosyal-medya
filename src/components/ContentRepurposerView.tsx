import React, { useState } from 'react';
import { PostVariation, ScheduledPost, SocialPlatform } from '../types';
import { RefreshCw, Sparkles, Loader2, ArrowRight, Copy, Check, Share2, Layers, CheckCircle2 } from 'lucide-react';

interface ContentRepurposerProps {
  scheduledPosts: ScheduledPost[];
  onOpenInEditor: (post: Partial<PostVariation>) => void;
}

export const ContentRepurposerView: React.FC<ContentRepurposerProps> = ({
  scheduledPosts,
  onOpenInEditor,
}) => {
  const [sourceCaption, setSourceCaption] = useState(
    scheduledPosts[0]?.caption ||
      '🚀 Yapay zeka ile içerik üretiminizi 10 kat hızlandırın! Tek tıkla görseller, kanca cümleler ve otomatik planlama ile dijitaldeki gücünüzü katlayın.'
  );
  const [sourcePlatform, setSourcePlatform] = useState<SocialPlatform>('instagram');
  const [targetPlatform, setTargetPlatform] = useState<SocialPlatform>('twitter');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repurposedResult, setRepurposedResult] = useState<{
    title: string;
    caption: string;
    hashtags: string[];
    callToAction: string;
    visualIdea: string;
    explanation: string;
  } | null>({
    title: 'X / Twitter Flood (Thread) Formatı',
    caption:
      '1/3 🚀 Yapay zeka içerik üretiminizi 10 kat hızlandırabilir desek?\n\nİşte dijital pazarlama süreçlerinizi sıfırdan otomatize edecek 3 adımlı strateji: 🧵👇\n\n2/3 💡 1. Kanca Cümleler: Kullanıcının ilk 2 saniyesini yakalayın.\n2. Otomatik Hashtag & SEO: Niş kitleleri hedefleyin.\n3. Canlı Önizleme: Paylaşmadan önce kart görünümünü doğrulayın.\n\n3/3 Siz sosyal medya süreçlerinde AI kullanıyor musunuz? Düşüncelerinizi yazın!',
    hashtags: ['#AI', '#GrowthHacking', '#ContentStrategy'],
    callToAction: 'Bizi takip etmeyi ve retweet etmeyi unutmayın! 🔄',
    visualIdea: 'Özel kart görseli veya 3 adımlı infografik görseli.',
    explanation:
      'Orijinal Instagram gönderisi, X (Twitter) kullanıcılarının en çok etkileşim verdiği numaralandırılmış Thread (Flood) formatına dönüştürüldü.',
  });

  const [copied, setCopied] = useState(false);

  const handleRepurpose = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sourceCaption.trim()) {
      setError('Lütfen dönüştürülecek bir gönderi metni girin.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/repurpose-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceCaption,
          sourcePlatform,
          targetPlatform,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setRepurposedResult(data);
      } else {
        throw new Error(data.error || 'İçerik dönüştürülemedi.');
      }
    } catch (err: any) {
      setError(err.message || 'Dönüştürme esnasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToEditor = () => {
    if (!repurposedResult) return;
    onOpenInEditor({
      id: `repurposed-${Date.now()}`,
      title: repurposedResult.title,
      caption: repurposedResult.caption,
      hashtags: repurposedResult.hashtags,
      callToAction: repurposedResult.callToAction,
      visualIdea: repurposedResult.visualIdea,
      platform: targetPlatform,
      estimatedViralityScore: 88,
      status: 'taslak',
    });
  };

  const copyResult = () => {
    if (!repurposedResult) return;
    const fullText = `${repurposedResult.caption}\n\n${(repurposedResult.hashtags || []).join(' ')}\n\n${repurposedResult.callToAction}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <RefreshCw className="w-7 h-7 text-indigo-400" />
            Çapraz Platform İçerik Dönüştürücü (Repurposer)
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Tek bir içeriği saniyeler içinde Instagram, LinkedIn, X/Twitter veya TikTok formatlarına tam uyumlu olarak dönüştürün.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Source (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              1. Orijinal İçerik Seçin
            </h3>

            {scheduledPosts.length > 0 && (
              <select
                onChange={(e) => {
                  const found = scheduledPosts.find((p) => p.id === e.target.value);
                  if (found) {
                    setSourceCaption(found.caption);
                    if (found.platform) setSourcePlatform(found.platform);
                  }
                }}
                className="bg-slate-950 text-xs text-indigo-300 rounded-xl p-2 border border-slate-800 outline-none font-semibold cursor-pointer max-w-[180px] truncate"
              >
                <option value="">Taslaklardan Seç...</option>
                {scheduledPosts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title || p.caption.substring(0, 20)}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Kaynak Platform</label>
            <select
              value={sourcePlatform}
              onChange={(e) => setSourcePlatform(e.target.value as SocialPlatform)}
              className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-3 border border-slate-800 outline-none font-medium"
            >
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">X / Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok / Reel</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Orijinal Gönderi Metni</label>
            <textarea
              rows={6}
              value={sourceCaption}
              onChange={(e) => setSourceCaption(e.target.value)}
              placeholder="Dönüştürmek istediğiniz temel gönderi metnini buraya yapıştırın..."
              className="w-full bg-slate-950 text-slate-200 text-xs rounded-2xl p-3.5 border border-slate-800 focus:border-indigo-500 outline-none leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Dönüştürülecek Hedef Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'twitter', label: 'X / Twitter Flood' },
                { id: 'linkedin', label: 'LinkedIn Makale' },
                { id: 'tiktok', label: 'TikTok / Reel Script' },
                { id: 'instagram', label: 'Instagram Post' },
              ].map((plat) => (
                <button
                  key={plat.id}
                  type="button"
                  onClick={() => setTargetPlatform(plat.id as SocialPlatform)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                    targetPlatform === plat.id
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {plat.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRepurpose}
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-amber-300" />}
            <span>Çapraz Platforma Dönüştür (AI)</span>
          </button>

          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-300 text-xs">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Right Column: Repurposed Result (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {repurposedResult ? (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 shadow-xl relative">
              <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-800/60">
                    Dönüştürülmüş Format: {targetPlatform.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-extrabold text-white mt-2">{repurposedResult.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyResult}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>

                  <button
                    onClick={handleApplyToEditor}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Düzenleyicide Aç
                  </button>
                </div>
              </div>

              {/* Repurposed Caption View */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300">Yeni Metin & İçerik Düzeni</label>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans shadow-inner">
                  {repurposedResult.caption}
                </div>
              </div>

              {/* Hashtags & CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-400">Hashtagler</span>
                  <div className="flex flex-wrap gap-1.5">
                    {repurposedResult.hashtags.map((h, i) => (
                      <span key={i} className="text-xs font-medium text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-800/40">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-400">Eyleme Çağrı (CTA)</span>
                  <p className="text-xs font-semibold text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/40">
                    👉 {repurposedResult.callToAction}
                  </p>
                </div>
              </div>

              {/* Strategy Explanation */}
              <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-800/40 space-y-1">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Dönüşüm Mimarisi & Mantığı:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{repurposedResult.explanation}</p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-12 text-center text-slate-400 space-y-3">
              <Share2 className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm">Sol taraftan bir metin girip 'Dönüştür' butonuna basarak sonucunuzu görüntüleyin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
