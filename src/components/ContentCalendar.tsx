import React, { useState } from 'react';
import { ScheduledPost, ContentStatus, SocialPlatform } from '../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, CheckCircle, Clock, FileText, Send } from 'lucide-react';

interface ContentCalendarProps {
  scheduledPosts: ScheduledPost[];
  onSelectPost: (post: ScheduledPost) => void;
  onNewPostForDate: (dateStr: string) => void;
}

export const ContentCalendar: React.FC<ContentCalendarProps> = ({
  scheduledPosts,
  onSelectPost,
  onNewPostForDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  // Days in month calculation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getFilteredPosts = (dayNum: number) => {
    const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    return scheduledPosts.filter((post) => {
      const isDateMatch = post.scheduledDate === dateStr;
      const isStatusMatch = statusFilter === 'all' || post.status === statusFilter;
      const isPlatformMatch = platformFilter === 'all' || post.platform === platformFilter;
      return isDateMatch && isStatusMatch && isPlatformMatch;
    });
  };

  const statusBadges: Record<ContentStatus, { label: string; bg: string; text: string }> = {
    taslak: { label: 'Taslak', bg: 'bg-slate-800', text: 'text-slate-300' },
    onaylandi: { label: 'Onaylandı', bg: 'bg-blue-950/80', text: 'text-blue-300' },
    planlandi: { label: 'Planlandı', bg: 'bg-indigo-950/80', text: 'text-indigo-300' },
    yayinlandi: { label: 'Yayınlandı', bg: 'bg-emerald-950/80', text: 'text-emerald-300' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Calendar Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-400" />
            İçerik Yayın Takvimi
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Kampanyalarınızı ve gün gün planlanan sosyal medya gönderilerinizi görselleştirin.
          </p>
        </div>

        {/* Month Navigation & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-1.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-white px-3 min-w-[120px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 text-slate-200 text-xs font-medium border border-slate-800 rounded-xl px-3 py-2 outline-none"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="taslak">📝 Taslak</option>
            <option value="onaylandi">✅ Onaylandı</option>
            <option value="planlandi">📅 Planlandı</option>
            <option value="yayinlandi">🚀 Yayınlandı</option>
          </select>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-slate-900 text-slate-200 text-xs font-medium border border-slate-800 rounded-xl px-3 py-2 outline-none"
          >
            <option value="all">Tüm Platformlar</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter / X</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/80 text-center py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div>Paz</div>
          <div>Pzt</div>
          <div>Sal</div>
          <div>Çar</div>
          <div>Per</div>
          <div>Cum</div>
          <div>Cmt</div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-800/80 bg-slate-950/30">
          {/* Empty padding cells for first week */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="min-h-[120px] bg-slate-950/40 p-2" />
          ))}

          {/* Days in month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const posts = getFilteredPosts(dayNum);
            const isToday =
              new Date().getDate() === dayNum &&
              new Date().getMonth() === month &&
              new Date().getFullYear() === year;

            const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
            const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
            const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

            return (
              <div
                key={dayNum}
                className={`min-h-[130px] p-2 flex flex-col justify-between hover:bg-slate-800/30 transition-all group ${
                  isToday ? 'bg-indigo-950/20 border border-indigo-500/30' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${
                      isToday
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {dayNum}
                  </span>

                  <button
                    onClick={() => onNewPostForDate(dateStr)}
                    className="opacity-0 group-hover:opacity-100 text-indigo-400 hover:text-indigo-300 p-1 rounded-lg hover:bg-slate-800 transition-all text-xs flex items-center gap-0.5"
                    title="Bu güne yeni gönderi ekle"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Scheduled Posts list on this day */}
                <div className="space-y-1.5 my-1 flex-1 overflow-y-auto max-h-[100px] no-scrollbar">
                  {posts.map((post) => {
                    const badge = statusBadges[post.status] || statusBadges.taslak;
                    return (
                      <div
                        key={post.id}
                        onClick={() => onSelectPost(post)}
                        className={`p-1.5 rounded-lg border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all ${badge.bg} text-[11px] font-medium leading-tight space-y-0.5`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-100 uppercase text-[9px] tracking-wider">
                            {post.platform}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">{post.scheduledTime || '12:00'}</span>
                        </div>
                        <p className="text-slate-200 font-medium truncate">{post.title || post.caption}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
