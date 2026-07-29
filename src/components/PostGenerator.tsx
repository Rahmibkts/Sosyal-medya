import React, { useState } from 'react';
import { BrandProfile, GeneratorOptions, PostVariation, SocialPlatform, ToneOption } from '../types';
import { Sparkles, Loader2, Copy, Check, Calendar, ArrowRight, Wand2, Lightbulb, Zap, HelpCircle } from 'lucide-react';

interface PostGeneratorProps {
  brands: BrandProfile[];
  selectedBrand: BrandProfile;
  setSelectedBrand: (brand: BrandProfile) => void;
  onSelectVariationForEditor: (variation: PostVariation) => void;
  onSchedulePost: (variation: PostVariation) => void;
}

export const PostGenerator: React.FC<PostGeneratorProps> = ({
  brands,
  selectedBrand,
  setSelectedBrand,
  onSelectVariationForEditor,
  onSchedulePost,
}) => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [tone, setTone] = useState<ToneOption>('profesyonel');
  const [language, setLanguage] = useState('Türkçe');
  const [audience, setAudience] = useState(selectedBrand?.targetAudience || 'Genel kitle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedVariations, setGeneratedVariations] = useState<PostVariation[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [options, setOptions] = useState<GeneratorOptions>({
    includeHashtags: true,
    includeCallToAction: true,
    includeVisualIdea: true,
    includeEmojis: true,
  });

  const quickTemplates = [
    { label: '🚀 Yeni Ürün / Hizmet Lansmanı', prompt: 'Yeni nesil mobil uygulamamızın lansmanı için merak uyandıran duyuru gönderisi' },
    { label: '⚡ Hafta Sonu İndirimi', prompt: 'Seçili ürünlerde geçerli %30 hafta sonu özel indirimi duyurusu' },
    { label: '💡 Eğitici Tavsiye & İpuçları', prompt: 'Sektörümüzde verimliliği 3 katına çıkaran 5 pratik altın tavsiye' },
    { label: '🔥 Soru & Topluluk Etkileşimi', prompt: 'Takipçilerin yorum yapmasını sağlayacak eğlenceli ve tartışmalı soru' },
    { label: '🎯 Müşteri Başarı Hikayesi', prompt: 'Hizmetimizi kullanarak cirosunu 2 katına çıkaran müşterimizin başarı hikayesi' },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Lütfen bir konu veya fikir açıklaması girin.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          platform,
          tone,
          audience,
          language,
          options,
          brandName: selectedBrand?.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gönderi üretilirken hata oluştu.');
      }

      setGeneratedVariations(data.variations || []);
    } catch (err: any) {
      setError(err.message || 'Yapay zeka yanıt veremedi. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            Gemini 3.6 Flash Motoru ile Güçlendirildi
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sosyal Medya Gönderi & Metin Stüdyosu
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Markanızın ses tonuna uygun, yüksek etkileşimli sosyal medya içeriklerini, hashtag gruplarını ve görsel konseptlerini saniyeler içinde oluşturun.
          </p>
        </div>
      </div>

      {/* Main Generator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-indigo-400" />
              İçerik Parametreleri
            </h2>
            {/* Brand Select */}
            <select
              value={selectedBrand?.id}
              onChange={(e) => {
                const b = brands.find((brand) => brand.id === e.target.value);
                if (b) {
                  setSelectedBrand(b);
                  setAudience(b.targetAudience);
                }
              }}
              className="bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Templates */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Hızlı Hazır Şablonlar:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickTemplates.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(t.prompt)}
                  className="text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 transition-all text-left"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Gönderi Konusu veya Detayları *</span>
              <span className="text-[10px] text-slate-500">{topic.length}/500</span>
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Örn: Hafta sonu Kahve Festivali için hazırladığımız özel soğuk demleme paketini duyuruyoruz. Fiyat 150 TL..."
              rows={4}
              className="w-full bg-slate-950 text-slate-100 text-sm rounded-xl p-3.5 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none placeholder-slate-600"
            />
          </div>

          {/* Platform Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Hedef Platform</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'instagram', label: 'Instagram' },
                { id: 'linkedin', label: 'LinkedIn' },
                { id: 'twitter', label: 'Twitter / X' },
                { id: 'facebook', label: 'Facebook' },
                { id: 'tiktok', label: 'TikTok / Reel' },
                { id: 'youtube', label: 'YouTube Shorts' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id as SocialPlatform)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    platform === p.id
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone & Language */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Ses Tonu (Tone)</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as ToneOption)}
                className="w-full bg-slate-950 text-slate-200 text-xs font-medium border border-slate-800 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="profesyonel">💼 Profesyonel & Kurumsal</option>
                <option value="samimi">😊 Samimi & Doğal</option>
                <option value="mizahi">😄 Mizahi & Eğlenceli</option>
                <option value="ilham_verici">✨ İlham Verici & Motive</option>
                <option value="satis_odakli">🎯 Satış & Dönüşüm Odaklı</option>
                <option value="egitici">📚 Eğitici & Bilgilendirici</option>
                <option value="heyecanli">🔥 Heyecanlı & Dinamik</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Dil</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 text-xs font-medium border border-slate-800 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Türkçe">🇹🇷 Türkçe</option>
                <option value="İngilizce">🇬🇧 İngilizce (English)</option>
                <option value="Almanca">🇩🇪 Almanca (Deutsch)</option>
                <option value="İspanyolca">🇪🇸 İspanyolca (Español)</option>
              </select>
            </div>
          </div>

          {/* Options Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <label className="text-xs font-semibold text-slate-400">Gelişmiş Seçenekler</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeHashtags}
                  onChange={(e) => setOptions({ ...options, includeHashtags: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                Hashtag Grupları
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeCallToAction}
                  onChange={(e) => setOptions({ ...options, includeCallToAction: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                Eyleme Çağrı (CTA)
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeVisualIdea}
                  onChange={(e) => setOptions({ ...options, includeVisualIdea: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                Görsel Konsept Önerisi
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeEmojis}
                  onChange={(e) => setOptions({ ...options, includeEmojis: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                Emoji Zenginleştirme
              </label>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-300 text-xs font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI Varyasyonları Hazırlanıyor...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                3 Gönderi Varyasyonu Üret
              </>
            )}
          </button>
        </div>

        {/* Right Output Area (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Üretilen Gönderi Varyasyonları
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {generatedVariations.length} Varyasyon Hazır
            </span>
          </div>

          {isLoading && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto" />
              <div>
                <h4 className="text-white font-bold text-base">Gemini Yapay Zeka Metin Yazıyor...</h4>
                <p className="text-slate-400 text-xs mt-1">
                  Kanca cümleler, hashtag grupları ve etkileşim analizleri hesaplanıyor.
                </p>
              </div>
            </div>
          )}

          {!isLoading && generatedVariations.length === 0 && (
            <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto text-indigo-400">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-white font-bold text-base">Henüz İçerik Üretilmedi</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Sol taraftaki parametreleri doldurup <strong>"3 Gönderi Varyasyonu Üret"</strong> butonuna tıklayarak ilk içeriklerinizi saniyeler içinde hazırlayabilirsiniz.
                </p>
              </div>
            </div>
          )}

          {!isLoading && generatedVariations.length > 0 && (
            <div className="space-y-6">
              {generatedVariations.map((variation, index) => (
                <div
                  key={variation.id || index}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-indigo-500/40 transition-all space-y-4"
                >
                  {/* Variation Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h4 className="font-bold text-white text-base">{variation.title}</h4>
                    </div>
                    {/* Virality Score Badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                      <span>Erişim Skoru: %{variation.estimatedViralityScore || 88}</span>
                    </div>
                  </div>

                  {/* Caption Content */}
                  <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/80 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {variation.caption}
                  </div>

                  {/* Hashtags & CTA */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {variation.hashtags && variation.hashtags.length > 0 && (
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-indigo-400 font-semibold block mb-1"># Hashtagler:</span>
                        <p className="text-slate-300">{variation.hashtags.join(' ')}</p>
                      </div>
                    )}
                    {variation.callToAction && (
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-amber-400 font-semibold block mb-1">👉 Eyleme Çağrı (CTA):</span>
                        <p className="text-slate-300">{variation.callToAction}</p>
                      </div>
                    )}
                  </div>

                  {/* Visual Idea & Tip */}
                  {variation.visualIdea && (
                    <div className="bg-indigo-950/30 p-3.5 rounded-xl border border-indigo-900/50 text-xs space-y-1">
                      <span className="text-indigo-300 font-semibold flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        Görsel / Video Konsept Fikri:
                      </span>
                      <p className="text-slate-300 italic">{variation.visualIdea}</p>
                    </div>
                  )}

                  {variation.improvementTip && (
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span><strong>AI Geliştirme Tavsiyesi:</strong> {variation.improvementTip}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
                    <button
                      onClick={() => handleCopy(`${variation.caption}\n\n${variation.hashtags.join(' ')}\n\n${variation.callToAction}`, variation.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                    >
                      {copiedId === variation.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Kopyalandı!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Metni Kopyala
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSchedulePost(variation)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-all"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Takvime Ekle
                      </button>

                      <button
                        onClick={() => onSelectVariationForEditor(variation)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
                      >
                        Düzenleyicide Aç
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
