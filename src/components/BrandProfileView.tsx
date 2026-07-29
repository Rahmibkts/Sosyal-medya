import React, { useState } from 'react';
import { BrandProfile } from '../types';
import { Award, Plus, Sparkles, Loader2, Check, Hash, Users, Layers, Bookmark } from 'lucide-react';

interface BrandProfileViewProps {
  brands: BrandProfile[];
  onAddBrand: (brand: BrandProfile) => void;
  selectedBrand: BrandProfile;
  setSelectedBrand: (brand: BrandProfile) => void;
}

export const BrandProfileView: React.FC<BrandProfileViewProps> = ({
  brands,
  onAddBrand,
  selectedBrand,
  setSelectedBrand,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);

  const handleGenerateBrandVoice = async () => {
    if (!businessName || !industry) return;
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-brand-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, industry, description }),
      });

      const data = await response.json();
      setAiResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveNewBrand = () => {
    if (!businessName) return;

    const newBrand: BrandProfile = {
      id: `brand-${Date.now()}`,
      name: businessName,
      industry: industry || 'Genel Sektör',
      description: description || 'Açıklama belirtilmedi.',
      targetAudience: aiResult?.targetAudience || 'Genel kitle',
      recommendedTones: aiResult?.recommendedTones || ['Profesyonel', 'Samimi'],
      signatureHashtags: aiResult?.signatureHashtags || [`#${businessName.replace(/\s+/g, '')}`],
      contentPillars: aiResult?.contentPillars || ['Sektör İpuçları', 'Ürün Duyuruları'],
      brandBio: aiResult?.brandBio || `${businessName} resmi sosyal medya hesabı.`,
      primaryColor: '#6366F1',
    };

    onAddBrand(newBrand);
    setSelectedBrand(newBrand);
    setShowAddModal(false);
    setBusinessName('');
    setIndustry('');
    setDescription('');
    setAiResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-400" />
            Marka Kimliği & Ses Tonu Yönetimi
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Her markanıza özgü AI ses tonunu, imza hashtag gruplarını ve hedef kitlenizi tanımlayın.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg hover:opacity-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Yeni Marka Profili Oluştur
        </button>
      </div>

      {/* Brand Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => {
          const isSelected = selectedBrand?.id === brand.id;
          return (
            <div
              key={brand.id}
              onClick={() => setSelectedBrand(brand)}
              className={`bg-slate-900 rounded-3xl border p-6 cursor-pointer transition-all space-y-4 shadow-xl relative overflow-hidden ${
                isSelected
                  ? 'border-indigo-500 shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-md text-sm"
                    style={{ backgroundColor: brand.primaryColor || '#6366F1' }}
                  >
                    {brand.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug">{brand.name}</h3>
                    <span className="text-xs text-indigo-400 font-medium">{brand.industry}</span>
                  </div>
                </div>

                {isSelected && (
                  <span className="p-1 rounded-full bg-indigo-500 text-white">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950 p-3 rounded-xl border border-slate-800">
                "{brand.brandBio}"
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-1.5 text-slate-300">
                  <Users className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Hedef Kitle:</strong> {brand.targetAudience}</span>
                </div>

                <div className="flex items-start gap-1.5 text-slate-300">
                  <Hash className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>İmza Hashtagler:</strong> {brand.signatureHashtags.join(' ')}</span>
                </div>

                <div className="flex items-start gap-1.5 text-slate-300">
                  <Layers className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>İçerik Sütunları:</strong> {brand.contentPillars.join(', ')}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                {brand.recommendedTones.map((tone, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-semibold border border-slate-700"
                  >
                    ✨ {tone}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Brand Profile Generator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                AI Destekli Marka Kimliği Oluşturucu
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Kapat [✕]
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Marka / Şirket Adı *</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Örn: Moka Coffee Roasters"
                  className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-3 border border-slate-800 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Sektör *</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Örn: Nitelikli Kahve / Cafe / Gıda"
                  className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-3 border border-slate-800 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Marka Açıklaması & Amacı</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Örn: İstanbul Kadıköy ve Nişantaşı şubelerimizle taze kavrulmuş kahve çekirdekleri sunuyoruz..."
                  rows={3}
                  className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl p-3 border border-slate-800 outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                onClick={handleGenerateBrandVoice}
                disabled={isGenerating || !businessName || !industry}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI Ses Tonu Analiz Ediliyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    AI ile Marka Ses Tonunu & Stratejisini Çıkar
                  </>
                )}
              </button>

              {aiResult && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/30 space-y-3 text-xs">
                  <span className="text-indigo-400 font-bold block">✨ AI Analiz Sonuçları:</span>

                  <p className="text-slate-300"><strong>Bio:</strong> {aiResult.brandBio}</p>
                  <p className="text-slate-300"><strong>Hedef Kitle:</strong> {aiResult.targetAudience}</p>

                  <div>
                    <strong className="text-slate-300">Önerilen Ses Tonları:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {aiResult.recommendedTones?.map((t: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <strong className="text-slate-300">İçerik Sütunları:</strong>
                    <p className="text-slate-400 mt-0.5">{aiResult.contentPillars?.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                İptal
              </button>
              <button
                onClick={handleSaveNewBrand}
                disabled={!businessName}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
              >
                Markayı Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
