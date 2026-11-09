import React from 'react';
import { Zap, ShoppingBag, Bell, Compass, CalendarPlus, Package, Activity, Award, Coins } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  unreadNotifsCount: number;
  onOpenNotifs: () => void;
  currentRole: UserRole;
  onOpenBookingModal: () => void;
  loyaltyPoints?: number;
  onOpenLoyaltyModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  cartCount,
  onOpenCart,
  unreadNotifsCount,
  onOpenNotifs,
  currentRole,
  onOpenBookingModal,
  loyaltyPoints,
  onOpenLoyaltyModal
}) => {
  return (
    <header className="sticky top-8 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand title, one line */}
        <button 
          onClick={() => onTabChange('map')} 
          className="flex items-center gap-2.5 text-left shrink-0 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl tracking-tight text-slate-900 leading-none">
              VoltFix <span className="text-emerald-600">Hub</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-0.5">
              Mạng Lưới Sửa Chữa & Phụ Tùng EV
            </span>
          </div>
        </button>

        {/* Zone 2: 4–5 nav links, single-line labels */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onTabChange('map')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-emerald-600 ${
              currentTab === 'map' ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1 mt-1' : ''
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Bản đồ số EV</span>
          </button>

          <button
            onClick={() => onTabChange('booking')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-emerald-600 ${
              currentTab === 'booking' ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1 mt-1' : ''
            }`}
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Đặt lịch & Cứu hộ</span>
          </button>

          <button
            onClick={() => onTabChange('parts')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-emerald-600 ${
              currentTab === 'parts' ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1 mt-1' : ''
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Kho linh kiện EV</span>
          </button>

          <button
            onClick={() => onTabChange('tracker')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-emerald-600 ${
              currentTab === 'tracker' ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1 mt-1' : ''
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Tiến độ thời gian thực</span>
          </button>

          <button
            onClick={() => onTabChange('reviews')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-emerald-600 ${
              currentTab === 'reviews' ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1 mt-1' : ''
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Đánh giá dịch vụ</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Loyalty Points Button */}
          {typeof loyaltyPoints === 'number' && onOpenLoyaltyModal && (
            <button
              type="button"
              onClick={onOpenLoyaltyModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all shadow-2xs hover:scale-102 cursor-pointer"
              title="Điểm thưởng VoltPoints - Bấm để xem chi tiết và đổi quà"
            >
              <Coins className="w-4 h-4 text-amber-600 fill-amber-500/20" />
              <span className="tabular-nums text-amber-900 font-extrabold">{loyaltyPoints}</span>
              <span className="hidden sm:inline font-semibold text-[11px] text-amber-700">VoltPoints</span>
            </button>
          )}

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifs}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none cursor-pointer"
            title="Thông báo hệ thống"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none cursor-pointer"
            title="Giỏ hàng linh kiện"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Quick Rescue Booking CTA */}
          <button
            onClick={onOpenBookingModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all rounded-lg shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Cứu hộ khẩn cấp</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-slate-100 px-4 py-2 flex items-center justify-around text-xs font-medium text-slate-600 overflow-x-auto gap-2">
        <button
          onClick={() => onTabChange('map')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'map' ? 'bg-emerald-50 text-emerald-700 font-semibold' : ''}`}
        >
          Bản đồ số
        </button>
        <button
          onClick={() => onTabChange('booking')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'booking' ? 'bg-emerald-50 text-emerald-700 font-semibold' : ''}`}
        >
          Đặt lịch
        </button>
        <button
          onClick={() => onTabChange('parts')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'parts' ? 'bg-emerald-50 text-emerald-700 font-semibold' : ''}`}
        >
          Kho linh kiện
        </button>
        <button
          onClick={() => onTabChange('tracker')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'tracker' ? 'bg-emerald-50 text-emerald-700 font-semibold' : ''}`}
        >
          Tiến độ
        </button>
        <button
          onClick={() => onTabChange('reviews')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'reviews' ? 'bg-emerald-50 text-emerald-700 font-semibold' : ''}`}
        >
          Đánh giá
        </button>
      </div>
    </header>
  );
};
