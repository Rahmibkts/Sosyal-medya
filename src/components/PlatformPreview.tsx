import React from 'react';
import { PostVariation, SocialPlatform } from '../types';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Globe, Repeat, ThumbsUp, Send } from 'lucide-react';

interface PlatformPreviewProps {
  post: Partial<PostVariation>;
  platform: SocialPlatform;
  brandName?: string;
  mediaUrl?: string;
}

export const PlatformPreview: React.FC<PlatformPreviewProps> = ({
  post,
  platform,
  brandName = 'SaaS Brand',
  mediaUrl,
}) => {
  const captionText = post.caption || 'Gönderi açıklamanız burada gerçek zamanlı olarak görünecek...';
  const hashtagsList = post.hashtags && post.hashtags.length > 0 ? post.hashtags : ['#SosyalMedya', '#YapayZeka'];
  const ctaText = post.callToAction || '';

  if (platform === 'instagram') {
    return (
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden max-w-sm mx-auto font-sans">
        {/* Real-time Indicator Header */}
        <div className="bg-indigo-950/80 px-3 py-1.5 border-b border-indigo-800/40 flex items-center justify-between text-[11px] text-indigo-300 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>Gerçek Zamanlı Önizleme</span>
          </span>
          <div className="flex items-center gap-2">
            {post.tone && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-900/80 text-[10px] text-amber-300 font-bold border border-indigo-700/60 shadow-sm">
                🎭 {post.tone}
              </span>
            )}
            <span className="text-indigo-400 font-bold uppercase">Instagram</span>
          </div>
        </div>

        {/* Post Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-xs font-bold text-indigo-400">
                {brandName.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-100 leading-tight">{brandName.toLowerCase().replace(/\s+/g, '')}</p>
              <p className="text-[10px] text-slate-400">Orijinal Gönderi</p>
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </div>

        {/* Media Box */}
        <div className="aspect-square bg-slate-800 relative flex flex-col items-center justify-center p-6 text-center overflow-hidden border-y border-slate-800/80">
          {mediaUrl ? (
            <img src={mediaUrl} alt="Post preview" className="w-full h-full object-cover" />
          ) : (
            <div className="bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-900 w-full h-full p-6 flex flex-col items-center justify-center rounded-xl border border-indigo-500/20">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-2">Görsel Konsepti</span>
              <p className="text-xs text-slate-300 italic line-clamp-4">
                "{post.visualIdea || 'AI tarafından önerilen görsel konsept tasarımı...'}"
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-3 py-2 flex items-center justify-between border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <MessageCircle className="w-5 h-5 text-slate-300" />
            <Send className="w-5 h-5 text-slate-300" />
          </div>
          <Bookmark className="w-5 h-5 text-slate-300" />
        </div>

        {/* Caption & Content Live View */}
        <div className="p-3 text-xs space-y-2 leading-relaxed">
          <p className="text-slate-200 whitespace-pre-wrap">
            <span className="font-semibold text-white mr-1.5">{brandName.toLowerCase().replace(/\s+/g, '')}</span>
            {captionText}
          </p>

          <div className="pt-1 flex flex-wrap gap-1 text-indigo-400 font-medium">
            {hashtagsList.map((h, i) => (
              <span key={i} className="hover:underline">{h}</span>
            ))}
          </div>

          {ctaText && (
            <p className="text-amber-300 font-semibold mt-1.5 bg-amber-950/40 p-2 rounded-xl border border-amber-800/40 flex items-center gap-1.5">
              <span>👉</span> {ctaText}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (platform === 'linkedin') {
    return (
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden max-w-md mx-auto font-sans">
        {/* Real-time Indicator Header */}
        <div className="bg-blue-950/80 px-3 py-1.5 border-b border-blue-800/40 flex items-center justify-between text-[11px] text-blue-300 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>Gerçek Zamanlı Önizleme</span>
          </span>
          <div className="flex items-center gap-2">
            {post.tone && (
              <span className="px-2 py-0.5 rounded-full bg-blue-900/80 text-[10px] text-amber-300 font-bold border border-blue-700/60 shadow-sm">
                🎭 {post.tone}
              </span>
            )}
            <span className="text-blue-400 font-bold uppercase">LinkedIn</span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {brandName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-100">{brandName}</h4>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                Düşünce Lideri & Takipçi Topluluğu • 1s • <Globe className="w-3 h-3 text-slate-400" />
              </p>
            </div>
          </div>

          {/* Text */}
          <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed space-y-2">
            <p>{captionText}</p>

            <div className="flex flex-wrap gap-1 text-blue-400 font-medium">
              {hashtagsList.map((h, i) => (
                <span key={i}>{h}</span>
              ))}
            </div>

            {ctaText && (
              <p className="text-indigo-300 font-semibold bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-800/40 flex items-center gap-2">
                <span>📌</span> {ctaText}
              </p>
            )}
          </div>

          {/* Visual Idea & Media Box */}
          <div className="bg-slate-800/80 rounded-xl overflow-hidden border border-slate-700/60 text-xs">
            {mediaUrl ? (
              <div className="aspect-video w-full bg-slate-950 overflow-hidden">
                <img src={mediaUrl} alt="LinkedIn Medya" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="p-3">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Medya & Görsel Konsepti</p>
                <p className="text-slate-300 italic">{post.visualIdea || 'Görsel konsept notu...'}</p>
              </div>
            )}
          </div>

          {/* Engagement Footer */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-around text-xs text-slate-400 font-medium">
            <button className="flex items-center gap-1.5 hover:text-blue-400"><ThumbsUp className="w-4 h-4" /> Beğen</button>
            <button className="flex items-center gap-1.5 hover:text-blue-400"><MessageCircle className="w-4 h-4" /> Yorum Yap</button>
            <button className="flex items-center gap-1.5 hover:text-blue-400"><Repeat className="w-4 h-4" /> Yeniden Paylaş</button>
          </div>
        </div>
      </div>
    );
  }

  if (platform === 'twitter') {
    return (
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden max-w-sm mx-auto font-sans">
        {/* Real-time Indicator Header */}
        <div className="bg-sky-950/80 px-3 py-1.5 border-b border-sky-800/40 flex items-center justify-between text-[11px] text-sky-300 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>Gerçek Zamanlı Önizleme</span>
          </span>
          <div className="flex items-center gap-2">
            {post.tone && (
              <span className="px-2 py-0.5 rounded-full bg-sky-900/80 text-[10px] text-amber-300 font-bold border border-sky-700/60 shadow-sm">
                🎭 {post.tone}
              </span>
            )}
            <span className="text-sky-400 font-bold uppercase">X / Twitter</span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-400 shrink-0">
              {brandName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 overflow-hidden text-xs">
                  <span className="font-bold text-slate-100 truncate">{brandName}</span>
                  <span className="text-slate-400 truncate">@{brandName.toLowerCase().replace(/\s+/g, '')}</span>
                  <span className="text-slate-500">• 2s</span>
                </div>
              </div>

              <p className="text-xs text-slate-200 mt-2 whitespace-pre-wrap leading-relaxed">
                {captionText}
              </p>

              <div className="flex flex-wrap gap-1 text-sky-400 text-xs mt-2 font-medium">
                {hashtagsList.map((h, i) => (
                  <span key={i}>{h}</span>
                ))}
              </div>

              {ctaText && (
                <p className="text-amber-300 text-xs font-semibold mt-2">
                  👉 {ctaText}
                </p>
              )}

              {/* Visual concept banner */}
              <div className="mt-3 bg-slate-800/60 rounded-xl overflow-hidden border border-slate-700/50 text-[11px] text-slate-300">
                {mediaUrl ? (
                  <div className="aspect-video w-full bg-slate-950 overflow-hidden">
                    <img src={mediaUrl} alt="Twitter Görseli" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="p-3">
                    <span className="text-sky-400 font-semibold block mb-0.5">📸 Kart Görseli</span>
                    {post.visualIdea || 'Görsel konsept notu...'}
                  </div>
                )}
              </div>

              {/* Tweet footer */}
              <div className="flex items-center justify-between text-slate-400 text-xs mt-3 pt-2 border-t border-slate-800">
                <MessageCircle className="w-4 h-4 hover:text-sky-400" />
                <Repeat className="w-4 h-4 hover:text-green-400" />
                <Heart className="w-4 h-4 hover:text-pink-500" />
                <Bookmark className="w-4 h-4 hover:text-sky-400" />
                <Share2 className="w-4 h-4 hover:text-sky-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default TikTok / Reel / Facebook generic format
  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden max-w-sm mx-auto font-sans">
      <div className="bg-pink-950/80 px-3 py-1.5 border-b border-pink-800/40 flex items-center justify-between text-[11px] text-pink-300 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span>Gerçek Zamanlı Önizleme</span>
        </span>
        <span className="text-pink-400 font-bold uppercase">{platform}</span>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
            {brandName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="text-xs font-semibold">{brandName}</h4>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">{platform} Formatı</span>
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-xs whitespace-pre-wrap leading-relaxed space-y-2">
          <p>{captionText}</p>

          <div className="flex flex-wrap gap-1 text-pink-400 font-medium">
            {hashtagsList.map((h, i) => (
              <span key={i}>{h}</span>
            ))}
          </div>

          {ctaText && (
            <p className="text-amber-300 font-semibold mt-1">
              👉 {ctaText}
            </p>
          )}
        </div>

        {mediaUrl ? (
          <div className="aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <img src={mediaUrl} alt="Medya Görseli" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="bg-indigo-950/30 rounded-lg p-2.5 border border-indigo-800/30 text-[11px] text-indigo-200">
            <span className="font-semibold block text-indigo-400">🎬 Video & Ses İpucu:</span>
            {post.visualIdea || 'Video kurgu önerisi...'}
          </div>
        )}
      </div>
    </div>
  );
};
