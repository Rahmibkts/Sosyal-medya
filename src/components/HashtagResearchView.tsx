import React, { useState } from 'react';
import { Hash, Sparkles, Copy, Check, Search, TrendingUp, Target, Zap, ArrowRight, Lightbulb, Loader2 } from 'lucide-react';

interface HashtagResult {
  highReach: { tag: string; volume: string; competition: string }[];
  niche: { tag: string; volume: string; competition: string }[];
  trending: { tag: string; volume: string; competition: string }[];
  bestGroup: string[];
  tips: string[];
}

export const HashtagResearchView: React.FC<{
  onApplyHashtagsToEditor?: (hashtags: string[]) => void;
}> = ({ onApplyHashtagsToEditor }) => {
  const [keyword, setKeyword] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HashtagResult | null>({
    highReach: [
      { tag: '#SosyalMedya', volume: '1.8M Gönderi', competition: 'Yüksek' },
      { tag: '#YapayZeka', volume: '2.4M Gönderi', competition: 'Yüksek' },
      { tag: '#DijitalPazarlama', volume: '950K Gönderi', competition: 'Orta' },
    ],
    niche: [
      { tag: '#SaaSStratejileri', volume: '45K Gönderi', competition: 'Düşük' },
      { tag: '#PazarlamaTaktikleri', volume: '120K Gönderi', competition: 'Orta' },
      { tag: '#IcerikUreticisi', volume: '310K Gönderi', competition: 'Orta' },
    ],
    trending: [
      { tag: '#AIpazarlama2026', volume: '28K Gönderi', competition: 'Düşük' },
      { tag: '#GrowthHackingTR', volume: '85K Gönderi', competition: 'Düşük' },
      { tag: '#IcerikPazarlamasi', volume: '540K Gönderi', competition: 'Orta' },
    ],
    bestGroup: [
      '#SosyalMedya',
      '#YapayZeka',
      '#DijitalPazarlama',
      '#SaaSStratejileri',
      '#IcerikUreticisi',
      '#AIpazarlama2026',
      '#GrowthHackingTR',
    ],
    tips: [
      '3 Yüksek Erişimli, 3 Niş ve 2 Trend hashtag karışımı algoritma etkileşimini %40 artırır.',
      'Hashtagleri açıklama metninin altına 2 satır boşluk bırakarak ekleyin, görsel karmaşayı önleyin.',
    ],
  });

  const [copiedGroup, setCopiedGroup] = useState(false);

  const handleResearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!keyword.trim()) {
      setError('Lütfen araştırmak istediğiniz bir konu veya anahtar kelime yazın.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, platform }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        throw new Error(data.error || 'Hashtag analizi başarısız oldu.');
      }
    } catch (err: any) {
      setError(err.message || 'Hashtag analizi yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const copyBestGroup = () => {
    if (!result?.bestGroup) return;
    navigator.clipboard.writeText(result.bestGroup.join(' '));
    setCopiedGroup(true);
    setTimeout(() => setCopiedGroup(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Hash className="w-7 h-7 text-indigo-400" />
            AI Hashtag & Niş Trend Araştırması
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Sektörünüze özel yüksek erişimli, niş ve yükselen trend hashtag gruplarını AI ile dakikalar içinde keşfedin.
          </p>
        </div>

        {result && onApplyHashtagsToEditor && (
          <button
            onClick={() => onApplyHashtagsToEditor(result.bestGroup)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all active:scale-95"
          >
            <ArrowRight className="w-4 h-4" />
            Canlı Düzenleyiciye Aktar
          </button>
        )}
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleResearch} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Örn: Yapay Zeka Pazarlama, Yazılım Girişimleri, E-Ticaret, Moda, Fitness..."
              className="w-full bg-slate-950 text-white text-sm rounded-2xl pl-12 pr-4 py-3 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-3">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="bg-slate-950 text-slate-200 text-sm rounded-2xl p-3 border border-slate-700/80 focus:border-indigo-500 outline-none font-medium cursor-pointer"
            >
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">X / Twitter</option>
              <option value="tiktok">TikTok</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-sm rounded-2xl shadow-md shadow-indigo-600/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Analiz Et</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-300 text-xs">
            ⚠️ {error}
          </div>
        )}
      </form>

      {/* Results Display */}
      {result && (
        <div className="space-y-8">
          {/* Best Group Highlight Card */}
          <div className="bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 p-6 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Önerilen Altın Hashtag Grubu</h3>
                  <p className="text-xs text-slate-300">
                    Erişim ve Hedef Kitle dengesi algoritma açısından optimize edilmiş 7-10 hashtag kombinasyonu.
                  </p>
                </div>
              </div>

              <button
                onClick={copyBestGroup}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-md"
              >
                {copiedGroup ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedGroup ? 'Kopyalandı!' : 'Grubu Kopyala'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {result.bestGroup.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-200 text-xs font-semibold border border-indigo-700/50 transition-all cursor-pointer shadow-sm"
                  onClick={() => navigator.clipboard.writeText(tag)}
                  title="Tıklayarak kopyalayın"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Three Metric Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* High Reach */}
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Yüksek Erişimli</h4>
                  <p className="text-[11px] text-slate-400">Geniş kitlelere ulaşan popüler etiketler</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {result.highReach.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                    <span className="font-semibold text-indigo-300">{item.tag}</span>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">{item.volume}</span>
                      <span className="text-[10px] text-emerald-400 font-medium">Rekabet: {item.competition}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Niche */}
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Target className="w-5 h-5 text-purple-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Niş & Hedef Odaklı</h4>
                  <p className="text-[11px] text-slate-400">Dönüşüm oranı yüksek spesifik etiketler</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {result.niche.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                    <span className="font-semibold text-purple-300">{item.tag}</span>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">{item.volume}</span>
                      <span className="text-[10px] text-purple-400 font-medium">Rekabet: {item.competition}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Yükselen Trendler</h4>
                  <p className="text-[11px] text-slate-400">Son günlerde hızı artan ivmeli etiketler</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {result.trending.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                    <span className="font-semibold text-amber-300">{item.tag}</span>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">{item.volume}</span>
                      <span className="text-[10px] text-amber-400 font-medium">Rekabet: {item.competition}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategy Tips Box */}
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              AI Hashtag Strateji İpuçları
            </h4>
            <ul className="space-y-2">
              {result.tips.map((tip, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
