import React from 'react';
import { ScheduledPost } from '../types';
import { BarChart3, TrendingUp, Zap, Clock, ThumbsUp, Eye, Hash, Award, CheckCircle2 } from 'lucide-react';

interface AnalyticsViewProps {
  scheduledPosts: ScheduledPost[];
  brandName?: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ scheduledPosts, brandName = 'SaaS Brand' }) => {
  const totalPosts = scheduledPosts.length;
  const avgVirality =
    totalPosts > 0
      ? Math.round(scheduledPosts.reduce((acc, p) => acc + (p.estimatedViralityScore || 85), 0) / totalPosts)
      : 88;

  const bestPostingTimes = [
    { platform: 'Instagram', time: '18:30 - 21:00', day: 'Çarşamba & Hafta Sonu', icon: '📸' },
    { platform: 'LinkedIn', time: '08:30 - 10:30', day: 'Salı & Perşembe', icon: '💼' },
    { platform: 'Twitter / X', time: '12:00 - 14:00', day: 'Pazartesi - Cuma', icon: '🐦' },
    { platform: 'TikTok / Reels', time: '19:00 - 22:30', day: 'Cuma & Cumartesi', icon: '🎵' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            AI Etkileşim Tahminleri & Analiz Paneli
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Gemini algoritması tarafından hesaplanan viralleşme potansiyelleri ve en iyi yayınlama zamanları.
          </p>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Ortalama Erişim Skoru</span>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">%{avgVirality}</p>
          <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> %12 Yüksek Performans
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Toplam Üretilen İçerik</span>
            <Award className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{totalPosts} Gönderi</p>
          <span className="text-slate-400 text-xs font-medium">Bu Ayki Üretim Hacmi</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tahmini Erişim Düzeyi</span>
            <Eye className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">24.5K +</p>
          <span className="text-slate-400 text-xs font-medium">Model Tahmini Potansiyel</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">En Yüksek Etkileşim Tipi</span>
            <ThumbsUp className="w-5 h-5 text-pink-400" />
          </div>
          <p className="text-xl font-extrabold text-white truncate">Soru & Kaydetmeli Carousel</p>
          <span className="text-emerald-400 text-xs font-medium">Dönüşüm Oranı En Yüksek</span>
        </div>
      </div>

      {/* Best Posting Times Table & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            Platformlara Göre En İdeal Yayın Saatleri
          </h3>
          <p className="text-xs text-slate-400">
            Kullanıcı etkileşiminin zirve yaptığı altın saat dilimleri:
          </p>

          <div className="space-y-3 pt-2">
            {bestPostingTimes.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <h4 className="font-bold text-white">{item.platform}</h4>
                    <span className="text-slate-400">{item.day}</span>
                  </div>
                </div>

                <span className="px-3 py-1.5 rounded-xl bg-indigo-950 text-indigo-300 font-bold border border-indigo-800/40">
                  ⏰ {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Actionable Optimization Tips */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Erişimi Artıracak 4 Altın AI Tavsiyesi
          </h3>

          <div className="space-y-3 text-xs leading-relaxed">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">İlk 3 Saniyede Kanca (Hook) Kullanın:</strong>
                <span className="text-slate-400">Metinlerinizin ilk cümlesinde merak uyandıran sorular veya rakamlar belirtin.</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">6-8 Arası Spesifik Hashtag:</strong>
                <span className="text-slate-400">Jenerik yerine niş ve doğrudan hedef kitleye yönelik hashtag kombinasyonları kullanın.</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Net Eyleme Çağrı (CTA):</strong>
                <span className="text-slate-400">"Sizce hangisi?" veya "Arkadaşını etiketle!" gibi açık yönlendirmeler yorum oranını %35 artırır.</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Carousel / Kaydırmalı Gönderiler:</strong>
                <span className="text-slate-400">Instagram algoritması kaydırmalı gönderileri akışta 2. kez öne çıkarmaktadır.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
