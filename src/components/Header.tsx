import React from 'react';
import { Sparkles, Calendar, LayoutGrid, Award, BarChart3, Edit3, PlusCircle, Layers, Hash, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  brandName: string;
  onOpenCreateModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  brandName,
  onOpenCreateModal,
}) => {
  const tabs = [
    { id: 'generator', label: 'AI İçerik Üretici', icon: Sparkles },
    { id: 'editor', label: 'Canlı Düzenleyici', icon: Edit3 },
    { id: 'hashtags', label: 'Hashtag & Trend', icon: Hash },
    { id: 'repurpose', label: 'Çapraz Dönüştürücü', icon: RefreshCw },
    { id: 'calendar', label: 'İçerik Takvimi', icon: Calendar },
    { id: 'kanban', label: 'Kampanya Panosu', icon: LayoutGrid },
    { id: 'brand', label: 'Marka Kimliği', icon: Award },
    { id: 'analytics', label: 'Performans Tahmini', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  SocialPulse AI
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  SaaS Studio
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Aktif Marka: <span className="text-indigo-400 font-semibold">{brandName}</span>
              </p>
            </div>
          </div>

          {/* Action Quick Create */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('generator');
                if (onOpenCreateModal) onOpenCreateModal();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-sm font-semibold shadow-md shadow-indigo-600/25 hover:opacity-95 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Yeni Gönderi Üret
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
