import React, { useState, useMemo } from 'react';
import { SparePart, PartCategory } from '../types';
import { 
  Search, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck, 
  Check, 
  Eye, 
  X, 
  SlidersHorizontal,
  PackageCheck,
  ChevronRight,
  Info
} from 'lucide-react';

interface PartsStoreProps {
  parts: SparePart[];
  onAddToCart: (part: SparePart, quantity: number) => void;
  selectedPartnerFilter?: string | null;
  onClearPartnerFilter?: () => void;
  onOpenCart: () => void;
}

const CATEGORY_TABS: { id: PartCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Tất cả linh kiện' },
  { id: 'battery', label: 'Pin Lithium & BMS' },
  { id: 'controller', label: 'Bộ IC Điều Tốc' },
  { id: 'motor', label: 'Động cơ BLDC' },
  { id: 'charger', label: 'Bộ sạc thông minh' },
  { id: 'brake_suspension', label: 'Phanh E-ABS & Phuộc' },
  { id: 'tire_wheel', label: 'Lốp & Vành chuyên dụng' }
];

export const PartsStore: React.FC<PartsStoreProps> = ({
  parts,
  onAddToCart,
  selectedPartnerFilter,
  onClearPartnerFilter,
  onOpenCart
}) => {
  const [activeCategory, setActiveCategory] = useState<PartCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVehicleFilter, setSelectedVehicleFilter] = useState<string>('all');
  const [selectedPartForModal, setSelectedPartForModal] = useState<SparePart | null>(null);
  const [modalQuantity, setModalQuantity] = useState<number>(1);
  const [justAddedPartId, setJustAddedPartId] = useState<string | null>(null);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const filteredParts = useMemo(() => {
    return parts.filter(part => {
      // Category filter
      if (activeCategory !== 'all' && part.category !== activeCategory) {
        return false;
      }
      // Partner filter
      if (selectedPartnerFilter && part.partnerId !== selectedPartnerFilter) {
        return false;
      }
      // Vehicle compatibility filter
      if (selectedVehicleFilter !== 'all') {
        const matchesVehicle = part.compatibleModels.some(m => 
          m.toLowerCase().includes(selectedVehicleFilter.toLowerCase())
        );
        if (!matchesVehicle) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = part.name.toLowerCase().includes(query);
        const matchSku = part.sku.toLowerCase().includes(query);
        const matchPartner = part.partnerName.toLowerCase().includes(query);
        const matchDesc = part.description.toLowerCase().includes(query);
        if (!matchName && !matchSku && !matchPartner && !matchDesc) return false;
      }
      return true;
    });
  }, [parts, activeCategory, selectedPartnerFilter, selectedVehicleFilter, searchQuery]);

  const handleQuickAdd = (part: SparePart, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onAddToCart(part, 1);
    setJustAddedPartId(part.id);
    setTimeout(() => {
      setJustAddedPartId(null);
    }, 1200);
  };

  const handleModalAdd = () => {
    if (selectedPartForModal) {
      onAddToCart(selectedPartForModal, modalQuantity);
      setSelectedPartForModal(null);
      setModalQuantity(1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Showcase Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white p-6 sm:p-10 shadow-lg">
        <div className="absolute inset-0 opacity-25">
          <img 
            src="/src/assets/images/ev_hero_service_hub_1794145376515.jpg" 
            alt="EV Parts & Service Hub" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <PackageCheck className="w-4 h-4" />
            <span>Tổng Kho Linh Kiện & Phụ Tùng Xe Điện Chính Hãng</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Linh Kiện Chuẩn Kỹ Thuật Cho Mọi Dòng Xe Điện Tại Việt Nam
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Phân phối trực tiếp từ các trung tâm phụ tùng hàng đầu: Pin LiFePO4 chống cháy nổ, IC Votol/FarDriver, động cơ QS Motor và sạc thông minh bảo hành lên đến 24 tháng.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% kiểm định an toàn điện</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Giao hoả tốc nội thành 2h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Được tiệm sửa xe tin dùng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Filter Alert if filtered from Map */}
      {selectedPartnerFilter && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 px-4 flex items-center justify-between text-xs sm:text-sm text-emerald-900">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>Đang lọc linh kiện thuộc kho đối tác đã chọn</span>
          </div>
          <button
            onClick={onClearPartnerFilter}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
          >
            Xem toàn bộ linh kiện của mọi kho
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === tab.id
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Compatibility Filter */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên linh kiện, mã SKU, hãng xe tương thích..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 whitespace-nowrap">Tương thích:</span>
            <select
              value={selectedVehicleFilter}
              onChange={(e) => setSelectedVehicleFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">Tất cả dòng xe</option>
              <option value="VinFast">Dòng xe VinFast (Klara, Theon, Feliz, Evo)</option>
              <option value="Dat Bike">Dòng xe Dat Bike (Weaver, Quantum)</option>
              <option value="Yadea">Dòng xe Yadea</option>
              <option value="Pega">Dòng xe Pega</option>
            </select>
          </div>
        </div>

      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParts.map((part) => {
          const isLowStock = part.stock <= part.minStockAlert;
          const isJustAdded = justAddedPartId === part.id;

          return (
            <div
              key={part.id}
              onClick={() => setSelectedPartForModal(part)}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={part.image}
                  alt={part.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Stock Tag */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  {isLowStock ? (
                    <span className="text-[10px] font-semibold bg-amber-500/90 text-white px-2 py-0.5 rounded shadow-xs">
                      Chỉ còn {part.stock} cái
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold bg-emerald-600/90 text-white px-2 py-0.5 rounded shadow-xs">
                      Sẵn hàng ({part.stock})
                    </span>
                  )}
                </div>

                {/* Warranty Badge */}
                <div className="absolute top-2.5 right-2.5 text-[10px] font-medium bg-slate-900/80 text-white px-2 py-0.5 rounded shadow-xs">
                  Bảo hành {part.warrantyMonths} tháng
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-mono">{part.sku}</span>
                    <span>·</span>
                    <span className="truncate">{part.partnerName.split(' ')[0]} {part.partnerName.split(' ')[1]}</span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {part.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {part.description}
                  </p>
                </div>

                {/* Price and Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
                      {formatPrice(part.price)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Đã bán {part.soldCount} chiếc
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleQuickAdd(part, e)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã thêm</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Chọn mua</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredParts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
          <PackageCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy linh kiện phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Vui lòng thử điều chỉnh bộ lọc dòng xe hoặc từ khoá tìm kiếm khác.
          </p>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedPartForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="relative aspect-16/9 bg-slate-100">
              <img
                src={selectedPartForModal.image}
                alt={selectedPartForModal.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedPartForModal(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-mono font-semibold">{selectedPartForModal.sku}</span>
                  <span>·</span>
                  <span>Kho: {selectedPartForModal.partnerName}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedPartForModal.name}
                </h2>
                <div className="text-2xl font-bold text-emerald-700 mt-2 tabular-nums">
                  {formatPrice(selectedPartForModal.price)}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedPartForModal.description}
              </p>

              {/* Technical Specifications */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Thông Số Kỹ Thuật Chi Tiết
                </h4>
                <div className="border border-slate-100 rounded-lg overflow-hidden text-xs">
                  {Object.entries(selectedPartForModal.specs).map(([key, val], idx) => (
                    <div 
                      key={idx}
                      className={`flex py-2 px-3 justify-between ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
                    >
                      <span className="text-slate-500 font-medium">{key}</span>
                      <span className="text-slate-900 font-semibold text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicle Compatibility */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Dòng Xe Tương Thích
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPartForModal.compatibleModels.map((m, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-md">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Quantity & Purchase Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Số lượng:</span>
                  <div className="flex items-center border border-slate-200 rounded-lg">
                    <button
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded-l-lg font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold tabular-nums">
                      {modalQuantity}
                    </span>
                    <button
                      onClick={() => setModalQuantity(Math.min(selectedPartForModal.stock, modalQuantity + 1))}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded-r-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleModalAdd}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Thêm vào giỏ ({formatPrice(selectedPartForModal.price * modalQuantity)})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
