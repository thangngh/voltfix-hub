import React, { useState } from 'react';
import { Review, Partner } from '../types';
import { Star, MessageSquare, Award, ThumbsUp, Filter, Plus } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: Review[];
  partners: Partner[];
  onOpenReviewModal: (targetType: 'partner' | 'part', targetId: string, targetName: string) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  partners,
  onOpenReviewModal
}) => {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [searchTarget, setSearchTarget] = useState<string>('all');

  const filteredReviews = reviews.filter(r => {
    if (filterRating !== 'all' && r.rating !== filterRating) return false;
    if (searchTarget !== 'all' && r.targetId !== searchTarget) return false;
    return true;
  });

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Cộng Đồng Người Đi Xe Điện Việt Nam</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Đánh Giá Dịch Vụ & Chất Lượng Linh Kiện
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Tất cả nhận xét đều được xác thực từ khách hàng thực tế sau khi hoàn thành sửa chữa hoặc nhận phụ tùng tại mạng lưới VoltFix Hub.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 shrink-0">
          <div className="text-center sm:text-left">
            <div className="text-3xl font-bold text-slate-900 tabular-nums flex items-center justify-center sm:justify-start gap-1">
              <span>{averageRating}</span>
              <span className="text-sm text-slate-400 font-normal">/ 5.0</span>
            </div>
            <div className="flex items-center gap-0.5 text-amber-400 my-1 justify-center sm:justify-start">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <div className="text-xs text-slate-500">{reviews.length} đánh giá đã xác minh</div>
          </div>

          <button
            onClick={() => onOpenReviewModal('partner', partners[0]?.id || '', partners[0]?.name || '')}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Viết đánh giá mới</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-500 font-medium">Lọc số sao:</span>
          {['all', 5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(star as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterRating === star
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {star === 'all' ? 'Tất cả sao' : `${star} sao`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Lọc theo cơ sở:</span>
          <select
            value={searchTarget}
            onChange={(e) => setSearchTarget(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
          >
            <option value="all">Tất cả tiệm & kho</option>
            {partners.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((rev) => (
          <div key={rev.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {rev.userName}
                  </h4>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <span>SĐT: {rev.userPhoneMasked}</span>
                    <span>·</span>
                    <span>{rev.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <div className="inline-block bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded font-medium">
                {rev.serviceOrPart} · <strong className="text-slate-900">{rev.targetName}</strong>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                "{rev.comment}"
              </p>
            </div>

            {/* Official Partner Reply if present */}
            {rev.partnerReply && (
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-lg p-3 text-xs space-y-1 mt-3">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Phản hồi chính thức từ tiệm ({rev.partnerReplyDate || '07/11/2026'}):</span>
                </div>
                <p className="text-emerald-800 italic">
                  {rev.partnerReply}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
