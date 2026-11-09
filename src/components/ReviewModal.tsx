import React, { useState } from 'react';
import { Review } from '../types';
import { Star, X, Check, Award } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'partner' | 'part';
  targetId: string;
  targetName: string;
  onSubmitReview: (review: Review) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetName,
  onSubmitReview
}) => {
  const [rating, setRating] = useState<number>(5);
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [serviceUsed, setServiceUsed] = useState<string>('Sửa chữa bảo dưỡng định kỳ');
  const [hoverRating, setHoverRating] = useState<number>(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      alert('Vui lòng nhập tên và nhận xét đánh giá');
      return;
    }

    const phoneMasked = userPhone.trim().length >= 7 
      ? userPhone.slice(0, 4) + '***' + userPhone.slice(-3)
      : '0988***123';

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      targetType,
      targetId,
      targetName,
      userName: userName.trim(),
      userPhoneMasked: phoneMasked,
      rating,
      comment: comment.trim(),
      serviceOrPart: serviceUsed,
      createdAt: new Date().toLocaleDateString('vi-VN')
    };

    onSubmitReview(newRev);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">
              Đánh Giá Dịch Vụ & Sản Phẩm
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-slate-500">
          Đánh giá cho: <strong className="text-slate-900">{targetName}</strong>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Star rating selector */}
          <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-slate-600 font-medium mb-1.5">
              Chất lượng phục vụ / Linh kiện (1 - 5 Sao)
            </div>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-[11px] font-bold text-amber-700 mt-1">
              {rating === 5 ? 'Tuyệt vời (5/5)' : rating === 4 ? 'Rất tốt (4/5)' : rating === 3 ? 'Bình thường (3/5)' : 'Chưa hài lòng'}
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Họ tên của bạn *</label>
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="VD: Nguyễn Văn Nam"
              className="w-full px-3 py-2 rounded-lg border border-slate-200"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Số điện thoại (được mã hoá bảo mật)</label>
            <input
              type="tel"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              placeholder="VD: 0988 123 456"
              className="w-full px-3 py-2 rounded-lg border border-slate-200"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Dịch vụ đã sử dụng</label>
            <select
              value={serviceUsed}
              onChange={(e) => setServiceUsed(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
            >
              <option value="Cứu hộ khẩn cấp 24/7">Cứu hộ khẩn cấp 24/7</option>
              <option value="Độ & nâng cấp pin Lithium">Độ & nâng cấp pin Lithium</option>
              <option value="Bảo dưỡng định kỳ xe điện">Bảo dưỡng định kỳ xe điện</option>
              <option value="Sửa chữa IC & Động cơ">Sửa chữa IC & Động cơ</option>
              <option value="Mua phụ tùng / sạc thông minh">Mua phụ tùng / sạc thông minh</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Nhận xét chi tiết *</label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm thực tế về tay nghề kỹ thuật, thời gian sửa, giá cả linh kiện..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Gửi đánh giá</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
