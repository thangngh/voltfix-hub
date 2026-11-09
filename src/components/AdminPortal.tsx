import React, { useState } from 'react';
import { Partner, SparePart, Booking, Order, Review } from '../types';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  TrendingUp, 
  AlertCircle, 
  Check, 
  X, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  Search,
  Filter,
  Activity,
  Award
} from 'lucide-react';

interface AdminPortalProps {
  partners: Partner[];
  parts: SparePart[];
  bookings: Booking[];
  orders: Order[];
  reviews: Review[];
  onApprovePartner: (partnerId: string) => void;
  onToggleVerifyPartner: (partnerId: string) => void;
  onTogglePartnerStatus: (partnerId: string) => void;
  onDeleteReview?: (reviewId: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  partners,
  parts,
  bookings,
  orders,
  reviews,
  onApprovePartner,
  onToggleVerifyPartner,
  onTogglePartnerStatus
}) => {
  const [activeTab, setActiveTab] = useState<'partners' | 'analytics' | 'parts_audit' | 'moderation'>('partners');
  const [partnerSearch, setPartnerSearch] = useState<string>('');
  const [partnerStatusFilter, setPartnerStatusFilter] = useState<'all' | 'active' | 'pending_approval'>('all');

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const totalGMV = 
    bookings.reduce((acc, b) => acc + (b.quoteAmount || 0), 0) +
    orders.reduce((acc, o) => acc + o.total, 0);

  const pendingPartners = partners.filter(p => p.status === 'pending_approval');
  const activePartners = partners.filter(p => p.status === 'active');

  const filteredPartners = partners.filter(p => {
    if (partnerStatusFilter !== 'all' && p.status !== partnerStatusFilter) return false;
    if (partnerSearch.trim()) {
      const q = partnerSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.ownerName.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Hệ Thống Quản Trị Trung Tâm (System Administrator)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Bảng Điều Khiển Mạng Lưới VoltFix Hub Toàn Quốc
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Giám sát chất lượng dịch vụ, duyệt hồ sơ tiệm sửa xe & nhà phân phối linh kiện mới, quản lý biểu phí và bảo vệ quyền lợi người tiêu dùng.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Root Admin Quyền Cao Nhất</span>
            </span>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Tổng cơ sở đối tác</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white tabular-nums">{partners.length}</div>
            <div className="text-[11px] text-amber-400 mt-1">
              {pendingPartners.length > 0 ? `⚠️ ${pendingPartners.length} tiệm chờ duyệt` : 'Tất cả đã xác minh'}
            </div>
          </div>

          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Tổng linh kiện toàn sàn</span>
              <Package className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white tabular-nums">{parts.length} SKU</div>
            <div className="text-[11px] text-slate-400 mt-1">Phân bố trên 4 trung tâm</div>
          </div>

          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Tổng giá trị giao dịch (GMV)</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums">
              {formatPrice(totalGMV)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{bookings.length} lịch sửa + {orders.length} đơn hàng</div>
          </div>

          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Tỷ lệ đáp ứng cứu hộ</span>
              <Activity className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-white tabular-nums">98.6%</div>
            <div className="text-[11px] text-emerald-400 mt-1">Có mặt trung bình 18 phút</div>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('partners')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'partners'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kiểm Duyệt Đối Tác ({partners.length})</span>
          {pendingPartners.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('parts_audit')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'parts_audit'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Kiểm Tra Linh Kiện Toàn Sàn ({parts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'moderation'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Kiểm Duyệt Đánh Giá ({reviews.length})</span>
        </button>
      </div>

      {/* TAB 1: PARTNERS MANAGEMENT & APPROVAL */}
      {activeTab === 'partners' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={partnerSearch}
                onChange={(e) => setPartnerSearch(e.target.value)}
                placeholder="Tìm theo tên tiệm, chủ sở hữu, thành phố..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 whitespace-nowrap">Trạng thái:</span>
              <select
                value={partnerStatusFilter}
                onChange={(e) => setPartnerStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
              >
                <option value="all">Tất cả ({partners.length})</option>
                <option value="active">Đang hoạt động ({activePartners.length})</option>
                <option value="pending_approval">Chờ duyệt ({pendingPartners.length})</option>
              </select>
            </div>
          </div>

          {/* Pending approval spotlight if any */}
          {pendingPartners.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Yêu Cầu Gia Nhập Mạng Lưới Đang Chờ Admin Xét Duyệt:</span>
              </div>
              <div className="space-y-2">
                {pendingPartners.map(p => (
                  <div key={p.id} className="bg-white rounded-lg p-3 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900">{p.name}</h4>
                      <p className="text-slate-500">
                        Chủ cơ sở: {p.ownerName} · SĐT: {p.phone} · Địa chỉ: {p.address}, {p.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onApprovePartner(p.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Phê duyệt ngay</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Partners Directory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPartners.map(partner => (
              <div key={partner.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-slate-700">
                        {partner.type === 'both' ? 'Sửa Xe & Phụ Tùng' : partner.type === 'repair_shop' ? 'Tiệm Sửa Xe' : 'Kho Linh Kiện'}
                      </span>
                      <span>·</span>
                      <span>{partner.city}</span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                      <span>{partner.name}</span>
                      {partner.verified && (
                        <span title="Đã xác thực chính hãng">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Chủ cơ sở: <span className="font-medium">{partner.ownerName}</span> · {partner.phone}
                    </p>
                  </div>

                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    partner.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {partner.status === 'active' ? 'Hoạt động' : 'Chờ duyệt'}
                  </span>
                </div>

                <div className="text-xs text-slate-500 space-y-1 pt-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{partner.address}, {partner.district}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Đánh giá: {partner.rating} ⭐ ({partner.reviewsCount} lượt)</span>
                    <span className="text-slate-400">Tham gia: {partner.joinedDate}</span>
                  </div>
                </div>

                {/* Admin Quick Toggles */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => onToggleVerifyPartner(partner.id)}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      partner.verified
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {partner.verified ? '✓ Đã cấp tích xanh' : '+ Cấp tích xanh xác thực'}
                  </button>

                  <button
                    onClick={() => onTogglePartnerStatus(partner.id)}
                    className="text-xs text-slate-500 hover:text-rose-600 underline"
                  >
                    {partner.status === 'active' ? 'Tạm dừng hoạt động' : 'Kích hoạt lại'}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: GLOBAL PARTS AUDIT */}
      {activeTab === 'parts_audit' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Kiểm Soát Danh Mục Phụ Tùng Toàn Hệ Sinh Thái
              </h3>
              <p className="text-xs text-slate-500">
                Toàn bộ các mặt hàng pin, IC, động cơ đang được lưu thông trên nền tảng VoltFix Hub.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-mono">Tổng cộng: {parts.length} sản phẩm</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Tên linh kiện</th>
                  <th className="py-2.5 px-3">Kho phân phối</th>
                  <th className="py-2.5 px-3">Danh mục</th>
                  <th className="py-2.5 px-3 text-right">Giá niêm yết</th>
                  <th className="py-2.5 px-3 text-center">Tồn kho</th>
                  <th className="py-2.5 px-3 text-center">Bảo hành</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.sku}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{p.partnerName}</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">{p.category}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatPrice(p.price)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold tabular-nums">
                      {p.stock}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-500">
                      {p.warrantyMonths} tháng
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MODERATION & REVIEWS */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Kiểm Soát Đánh Giá & Phản Hồi Của Người Dùng
          </h3>
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-start justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{r.userName}</span>
                    <span>·</span>
                    <span className="text-slate-500">Đối tượng: <strong className="text-slate-800">{r.targetName}</strong></span>
                    <span>·</span>
                    <span className="text-slate-400">{r.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 my-1">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                    <span className="text-slate-600 font-medium ml-1">({r.serviceOrPart})</span>
                  </div>
                  <p className="text-slate-700 italic">"{r.comment}"</p>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold shrink-0">
                  Hợp lệ
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
