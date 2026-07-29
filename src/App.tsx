import React, { useState } from 'react';
import { BrandProfile, PostVariation, ScheduledPost, ContentStatus } from './types';
import { INITIAL_BRANDS, INITIAL_SCHEDULED_POSTS } from './data/mockData';
import { Header } from './components/Header';
import { PostGenerator } from './components/PostGenerator';
import { PostEditor } from './components/PostEditor';
import { ContentCalendar } from './components/ContentCalendar';
import { KanbanBoard } from './components/KanbanBoard';
import { BrandProfileView } from './components/BrandProfileView';
import { AnalyticsView } from './components/AnalyticsView';
import { HashtagResearchView } from './components/HashtagResearchView';
import { ContentRepurposerView } from './components/ContentRepurposerView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('generator');
  const [brands, setBrands] = useState<BrandProfile[]>(INITIAL_BRANDS);
  const [selectedBrand, setSelectedBrand] = useState<BrandProfile>(INITIAL_BRANDS[0]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(INITIAL_SCHEDULED_POSTS);

  // State for post currently open in editor
  const [currentPost, setCurrentPost] = useState<Partial<PostVariation>>({
    id: 'post-draft-1',
    title: 'Instagram Taslak Gönderi',
    caption: '🚀 Yapay zeka ile sosyal medya içeriklerinizi 10 kat daha hızlı hazırlayın! Tek tıkla kanca cümleler, hashtag grupları ve görsel fikirleri üretin. \n\nSiz hangi sosyal medya platformunu daha aktif kullanıyorsunuz?',
    hashtags: ['#SocialPulseAI', '#SosyalMedya', '#YapayZeka', '#DijitalPazarlama'],
    callToAction: 'Düşüncelerinizi yorumlarda paylaşın! 👇',
    visualIdea: 'Karanlık temalı modern SaaS arayüz tasarımı ve fütüristik parıltı ışık efekti.',
    estimatedViralityScore: 90,
    improvementTip: 'Görsel konsept olarak canlı telefon mock-up görseli ekleyebilirsiniz.',
    platform: 'instagram',
    tone: 'Profesyonel',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '18:00',
    status: 'taslak',
    brandName: selectedBrand.name,
  });

  const handleSelectVariationForEditor = (variation: PostVariation) => {
    setCurrentPost({
      ...variation,
      brandName: selectedBrand.name,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '12:00',
      status: 'taslak',
    });
    setActiveTab('editor');
  };

  const handleSchedulePostFromGenerator = (variation: PostVariation) => {
    const newScheduled: ScheduledPost = {
      ...variation,
      id: `scheduled-${Date.now()}`,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '14:00',
      status: 'planlandi',
      createdAt: new Date().toISOString(),
      brandName: selectedBrand.name,
    };

    setScheduledPosts((prev) => [newScheduled, ...prev]);
    setActiveTab('calendar');
  };

  const handleSavePostFromEditor = (savedPost: ScheduledPost) => {
    setScheduledPosts((prev) => {
      const exists = prev.some((p) => p.id === savedPost.id);
      if (exists) {
        return prev.map((p) => (p.id === savedPost.id ? savedPost : p));
      }
      return [savedPost, ...prev];
    });

    setActiveTab('calendar');
  };

  const handleUpdateKanbanStatus = (postId: string, newStatus: ContentStatus) => {
    setScheduledPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: newStatus } : p))
    );
  };

  const handleAddBrand = (newBrand: BrandProfile) => {
    setBrands((prev) => [...prev, newBrand]);
  };

  const handleNewPostForDateFromCalendar = (dateStr: string) => {
    setCurrentPost({
      id: `new-${Date.now()}`,
      title: 'Yeni Planlanan Gönderi',
      caption: '',
      hashtags: ['#YeniIcerik'],
      callToAction: '',
      visualIdea: '',
      estimatedViralityScore: 85,
      improvementTip: '',
      platform: 'instagram',
      tone: 'Profesyonel',
      scheduledDate: dateStr,
      scheduledTime: '12:00',
      status: 'planlandi',
      brandName: selectedBrand.name,
    });
    setActiveTab('editor');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        brandName={selectedBrand?.name || 'SaaS Brand'}
        onOpenCreateModal={() => setActiveTab('generator')}
      />

      <main className="pb-16">
        {activeTab === 'generator' && (
          <PostGenerator
            brands={brands}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            onSelectVariationForEditor={handleSelectVariationForEditor}
            onSchedulePost={handleSchedulePostFromGenerator}
          />
        )}

        {activeTab === 'editor' && (
          <PostEditor
            currentPost={currentPost}
            setCurrentPost={setCurrentPost}
            onSavePost={handleSavePostFromEditor}
            brandName={selectedBrand?.name}
          />
        )}

        {activeTab === 'hashtags' && (
          <HashtagResearchView
            onApplyHashtagsToEditor={(newHashtags) => {
              setCurrentPost((prev) => ({
                ...prev,
                hashtags: newHashtags,
              }));
              setActiveTab('editor');
            }}
          />
        )}

        {activeTab === 'repurpose' && (
          <ContentRepurposerView
            scheduledPosts={scheduledPosts}
            onOpenInEditor={(newPost) => {
              setCurrentPost(newPost);
              setActiveTab('editor');
            }}
          />
        )}

        {activeTab === 'calendar' && (
          <ContentCalendar
            scheduledPosts={scheduledPosts}
            onSelectPost={(post) => {
              setCurrentPost(post);
              setActiveTab('editor');
            }}
            onNewPostForDate={handleNewPostForDateFromCalendar}
          />
        )}

        {activeTab === 'kanban' && (
          <KanbanBoard
            scheduledPosts={scheduledPosts}
            onSelectPost={(post) => {
              setCurrentPost(post);
              setActiveTab('editor');
            }}
            onUpdateStatus={handleUpdateKanbanStatus}
            onNewPost={() => setActiveTab('generator')}
          />
        )}

        {activeTab === 'brand' && (
          <BrandProfileView
            brands={brands}
            onAddBrand={handleAddBrand}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            scheduledPosts={scheduledPosts}
            brandName={selectedBrand?.name}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/50 py-6 text-center text-xs text-slate-400">
        <p>© 2026 SocialPulse AI Studio — Yapay Zeka Sosyal Medya İçerik SaaS Platformu</p>
      </footer>
    </div>
  );
}
