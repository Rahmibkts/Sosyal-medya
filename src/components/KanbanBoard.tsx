import React from 'react';
import { ScheduledPost, ContentStatus } from '../types';
import { LayoutGrid, Plus, ArrowRight, ArrowLeft, Clock, CheckCircle2, Send, FileText, Calendar } from 'lucide-react';

interface KanbanBoardProps {
  scheduledPosts: ScheduledPost[];
  onSelectPost: (post: ScheduledPost) => void;
  onUpdateStatus: (postId: string, newStatus: ContentStatus) => void;
  onNewPost: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  scheduledPosts,
  onSelectPost,
  onUpdateStatus,
  onNewPost,
}) => {
  const columns: { id: ContentStatus; title: string; icon: any; color: string }[] = [
    { id: 'taslak', title: '📝 Taslaklar', icon: FileText, color: 'text-slate-400 border-slate-700' },
    { id: 'onaylandi', title: '✅ Onaylandı', icon: CheckCircle2, color: 'text-blue-400 border-blue-800' },
    { id: 'planlandi', title: '📅 Planlandı', icon: Calendar, color: 'text-indigo-400 border-indigo-800' },
    { id: 'yayinlandi', title: '🚀 Yayınlandı', icon: Send, color: 'text-emerald-400 border-emerald-800' },
  ];

  const getPostsByStatus = (status: ContentStatus) => {
    return scheduledPosts.filter((post) => post.status === status);
  };

  const getNextStatus = (current: ContentStatus): ContentStatus | null => {
    if (current === 'taslak') return 'onaylandi';
    if (current === 'onaylandi') return 'planlandi';
    if (current === 'planlandi') return 'yayinlandi';
    return null;
  };

  const getPrevStatus = (current: ContentStatus): ContentStatus | null => {
    if (current === 'yayinlandi') return 'planlandi';
    if (current === 'planlandi') return 'onaylandi';
    if (current === 'onaylandi') return 'taslak';
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-indigo-400" />
            İçerik Akışı Panosu (Kanban Pipeline)
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            İçeriklerinizi fikirden yayına kadar her aşamada takip edin ve yönetin.
          </p>
        </div>

        <button
          onClick={onNewPost}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Yeni Kart Ekle
        </button>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => {
          const posts = getPostsByStatus(col.id);
          const ColumnIcon = col.icon;

          return (
            <div key={col.id} className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 space-y-4 flex flex-col min-h-[500px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ColumnIcon className={`w-4 h-4 ${col.color}`} />
                  <h3 className="font-bold text-slate-200 text-sm">{col.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-bold">
                  {posts.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
                {posts.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-500 italic border border-dashed border-slate-800/80 rounded-2xl">
                    Bu aşamada kart yok.
                  </div>
                )}

                {posts.map((post) => {
                  const prevStatus = getPrevStatus(post.status);
                  const nextStatus = getNextStatus(post.status);

                  return (
                    <div
                      key={post.id}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-indigo-500/40 transition-all space-y-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                          {post.platform}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-400">
                          %{post.estimatedViralityScore} Skor
                        </span>
                      </div>

                      <h4
                        onClick={() => onSelectPost(post)}
                        className="font-bold text-white text-xs hover:text-indigo-400 cursor-pointer line-clamp-2 leading-snug"
                      >
                        {post.title || post.caption}
                      </h4>

                      <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                        {post.caption}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {post.scheduledDate} ({post.scheduledTime || '12:00'})
                        </span>
                      </div>

                      {/* Move status buttons */}
                      <div className="flex items-center justify-between pt-1">
                        {prevStatus ? (
                          <button
                            onClick={() => onUpdateStatus(post.id, prevStatus)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all text-xs flex items-center gap-1"
                            title="Önceki Aşamaya Taşı"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        ) : <div />}

                        <button
                          onClick={() => onSelectPost(post)}
                          className="text-[11px] font-semibold text-indigo-400 hover:underline"
                        >
                          Düzenle
                        </button>

                        {nextStatus ? (
                          <button
                            onClick={() => onUpdateStatus(post.id, nextStatus)}
                            className="p-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 transition-all text-xs flex items-center gap-1"
                            title="Sonraki Aşamaya Taşı"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : <div />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
