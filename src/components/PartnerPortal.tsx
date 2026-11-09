import React, { useState, useMemo } from 'react';
import { Partner, PartnerType, SparePart, Booking, Order, Review, BookingStatus, PartCategory } from '../types';
import { 
  Wrench, 
  Package, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  Send, 
  ArrowRight, 
  Star, 
  MessageSquare, 
  Truck, 
  SlidersHorizontal,
  RefreshCw,
  DollarSign,
  BarChart3,
  Calendar,
  ArrowUpRight,
  PieChart as PieIcon,
  Layers,
  Edit3,
  Store,
  MapPin,
  Phone,
  Mail,
  X,
  Building2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface PartnerPortalProps {
  partners: Partner[];
  activePartner: Partner;
  onSelectPartner: (partner: Partner) => void;
  parts: SparePart[];
  bookings: Booking[];
  orders: Order[];
  reviews: Review[];
  onUpdateBookingStatus: (bookingId: string, nextStatus: BookingStatus, note?: string) => void;
  onSendBookingQuote: (bookingId: string, quoteAmount: number, quoteParts: { name: string; quantity: number; price: number }[]) => void;
  onUpdatePartStock: (partId: string, newStock: number) => void;
  onAddNewPart: (part: SparePart) => void;
  onUpdateOrderStatus: (orderId: string, nextStatus: Order['status'], description?: string) => void;
  onReplyReview: (reviewId: string, replyText: string) => void;
  onUpdatePartnerInfo?: (updatedPartner: Partner) => void;
}

export const PartnerPortal: React.FC<PartnerPortalProps> = ({
  partners,
  activePartner,
  onSelectPartner,
  parts,
  bookings,
  orders,
  reviews,
  onUpdateBookingStatus,
  onSendBookingQuote,
  onUpdatePartStock,
  onAddNewPart,
  onUpdateOrderStatus,
  onReplyReview,
  onUpdatePartnerInfo
}) => {
  const [activeTab, setActiveTab] = useState<'revenue' | 'bookings' | 'inventory' | 'orders' | 'reviews'>('revenue');
  const [revenueTimeframe, setRevenueTimeframe] = useState<'week' | 'month'>('week');
  const [chartStyle, setChartStyle] = useState<'area' | 'bar'>('area');
  const [showAddPartModal, setShowAddPartModal] = useState<boolean>(false);
  const [quoteBookingId, setQuoteBookingId] = useState<string | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<number>(1500000);
  const [quoteItemName, setQuoteItemName] = useState<string>('Khối cell pin thay thế & Cầu chì an toàn');
  const [quoteItemPrice, setQuoteItemPrice] = useState<number>(1500000);
  const [reviewReplyInputs, setReviewReplyInputs] = useState<Record<string, string>>({});

  // Store profile edit states
  const [showEditStoreModal, setShowEditStoreModal] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editType, setEditType] = useState<PartnerType>('repair_shop');
  const [editOwnerName, setEditOwnerName] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editAddress, setEditAddress] = useState<string>('');
  const [editDistrict, setEditDistrict] = useState<string>('');
  const [editCity, setEditCity] = useState<string>('');
  const [editOpenHours, setEditOpenHours] = useState<string>('');
  const [editServices, setEditServices] = useState<string>('');
  const [editCompatibleBrands, setEditCompatibleBrands] = useState<string>('');
  const [editIs24_7Rescue, setEditIs24_7Rescue] = useState<boolean>(false);
  const [editFastBatterySwap, setEditFastBatterySwap] = useState<boolean>(false);

  // Form states for adding new part to inventory
  const [newPartName, setNewPartName] = useState<string>('');
  const [newPartSku, setNewPartSku] = useState<string>('');
  const [newPartCategory, setNewPartCategory] = useState<PartCategory>('battery');
  const [newPartPrice, setNewPartPrice] = useState<number>(2000000);
  const [newPartCost, setNewPartCost] = useState<number>(1400000);
  const [newPartStock, setNewPartStock] = useState<number>(10);
  const [newPartMinStock, setNewPartMinStock] = useState<number>(3);
  const [newPartWarranty, setNewPartWarranty] = useState<number>(12);
  const [newPartDesc, setNewPartDesc] = useState<string>('');
  const [newPartVehicles, setNewPartVehicles] = useState<string>('VinFast Klara, Theon, Feliz, Dat Bike');

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  // Filter items specifically for the active partner
  const partnerBookings = bookings.filter(b => b.partnerId === activePartner.id);
  const partnerParts = parts.filter(p => p.partnerId === activePartner.id);
  const partnerOrders = orders.filter(o => o.items.some(i => i.partnerId === activePartner.id));
  const partnerReviews = reviews.filter(r => r.targetId === activePartner.id);

  const lowStockParts = partnerParts.filter(p => p.stock <= p.minStockAlert);
  const activeRepairCount = partnerBookings.filter(b => b.status === 'repairing' || b.status === 'diagnosing').length;

  interface RevenueDataPoint {
    label: string;
    repairRevenue: number;
    partsRevenue: number;
    totalRevenue: number;
    estimatedProfit: number;
    orderCount: number;
  }

  // Dynamic weekly revenue trend (7 days: Thứ 2 -> Chủ Nhật)
  const isPartsHub = activePartner.type === 'parts_hub';
  const isRepairShop = activePartner.type === 'repair_shop';

  const weeklyRevenueData: RevenueDataPoint[] = useMemo(() => {
    const baseMultiplier = isPartsHub ? 1.8 : isRepairShop ? 1.1 : 1.5;
    return [
      {
        label: 'T2 (03/11)',
        repairRevenue: Math.round(isPartsHub ? 1200000 : 4200000 * baseMultiplier),
        partsRevenue: Math.round(isRepairShop ? 2100000 : 8500000 * baseMultiplier),
        orderCount: 8,
      },
      {
        label: 'T3 (04/11)',
        repairRevenue: Math.round(isPartsHub ? 1800000 : 5400000 * baseMultiplier),
        partsRevenue: Math.round(isRepairShop ? 2800000 : 12400000 * baseMultiplier),
        orderCount: 11,
      },
      {
        label: 'T4 (05/11)',
        repairRevenue: Math.round(isPartsHub ? 950000 : 4800000 * baseMultiplier),
        partsRevenue: Math.round(isRepairShop ? 1900000 : 9800000 * baseMultiplier),
        orderCount: 9,
      },
      {
        label: 'T5 (06/11)',
        repairRevenue: Math.round(isPartsHub ? 2200000 : 6100000 * baseMultiplier),
        partsRevenue: Math.round(isRepairShop ? 3400000 : 14200000 * baseMultiplier),
        orderCount: 14,
      },
      {
        label: 'T6 (07/11)',
        repairRevenue: Math.round(isPartsHub ? 2500000 : 7800000 * baseMultiplier),
        partsRevenue: Math.round(isRepairShop ? 4200000 : 16500000 * baseMultiplier),
        orderCount: 17,
      },
      {
        label: 'T7 (08/11)',
        repairRevenue: Math.round(isPartsHub ? 3100000 : 9400000 * baseMultiplier),
        partsRevenue: Math.round(isRepairShop ? 5600000 : 21000000 * baseMultiplier),
        orderCount: 22,
      },
      {
        label: 'CN (09/11)',
        repairRevenue: Math.round(isPartsHub ? 2800000 : 8900000 * baseMultiplier),
        partsRevenue: Math.round(isRepairShop ? 4800000 : 18200000 * baseMultiplier),
        orderCount: 19,
      },
    ].map(item => ({
      ...item,
      totalRevenue: item.repairRevenue + item.partsRevenue,
      estimatedProfit: Math.round((item.repairRevenue * 0.7) + (item.partsRevenue * 0.25))
    }));
  }, [activePartner.type, isPartsHub, isRepairShop]);

  // Dynamic monthly revenue trend (6 months)
  const monthlyRevenueData: RevenueDataPoint[] = useMemo(() => {
    const baseMultiplier = isPartsHub ? 1.6 : isRepairShop ? 1.2 : 1.4;
    return [
      {
        label: 'Tháng 6',
        repairRevenue: Math.round(isPartsHub ? 28000000 : 85000000 * baseMultiplier),
        partsRevenue: Math.round(isRepairShop ? 45000000 : 185000000 * baseMultiplier),
        orderCount: 142,
      },
      {
        label: 'Tháng 7',
        repairRevenue: Math.round(isPartsHub ? 32000000 : 96000000 * baseMultiplier),
        partsRevenue: Math.round(isRepairShop ? 52000000 : 210000000 * baseMultiplier),
        orderCount: 165,
      },
      {
        label: 'Tháng 8',
        repairRevenue: Math.round(isPartsHub ? 36000000 : 112000000 * baseMultiplier),
        partsRevenue: Math.round(isRepairShop ? 61000000 : 245000000 * baseMultiplier),
        orderCount: 190,
      },
      {
        label: 'Tháng 9',
        repairRevenue: Math.round(isPartsHub ? 41000000 : 128000000 * baseMultiplier),
        partsRevenue: Math.round(isRepairShop ? 69000000 : 282000000 * baseMultiplier),
        orderCount: 215,
      },
      {
        label: 'Tháng 10',
        repairRevenue: Math.round(isPartsHub ? 47000000 : 145000000 * baseMultiplier),
        partsRevenue: Math.round(isRepairShop ? 78000000 : 320000000 * baseMultiplier),
        orderCount: 248,
      },
      {
        label: 'Tháng 11 (Hiện tại)',
        repairRevenue: Math.round(isPartsHub ? 52000000 : 162000000 * baseMultiplier),
        partsRevenue: Math.round(isRepairShop ? 86000000 : 365000000 * baseMultiplier),
        orderCount: 275,
      },
    ].map(item => ({
      ...item,
      totalRevenue: item.repairRevenue + item.partsRevenue,
      estimatedProfit: Math.round((item.repairRevenue * 0.72) + (item.partsRevenue * 0.28))
    }));
  }, [activePartner.type, isPartsHub, isRepairShop]);

  const currentChartData: RevenueDataPoint[] = revenueTimeframe === 'week' ? weeklyRevenueData : monthlyRevenueData;

  const categoryDistributionData = useMemo(() => {
    return [
      { name: 'Pin Lithium & Smart BMS', value: 38, color: '#10b981' },
      { name: 'IC Điều Tốc & Động Cơ BLDC', value: 26, color: '#06b6d4' },
      { name: 'Cứu Hộ Khẩn Cấp 24/7', value: 16, color: '#f43f5e' },
      { name: 'Phanh E-ABS & Lốp Xe Điện', value: 12, color: '#8b5cf6' },
      { name: 'Bảo Dưỡng & Sạc Nhanh', value: 8, color: '#f59e0b' }
    ];
  }, []);

  const currentSummary = useMemo(() => {
    const totalRev = currentChartData.reduce((acc, d) => acc + d.totalRevenue, 0);
    const repairRev = currentChartData.reduce((acc, d) => acc + d.repairRevenue, 0);
    const partsRev = currentChartData.reduce((acc, d) => acc + d.partsRevenue, 0);
    const totalProfit = currentChartData.reduce((acc, d) => acc + d.estimatedProfit, 0);
    const totalOrders = currentChartData.reduce((acc, d) => acc + d.orderCount, 0);
    const growth = revenueTimeframe === 'week' ? '+21.4%' : '+18.8%';
    return { totalRev, repairRev, partsRev, totalProfit, totalOrders, growth };
  }, [revenueTimeframe, currentChartData]);

  // Custom Chart Tooltip
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1.5 min-w-[210px]">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex justify-between">
            <span>{label}</span>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                <span>{entry.name}:</span>
              </span>
              <span className="font-mono font-bold text-white tabular-nums">
                {formatPrice(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleCreateNewPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName.trim()) return;

    const newPart: SparePart = {
      id: `part-${Date.now()}`,
      name: newPartName.trim(),
      sku: newPartSku.trim() || `EV-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newPartCategory,
      price: newPartPrice,
      costPrice: newPartCost,
      stock: newPartStock,
      minStockAlert: newPartMinStock,
      partnerId: activePartner.id,
      partnerName: activePartner.name,
      compatibleModels: newPartVehicles.split(',').map(s => s.trim()),
      specs: {
        'Bảo hành': `${newPartWarranty} tháng`,
        'Xuất xứ': 'Chính hãng',
        'Tình trạng': 'Mới 100%'
      },
      image: newPartCategory === 'battery' 
        ? '/src/assets/images/ev_battery_parts_1794145376845.jpg'
        : newPartCategory === 'charger'
        ? '/src/assets/images/ev_smart_charger_1794145377977.jpg'
        : '/src/assets/images/ev_motor_controller_1794145377334.jpg',
      rating: 5.0,
      reviewsCount: 1,
      soldCount: 0,
      warrantyMonths: newPartWarranty,
      description: newPartDesc.trim() || 'Linh kiện chính hãng được kiểm định tiêu chuẩn an toàn cho xe điện.',
      inStock: newPartStock > 0
    };

    onAddNewPart(newPart);
    setShowAddPartModal(false);
    // Reset
    setNewPartName('');
    setNewPartSku('');
    setNewPartDesc('');
  };

  const handleSendQuoteSubmit = (bookingId: string) => {
    onSendBookingQuote(bookingId, quoteAmount, [
      { name: quoteItemName, quantity: 1, price: quoteItemPrice }
    ]);
    setQuoteBookingId(null);
  };

  const handleSendReply = (reviewId: string) => {
    const text = reviewReplyInputs[reviewId];
    if (text && text.trim()) {
      onReplyReview(reviewId, text.trim());
      setReviewReplyInputs(prev => ({ ...prev, [reviewId]: '' }));
    }
  };

  const handleOpenEditStoreModal = () => {
    setEditName(activePartner.name);
    setEditType(activePartner.type);
    setEditOwnerName(activePartner.ownerName);
    setEditPhone(activePartner.phone);
    setEditEmail(activePartner.email);
    setEditAddress(activePartner.address);
    setEditDistrict(activePartner.district);
    setEditCity(activePartner.city);
    setEditOpenHours(activePartner.openHours);
    setEditServices(activePartner.servicesOffered.join(', '));
    setEditCompatibleBrands(activePartner.compatibleBrands.join(', '));
    setEditIs24_7Rescue(activePartner.is24_7Rescue);
    setEditFastBatterySwap(activePartner.fastBatterySwap);
    setShowEditStoreModal(true);
  };

  const handleSaveStoreInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editAddress.trim() || !editPhone.trim()) return;

    const parsedServices = editServices
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const parsedBrands = editCompatibleBrands
      .split(',')
      .map(b => b.trim())
      .filter(Boolean);

    const updated: Partner = {
      ...activePartner,
      name: editName.trim(),
      type: editType,
      ownerName: editOwnerName.trim() || activePartner.ownerName,
      phone: editPhone.trim(),
      email: editEmail.trim() || activePartner.email,
      address: editAddress.trim(),
      district: editDistrict.trim() || activePartner.district,
      city: editCity.trim() || activePartner.city,
      openHours: editOpenHours.trim() || activePartner.openHours,
      servicesOffered: parsedServices.length > 0 ? parsedServices : activePartner.servicesOffered,
      compatibleBrands: parsedBrands.length > 0 ? parsedBrands : activePartner.compatibleBrands,
      is24_7Rescue: editIs24_7Rescue,
      fastBatterySwap: editFastBatterySwap
    };

    onUpdatePartnerInfo?.(updated);
    setShowEditStoreModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Partner Store Switcher & Header */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              <Wrench className="w-4 h-4" />
              <span>Cổng Quản Trị Đối Tác (Partner Portal)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{activePartner.name}</span>
              <span className="text-xs bg-cyan-900/60 text-cyan-200 border border-cyan-700/50 px-2 py-0.5 rounded font-normal">
                {activePartner.type === 'both' ? 'Sửa Chữa & Phụ Tùng' : activePartner.type === 'repair_shop' ? 'Tiệm Sửa Xe Điện' : 'Kho Linh Kiện'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Chủ sở hữu: <span className="font-semibold text-white">{activePartner.ownerName}</span> · Hotline: {activePartner.phone} · Địa chỉ: {activePartner.address}, {activePartner.city}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" /> {activePartner.openHours}
              </span>
              {activePartner.is24_7Rescue && (
                <span className="text-[11px] bg-red-950/80 text-red-300 px-2.5 py-0.5 rounded border border-red-800/60 font-medium">
                  🚨 Cứu hộ 24/7
                </span>
              )}
              {activePartner.fastBatterySwap && (
                <span className="text-[11px] bg-emerald-950/80 text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-800/60 font-medium">
                  ⚡ Đổi pin nhanh
                </span>
              )}
              <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded border border-slate-700">
                Hãng hỗ trợ: {activePartner.compatibleBrands.slice(0, 3).join(', ')}{activePartner.compatibleBrands.length > 3 ? '...' : ''}
              </span>
            </div>
          </div>

          {/* Quick Actions & Store Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenEditStoreModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl border border-emerald-500 shadow-xs transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa thông tin tiệm</span>
            </button>

            <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 font-medium pl-1">Chuyển cơ sở:</span>
              <select
                value={activePartner.id}
                onChange={(e) => {
                  const found = partners.find(p => p.id === e.target.value);
                  if (found) onSelectPartner(found);
                }}
                className="bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
              >
                {partners.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.city})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-slate-200">
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Xe đang sửa tại trạm</span>
              <Wrench className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white tabular-nums">{activeRepairCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Tổng {partnerBookings.length} lịch hẹn tiếp nhận</div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Tổng SKU trong kho</span>
              <Package className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white tabular-nums">{partnerParts.length}</div>
            <div className="text-[11px] text-amber-400 mt-0.5">
              {lowStockParts.length > 0 ? `⚠️ ${lowStockParts.length} mặt hàng sắp hết` : 'Tồn kho dồi dào'}
            </div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Đơn hàng linh kiện</span>
              <Truck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white tabular-nums">{partnerOrders.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Cung cấp sỉ & lẻ</div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Đánh giá từ khách</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white tabular-nums">{activePartner.rating} / 5.0</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{partnerReviews.length} lượt nhận xét</div>
          </div>
        </div>
      </div>

      {/* Main Tab Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('revenue')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'revenue'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Biểu Đồ Doanh Thu (Tuần & Tháng)</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'bookings'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Lịch Sửa Xe & Cứu Hộ ({partnerBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Quản Lý Kho Linh Kiện ({partnerParts.length})</span>
          {lowStockParts.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Đơn Hàng Phụ Tùng ({partnerOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Phản Hồi Đánh Giá ({partnerReviews.length})</span>
        </button>
      </div>

      {/* TAB 0: REVENUE CHARTS (RECHARTS INTEGRATION) */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          
          {/* Header Controls */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                <BarChart3 className="w-4 h-4" />
                <span>Báo Cáo Tài Chính & Phân Tích Doanh Thu</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Hiệu Suất Kinh Doanh: {activePartner.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Biểu đồ trực quan doanh thu dịch vụ sửa chữa và bán linh kiện xe điện theo thời gian thực.
              </p>
            </div>

            {/* Timeframe & Chart Style Toggles */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Timeframe Toggle: Tuần vs Tháng */}
              <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  onClick={() => setRevenueTimeframe('week')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    revenueTimeframe === 'week'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Tuần này (7 ngày)</span>
                </button>
                <button
                  onClick={() => setRevenueTimeframe('month')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    revenueTimeframe === 'month'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>6 tháng qua</span>
                </button>
              </div>

              {/* Chart Style Toggle: Area vs Bar */}
              <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  onClick={() => setChartStyle('area')}
                  className={`p-1.5 rounded-md transition-all text-xs font-semibold flex items-center gap-1 ${
                    chartStyle === 'area'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Biểu đồ diện tích (Area)"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Miền</span>
                </button>
                <button
                  onClick={() => setChartStyle('bar')}
                  className={`p-1.5 rounded-md transition-all text-xs font-semibold flex items-center gap-1 ${
                    chartStyle === 'bar'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Biểu đồ cột (Bar)"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cột</span>
                </button>
              </div>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Tổng doanh thu ({revenueTimeframe === 'week' ? 'Tuần' : 'Tháng'})</span>
                <span className="text-emerald-700 font-semibold flex items-center text-[11px]">
                  <ArrowUpRight className="w-3 h-3" />
                  {currentSummary.growth}
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                {formatPrice(currentSummary.totalRev)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {currentSummary.totalOrders} lượt giao dịch & sửa chữa
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Dịch vụ & Cứu hộ 24/7</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-700 tabular-nums">
                {formatPrice(currentSummary.repairRev)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Chiếm {Math.round((currentSummary.repairRev / currentSummary.totalRev) * 100)}% tổng doanh thu
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Bán linh kiện & Pin EV</span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-cyan-700 tabular-nums">
                {formatPrice(currentSummary.partsRev)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Chiếm {Math.round((currentSummary.partsRev / currentSummary.totalRev) * 100)}% tổng doanh thu
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Lợi nhuận gộp ước tính</span>
                <span className="text-xs text-slate-400 font-mono">Biên ~32%</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                {formatPrice(currentSummary.totalProfit)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Sau khi trừ giá vốn linh kiện
              </div>
            </div>
          </div>

          {/* Primary Trend Chart (Recharts) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {revenueTimeframe === 'week' 
                    ? 'Xu Hướng Doanh Thu 7 Ngày Trong Tuần (VNĐ)' 
                    : 'Xu Hướng Doanh Thu 6 Tháng Gần Nhất (VNĐ)'}
                </h4>
                <p className="text-xs text-slate-500">
                  Phân tách rõ nguồn thu từ tiền công dịch vụ kỹ thuật và tiền bán linh kiện phụ tùng.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
                  <span>Sửa chữa & Cứu hộ</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span className="w-3 h-3 rounded-sm bg-cyan-500"></span>
                  <span>Linh kiện & Pin</span>
                </span>
              </div>
            </div>

            {/* Recharts Container */}
            <div className="h-[340px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {chartStyle === 'area' ? (
                  <AreaChart
                    data={currentChartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRepair" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorParts" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(val) => `${(val / 1000000).toFixed(0)}Tr`}
                      width={50}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="partsRevenue"
                      name="Linh kiện & Pin"
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorParts)"
                    />
                    <Area
                      type="monotone"
                      dataKey="repairRevenue"
                      name="Sửa chữa & Cứu hộ"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorRepair)"
                    />
                  </AreaChart>
                ) : (
                  <BarChart
                    data={currentChartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    barGap={6}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(val) => `${(val / 1000000).toFixed(0)}Tr`}
                      width={50}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Bar
                      dataKey="repairRevenue"
                      name="Sửa chữa & Cứu hộ"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="partsRevenue"
                      name="Linh kiện & Pin"
                      fill="#06b6d4"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Grid: Detailed Records Table + Service Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Detailed Breakdown Table (7 cols on lg) */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Bảng Chi Tiết Số Liệu {revenueTimeframe === 'week' ? 'Từng Ngày' : 'Từng Tháng'}
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">Đơn vị: VNĐ</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Thời gian</th>
                      <th className="py-2.5 px-2 text-right">Dịch vụ sửa</th>
                      <th className="py-2.5 px-2 text-right">Linh kiện</th>
                      <th className="py-2.5 px-3 text-right">Tổng thu</th>
                      <th className="py-2.5 px-3 text-right">Lợi nhuận</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentChartData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2 px-3 font-semibold text-slate-900 whitespace-nowrap">
                          {row.label}
                        </td>
                        <td className="py-2 px-2 text-right text-emerald-700 font-mono tabular-nums whitespace-nowrap">
                          {formatPrice(row.repairRevenue)}
                        </td>
                        <td className="py-2 px-2 text-right text-cyan-700 font-mono tabular-nums whitespace-nowrap">
                          {formatPrice(row.partsRevenue)}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900 font-mono tabular-nums whitespace-nowrap">
                          {formatPrice(row.totalRevenue)}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-600 font-mono tabular-nums whitespace-nowrap">
                          {formatPrice(row.estimatedProfit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Pie Chart Category Share (5 cols on lg) */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <PieIcon className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Cơ Cấu Nguồn Thu Theo Danh Mục
                  </h4>
                </div>
              </div>

              {/* Donut Chart */}
              <div className="h-[210px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [`${value}% thị phần`, 'Tỷ trọng']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend list */}
              <div className="space-y-1.5 pt-1 text-xs">
                {categoryDistributionData.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
                      <span className="truncate">{cat.name}</span>
                    </span>
                    <span className="font-bold text-slate-900 tabular-nums font-mono">
                      {cat.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 1: BOOKINGS & REAL-TIME DISPATCH */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tiếp nhận yêu cầu từ khách, chẩn đoán lỗi, gửi báo giá và đẩy tiến độ sửa chữa trực tiếp lên điện thoại khách.</span>
            <span className="font-medium text-emerald-700">Dữ liệu thời gian thực</span>
          </div>

          <div className="space-y-4">
            {partnerBookings.map((b) => (
              <div 
                key={b.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-mono font-bold text-slate-900">{b.bookingCode}</span>
                      <span>·</span>
                      <span>{b.createdAt}</span>
                      {b.isRescue && (
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          CỨU HỘ 24/7
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {b.serviceName} - <span className="text-emerald-700">{b.vehicleModel}</span> ({b.licensePlate})
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Khách hàng: <span className="font-semibold text-slate-900">{b.customerName}</span> · SĐT: {b.customerPhone}
                      {b.address && <span className="block text-rose-700 font-medium mt-0.5">Vị trí cứu hộ: {b.address}</span>}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 italic">
                      Mô tả: "{b.description}"
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg inline-block ${
                      b.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      b.status === 'repairing' ? 'bg-blue-100 text-blue-800' :
                      b.status === 'quote_sent' ? 'bg-amber-100 text-amber-800' :
                      b.status === 'diagnosing' ? 'bg-purple-100 text-purple-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      Trạng thái: {b.status}
                    </span>
                  </div>
                </div>

                {/* Real-time progression buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg">
                  <div className="text-xs font-semibold text-slate-700">
                    Thao tác điều phối kỹ thuật viên:
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {b.status === 'pending' && (
                      <button
                        onClick={() => onUpdateBookingStatus(b.id, 'diagnosing', 'Kỹ thuật viên đang kiểm tra và đo đạc điện áp.')}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Bắt đầu chẩn đoán lỗi
                      </button>
                    )}

                    {b.status === 'diagnosing' && (
                      <button
                        onClick={() => setQuoteBookingId(b.id)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Gửi báo giá linh kiện cho khách
                      </button>
                    )}

                    {(b.status === 'quote_sent' || b.status === 'quote_approved') && (
                      <button
                        onClick={() => onUpdateBookingStatus(b.id, 'repairing', 'Đang tháo lắp và thay thế linh kiện trên cầu nâng.')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Bắt đầu sửa chữa / Lắp đặt
                      </button>
                    )}

                    {b.status === 'repairing' && (
                      <button
                        onClick={() => onUpdateBookingStatus(b.id, 'safety_testing', 'Đang kiểm tra an toàn điện & chạy thử xe.')}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Chuyển sang kiểm định tải
                      </button>
                    )}

                    {b.status === 'safety_testing' && (
                      <button
                        onClick={() => onUpdateBookingStatus(b.id, 'completed', 'Đã kiểm tra an toàn 100%, sẵn sàng bàn giao cho khách.')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Hoàn tất & Trả xe cho khách
                      </button>
                    )}

                    {b.status === 'completed' && (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Đã nghiệm thu hoàn tất
                      </span>
                    )}
                  </div>
                </div>

                {/* Inline Quote modal for partner */}
                {quoteBookingId === b.id && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-3">
                    <h4 className="font-bold text-amber-900">
                      Lập Bảng Báo Giá Linh Kiện & Tiền Công
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 mb-1">Tên linh kiện / Hạng mục</label>
                        <input
                          type="text"
                          value={quoteItemName}
                          onChange={(e) => setQuoteItemName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded border border-amber-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">Đơn giá (VNĐ)</label>
                        <input
                          type="number"
                          step={50000}
                          value={quoteAmount}
                          onChange={(e) => {
                            setQuoteAmount(Number(e.target.value));
                            setQuoteItemPrice(Number(e.target.value));
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-amber-300 bg-white font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setQuoteBookingId(null)}
                        className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded"
                      >
                        Huỷ
                      </button>
                      <button
                        onClick={() => handleSendQuoteSubmit(b.id)}
                        className="px-4 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded font-bold"
                      >
                        Gửi Báo Giá Ngay ({formatPrice(quoteAmount)})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {partnerBookings.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
                <p className="text-slate-500 text-sm">Cơ sở này hiện chưa có lịch sửa xe nào.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Quản Lý Kho Hàng & Tồn Kho Phụ Tùng Xe Điện
              </h3>
              <p className="text-xs text-slate-500">
                Cập nhật số lượng tồn kho theo thời gian thực. Cảnh báo tự động khi linh kiện chạm ngưỡng an toàn.
              </p>
            </div>

            <button
              onClick={() => setShowAddPartModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm linh kiện mới vào kho</span>
            </button>
          </div>

          {/* Low stock warning banner if any */}
          {lowStockParts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 px-4 flex items-center gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold">Cảnh báo: </span>
                Có {lowStockParts.length} linh kiện đang ở mức tồn kho báo động ({lowStockParts.map(p => p.name).join(', ')}). Vui lòng nhập thêm hàng từ nhà cung cấp.
              </div>
            </div>
          )}

          {/* Inventory Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Linh kiện / SKU</th>
                    <th className="py-3 px-3">Danh mục</th>
                    <th className="py-3 px-3 text-right">Giá vốn</th>
                    <th className="py-3 px-3 text-right">Giá niêm yết</th>
                    <th className="py-3 px-3 text-center">Tồn kho</th>
                    <th className="py-3 px-3 text-center">Đã bán</th>
                    <th className="py-3 px-4 text-center">Điều chỉnh nhanh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {partnerParts.map(part => {
                    const isLow = part.stock <= part.minStockAlert;
                    return (
                      <tr key={part.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={part.image} alt={part.name} className="w-10 h-10 rounded object-cover border border-slate-200 shrink-0" />
                            <div>
                              <div className="font-bold text-slate-900 line-clamp-1">{part.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{part.sku}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                            {part.category}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right font-mono text-slate-500 tabular-nums">
                          {formatPrice(part.costPrice)}
                        </td>

                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                          {formatPrice(part.price)}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded font-bold tabular-nums ${
                            isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {part.stock} cái
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center tabular-nums text-slate-600">
                          {part.soldCount}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center border border-slate-200 rounded-md bg-white">
                            <button
                              onClick={() => onUpdatePartStock(part.id, Math.max(0, part.stock - 1))}
                              className="px-2 py-1 text-slate-600 hover:bg-slate-100 rounded-l font-bold"
                              title="Giảm tồn kho 1 cái"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-1 font-bold text-slate-900 tabular-nums">
                              {part.stock}
                            </span>
                            <button
                              onClick={() => onUpdatePartStock(part.id, part.stock + 1)}
                              className="px-2 py-1 text-slate-600 hover:bg-slate-100 rounded-r font-bold"
                              title="Nhập thêm 1 cái"
                            >
                              +
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PARTS ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Đơn Hàng Linh Kiện Chờ Xử Lý & Xuất Kho
          </h3>

          <div className="space-y-3">
            {partnerOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-xs">{order.orderCode}</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                      Giao tới: {order.customerName} ({order.customerPhone}) - {order.customerAddress}, {order.city}
                    </h4>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-emerald-700 tabular-nums">{formatPrice(order.total)}</div>
                    <span className="text-[10px] text-slate-500 uppercase">{order.status}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Thao tác kho vận:</span>
                  <div className="flex items-center gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'confirmed', 'Đã kiểm tra linh kiện và đóng gói tem bảo hành.')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
                      >
                        Xác nhận & Đóng gói
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'shipping', 'Đã giao cho tài xế giao hoả tốc.')}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-xs font-semibold"
                      >
                        Bàn giao cho shipper
                      </button>
                    )}
                    {order.status === 'shipping' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'delivered', 'Khách hàng đã nhận và nghiệm thu.')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold"
                      >
                        Đã giao thành công
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {partnerOrders.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
                <p className="text-slate-500 text-sm">Chưa có đơn hàng nào xuất từ kho này.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: REVIEWS & REPLIES */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Đánh Giá Dịch Vụ & Phản Hồi Từ Khách Hàng
          </h3>

          <div className="space-y-4">
            {partnerReviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{rev.userName}</span>
                    <span className="text-xs text-slate-400">({rev.userPhoneMasked})</span>
                    <span>·</span>
                    <span className="text-xs text-slate-500">{rev.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{rev.rating} sao</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700">
                  "{rev.comment}"
                </p>

                {/* Existing Reply */}
                {rev.partnerReply ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Phản hồi của tiệm ({rev.partnerReplyDate || 'Hôm nay'}):</span>
                    </div>
                    <p className="text-slate-600">{rev.partnerReply}</p>
                  </div>
                ) : (
                  /* Reply input form */
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <input
                      type="text"
                      placeholder="Viết lời cảm ơn hoặc phản hồi chính thức tới khách..."
                      value={reviewReplyInputs[rev.id] || ''}
                      onChange={(e) => setReviewReplyInputs({ ...reviewReplyInputs, [rev.id]: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                    />
                    <button
                      onClick={() => handleSendReply(rev.id)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Gửi phản hồi</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {partnerReviews.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
                <p className="text-slate-500 text-sm">Chưa có đánh giá nào cho cơ sở này.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add New Part Modal */}
      {showAddPartModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Thêm Linh Kiện Mới Vào Kho ({activePartner.name})
            </h3>

            <form onSubmit={handleCreateNewPart} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Tên linh kiện *</label>
                <input
                  type="text"
                  required
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  placeholder="VD: Cụm dây tổng xe VinFast Feliz S"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Mã SKU</label>
                  <input
                    type="text"
                    value={newPartSku}
                    onChange={(e) => setNewPartSku(e.target.value)}
                    placeholder="VD: WIRE-VF-FLZ"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Danh mục</label>
                  <select
                    value={newPartCategory}
                    onChange={(e) => setNewPartCategory(e.target.value as PartCategory)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="battery">Pin Lithium & BMS</option>
                    <option value="controller">Bộ IC Điều Tốc</option>
                    <option value="motor">Động cơ BLDC</option>
                    <option value="charger">Bộ sạc thông minh</option>
                    <option value="brake_suspension">Phanh & Giảm xóc</option>
                    <option value="tire_wheel">Lốp & Vành</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Giá vốn (VNĐ)</label>
                  <input
                    type="number"
                    value={newPartCost}
                    onChange={(e) => setNewPartCost(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Giá bán (VNĐ) *</label>
                  <input
                    type="number"
                    value={newPartPrice}
                    onChange={(e) => setNewPartPrice(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tồn kho ban đầu</label>
                  <input
                    type="number"
                    value={newPartStock}
                    onChange={(e) => setNewPartStock(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Dòng xe tương thích</label>
                <input
                  type="text"
                  value={newPartVehicles}
                  onChange={(e) => setNewPartVehicles(e.target.value)}
                  placeholder="VinFast Klara, Theon, Dat Bike"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Mô tả tóm tắt</label>
                <textarea
                  rows={2}
                  value={newPartDesc}
                  onChange={(e) => setNewPartDesc(e.target.value)}
                  placeholder="Mô tả công dụng, tính năng nổi bật..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPartModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs"
                >
                  Lưu vào kho hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Store Profile Modal */}
      {showEditStoreModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Chỉnh sửa thông tin tiệm / Trung tâm</h3>
                  <p className="text-xs text-slate-500">Cập nhật hồ sơ tiệm xe, hotline, địa chỉ và năng lực kỹ thuật trên bản đồ số</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditStoreModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStoreInfo} className="space-y-4 pt-4 text-xs">
              {/* Section 1: Thông tin cơ bản */}
              <div className="space-y-3">
                <div className="font-semibold text-slate-800 text-[13px] flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>1. Thông tin chung</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-slate-700 mb-1">Tên cửa hàng / Cơ sở kinh doanh *</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="VD: Trạm Sửa Chữa Xe Điện VoltPro Cầu Giấy"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Loại hình kinh doanh</label>
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value as PartnerType)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <option value="repair_shop">Tiệm Sửa Xe Điện & Cứu Hộ</option>
                      <option value="parts_hub">Kho & Nhà Cung Cấp Linh Kiện</option>
                      <option value="both">Kết Hợp Sửa Chữa & Bán Linh Kiện</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Tên chủ sở hữu / Quản lý *</label>
                    <input
                      type="text"
                      required
                      value={editOwnerName}
                      onChange={(e) => setEditOwnerName(e.target.value)}
                      placeholder="VD: Nguyễn Văn Hưng"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Hotline / Số điện thoại *</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="0912 345 678"
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Email liên hệ</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="contact@tiemxedien.vn"
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium text-slate-700 mb-1">Khung giờ hoạt động</label>
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={editOpenHours}
                        onChange={(e) => setEditOpenHours(e.target.value)}
                        placeholder="07:30 - 21:00 (Hằng ngày kể cả Chủ Nhật)"
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Địa chỉ */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="font-semibold text-slate-800 text-[13px] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>2. Địa chỉ & Vị trí cửa hàng</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-slate-700 mb-1">Địa chỉ chi tiết (Số nhà, tên đường) *</label>
                    <input
                      type="text"
                      required
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      placeholder="VD: 142 Nguyễn Thị Thập, Phường Bình Thuận"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Quận / Huyện</label>
                    <input
                      type="text"
                      value={editDistrict}
                      onChange={(e) => setEditDistrict(e.target.value)}
                      placeholder="VD: Quận 7 hoặc Cầu Giấy"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Tỉnh / Thành phố</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      placeholder="TP. Hồ Chí Minh hoặc Hà Nội"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Dịch vụ & Dòng xe */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="font-semibold text-slate-800 text-[13px] flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-emerald-600" />
                  <span>3. Năng lực sửa chữa & Dịch vụ hỗ trợ</span>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Danh sách dịch vụ cung cấp <span className="text-slate-400 font-normal">(Phân cách bằng dấu phẩy)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={editServices}
                    onChange={(e) => setEditServices(e.target.value)}
                    placeholder="VD: Cứu hộ ắc quy, Nâng cấp pin Lithium, Sửa IC điều tốc, Thay lốp không săm, Bảo dưỡng định kỳ"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Các dòng xe tương thích <span className="text-slate-400 font-normal">(Phân cách bằng dấu phẩy)</span>
                  </label>
                  <input
                    type="text"
                    value={editCompatibleBrands}
                    onChange={(e) => setEditCompatibleBrands(e.target.value)}
                    placeholder="VD: VinFast, Dat Bike, Pega, Yadea, Dibao, Honda EV, Niu"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                {/* Tiện ích đặc biệt */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    editIs24_7Rescue ? 'bg-red-50/70 border-red-200 text-red-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <input
                      type="checkbox"
                      checked={editIs24_7Rescue}
                      onChange={(e) => setEditIs24_7Rescue(e.target.checked)}
                      className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                    />
                    <div>
                      <div className="font-semibold text-xs flex items-center gap-1">
                        <span>🚨 Dịch vụ cứu hộ 24/7</span>
                      </div>
                      <div className="text-[11px] text-slate-500">Sẵn sàng xuất xe cứu hộ tận nơi khi khách gặp sự cố</div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    editFastBatterySwap ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <input
                      type="checkbox"
                      checked={editFastBatterySwap}
                      onChange={(e) => setEditFastBatterySwap(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-semibold text-xs flex items-center gap-1">
                        <span>⚡ Điểm đổi pin nhanh</span>
                      </div>
                      <div className="text-[11px] text-slate-500">Có tủ sạc và pack pin dự phòng hỗ trợ đổi pin siêu tốc</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditStoreModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold transition-colors cursor-pointer"
                >
                  Huỷ bỏ
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lưu thay đổi thông tin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
