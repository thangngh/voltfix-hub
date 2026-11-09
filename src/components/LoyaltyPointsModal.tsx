import React, { useState } from 'react';
import { LoyaltyTransaction, LoyaltyReward } from '../types';
import { DEFAULT_LOYALTY_REWARDS } from '../data/mockData';
import { 
  X, 
  Coins, 
  Sparkles, 
  Award, 
  Gift, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Zap, 
  ChevronRight, 
  Info,
  ShieldCheck,
  Tag
} from 'lucide-react';

interface LoyaltyPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  history: LoyaltyTransaction[];
  onRedeemReward: (reward: LoyaltyReward) => void;
  onAddTestPoints: (amount: number) => void;
  onNavigateToTab: (tab: string) => void;
}

export const LoyaltyPointsModal: React.FC<LoyaltyPointsModalProps> = ({
  isOpen,
  onClose,
  points,
  history,
  onRedeemReward,
  onAddTestPoints,
  onNavigateToTab
}) => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'history' | 'guide'>('rewards');
  const [selectedRewardCategory, setSelectedRewardCategory] = useState<'all' | 'service' | 'parts'>('all');

  if (!isOpen) return null;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  // Determine membership tier
  const getTierInfo = (pts: number) => {
    if (pts >= 1000) {
      return {
        name: 'Kim Cương (Diamond EV)',
        color: 'from-amber-400 to-amber-600 text-amber-950',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        progress: 100,
        nextTier: 'Cấp tối đa',
        needed: 0
      };
    } else if (pts >= 500) {
      return {
        name: 'Vàng (Gold EV)',
        color: 'from-amber-300 to-yellow-500 text-yellow-950',
        badgeBg: 'bg-yellow-100 text-yellow-900 border-yellow-300',
        progress: Math.min(100, Math.round(((pts - 500) / 500) * 100)),
        nextTier: 'Kim Cương',
        needed: 1000 - pts
      };
    } else if (pts >= 200) {
      return {
        name: 'Bạc (Silver EV)',
        color: 'from-slate-200 to-slate-400 text-slate-900',
        badgeBg: 'bg-slate-200 text-slate-800 border-slate-300',
        progress: Math.min(100, Math.round(((pts - 200) / 300) * 100)),
        nextTier: 'Vàng',
        needed: 500 - pts
      };
    } else {
      return {
        name: 'Đồng (Bronze EV)',
        color: 'from-amber-700/60 to-amber-800/80 text-white',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        progress: Math.min(100, Math.round((pts / 200) * 100)),
        nextTier: 'Bạc',
        needed: 200 - pts
      };
    }
  };

  const tier = getTierInfo(points);

  const filteredRewards = DEFAULT_LOYALTY_REWARDS.filter(r => 
    selectedRewardCategory === 'all' ? true : r.category === selectedRewardCategory || r.category === 'all'
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900">Điểm Thưởng VoltPoints</h3>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${tier.badgeBg}`}>
                  {tier.name}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tích luỹ sau mỗi lần sửa xe hoặc mua linh kiện · Quy đổi giảm giá trực tiếp tại đối tác
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance & Tier Card */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
            <Coins className="w-48 h-48" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Số dư điểm khả dụng
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white tabular-nums">
                    {points}
                  </span>
                  <span className="text-sm font-semibold text-emerald-300">VoltPoints</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Tương đương <span className="font-bold text-amber-300">{formatPrice(points * 1000)}</span> giá trị giảm trừ tại các tiệm đối tác
                </p>
              </div>

              {/* Fast test button */}
              <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onAddTestPoints(100)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg border border-emerald-500/50 shadow-xs transition-colors cursor-pointer"
                  title="Cộng 100 điểm để kiểm tra tính năng"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+100 điểm thử nghiệm</span>
                </button>
                <span className="text-[10px] text-slate-400">1 VoltPoint = 1.000 VNĐ</span>
              </div>
            </div>

            {/* Tier progress bar */}
            <div className="mt-4 pt-4 border-t border-slate-700/60">
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Hạng hiện tại: <strong className="text-white">{tier.name}</strong></span>
                {tier.needed > 0 ? (
                  <span>Cần thêm <strong className="text-emerald-400">{tier.needed} điểm</strong> để lên hạng {tier.nextTier}</span>
                ) : (
                  <span className="text-amber-300 font-semibold">Cấp VIP tối đa</span>
                )}
              </div>
              <div className="w-full bg-slate-700/80 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-amber-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${tier.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mt-5">
          <button
            type="button"
            onClick={() => setActiveTab('rewards')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'rewards'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Đổi Voucher Ưu Đãi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Lịch Sử Điểm ({history.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Cách Tích & Dùng Điểm</span>
          </button>
        </div>

        {/* Tab 1: Rewards Catalog */}
        {activeTab === 'rewards' && (
          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-slate-500">
                Chọn gói giảm giá để đổi hoặc áp dụng trực tiếp khi thanh toán Giỏ hàng / Đặt lịch:
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedRewardCategory('all')}
                  className={`px-2 py-1 rounded font-medium transition-colors ${
                    selectedRewardCategory === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRewardCategory('service')}
                  className={`px-2 py-1 rounded font-medium transition-colors ${
                    selectedRewardCategory === 'service' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sửa chữa & Cứu hộ
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRewardCategory('parts')}
                  className={`px-2 py-1 rounded font-medium transition-colors ${
                    selectedRewardCategory === 'parts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Linh kiện EV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredRewards.map((reward) => {
                const canAfford = points >= reward.pointsRequired;
                return (
                  <div
                    key={reward.id}
                    className={`p-4 rounded-xl border transition-all ${
                      canAfford 
                        ? 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xs' 
                        : 'border-slate-200 bg-slate-50/70 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                          <Tag className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{reward.title}</div>
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                            {reward.badge}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-amber-600 tabular-nums">
                          {reward.pointsRequired}
                        </span>
                        <span className="text-[10px] text-slate-400 block">điểm</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                      {reward.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-800">
                        {formatPrice(reward.discountValue)}
                      </span>
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => onRedeemReward(reward)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          canAfford
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Đổi voucher này' : `Thiếu ${reward.pointsRequired - points}đ`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick action banner */}
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-950">Đổi điểm trực tiếp khi mua sắm</span>
                  <p className="text-[11px] text-emerald-800">
                    Bạn có thể gạt chọn đổi VoltPoints trực tiếp ngay trong Giỏ hàng hoặc trang Đặt lịch sửa chữa!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToTab('parts');
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shrink-0 transition-colors cursor-pointer"
              >
                Đến kho phụ tùng
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Transaction History */}
        {activeTab === 'history' && (
          <div className="mt-4 space-y-3">
            {history.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Chưa có giao dịch tích điểm nào. Hãy đặt lịch sửa xe hoặc mua linh kiện để nhận điểm đầu tiên!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {history.map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        tx.type === 'earned' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}>
                        {tx.type === 'earned' ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 text-xs">{tx.description}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{tx.timestamp}</span>
                          {tx.referenceCode && (
                            <>
                              <span>·</span>
                              <span className="font-mono text-slate-500 font-semibold">{tx.referenceCode}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`font-bold text-xs tabular-nums ${
                        tx.type === 'earned' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {tx.type === 'earned' ? `+${tx.amount}` : `-${tx.amount}`} điểm
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Số dư: {tx.balanceAfter}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Guide */}
        {activeTab === 'guide' && (
          <div className="mt-4 space-y-3 text-xs text-slate-600">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                1. Cách thức tích lũy điểm VoltPoints
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                <li>
                  <strong>Hoàn tất sửa chữa & cứu hộ:</strong> Tự động tích lũy từ <strong>100 đến 350 điểm</strong> ngay khi trạm sửa xe nghiệm thu và hoàn trả xe cho bạn.
                </li>
                <li>
                  <strong>Mua sắm linh kiện xe điện:</strong> Cứ mỗi <strong>20.000 VNĐ</strong> giá trị đơn hàng phụ tùng sẽ tích lũy được <strong>1 VoltPoint</strong> (hoàn tiền ~5% giá trị).
                </li>
                <li>
                  <strong>Đánh giá dịch vụ:</strong> Nhận thêm <strong>+20 điểm</strong> sau mỗi đánh giá 5 sao cho tiệm sửa xe hoặc sản phẩm linh kiện.
                </li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-600" />
                2. Cách thức đổi điểm lấy giảm giá
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                <li>
                  <strong>Quy đổi trực tiếp:</strong> <code>1 VoltPoint = 1.000 VNĐ</code> tiền mặt giảm trực tiếp vào hoá đơn.
                </li>
                <li>
                  <strong>Áp dụng khi thanh toán Giỏ hàng:</strong> Trong drawer giỏ hàng, gạt công tắc đổi điểm để trừ ngay từ 50.000đ đến 200.000đ vào tổng tiền.
                </li>
                <li>
                  <strong>Áp dụng khi Đặt lịch dịch vụ:</strong> Chọn mức điểm giảm giá ngay khi tạo lịch hẹn để tiệm khấu trừ trên báo giá chính thức.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Điểm thưởng áp dụng tại tất cả cơ sở đối tác trong hệ sinh thái VoltFix Hub.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
