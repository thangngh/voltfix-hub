import React, { useState, useMemo } from 'react';
import { Partner, Booking, ServiceCategory, SparePart, QuotePartItem } from '../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Wrench, 
  AlertTriangle, 
  Zap, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck,
  Package,
  Check,
  Eye,
  X,
  Info,
  Layers,
  ArrowRight,
  Coins
} from 'lucide-react';

interface BookingModuleProps {
  partners: Partner[];
  parts?: SparePart[];
  selectedPartner?: Partner | null;
  onBookingCreated: (booking: Booking) => void;
  onNavigateToTracker: (bookingCode: string) => void;
  loyaltyPoints?: number;
}

const SERVICE_OPTIONS: { id: ServiceCategory; title: string; desc: string; icon: any; isRescue?: boolean }[] = [
  {
    id: 'emergency_rescue',
    title: 'Cứu hộ khẩn cấp 24/7 (Lưu động tại chỗ)',
    desc: 'Xe chết máy giữa đường, đứt dây ga, hỏng cầu chì, thủng lốp cần hỗ trợ ngay trong 15-30 phút.',
    icon: Zap,
    isRescue: true
  },
  {
    id: 'battery_upgrade',
    title: 'Độ & Nâng cấp Khối Pin Lithium LiFePO4',
    desc: 'Thay thế ắc quy chì lỗi thời bằng khối pin dung lượng cao, tăng quãng đường >120km, bảo hành 2-3 năm.',
    icon: Sparkles
  },
  {
    id: 'periodic_maintenance',
    title: 'Bảo dưỡng định kỳ 18 hạng mục an toàn',
    desc: 'Kiểm tra độ chụm bánh, siết ốc cổ phốt, tra mỡ vòng bi, kiểm tra độ mòn má phanh, cập nhật ECU.',
    icon: Wrench
  },
  {
    id: 'motor_controller',
    title: 'Sửa chữa & Cân chỉnh Động cơ, IC Votol',
    desc: 'Khắc phục xe giật cục, thay cảm biến Hall motor, căn chỉnh map ga êm ái trên máy tính.',
    icon: CheckCircle2
  },
  {
    id: 'brake_tire',
    title: 'Hệ thống Phanh E-ABS & Lốp chuyên dụng EV',
    desc: 'Thay thế má phanh gốm, xả e dầu phanh DOT4, vá nấm lốp không săm hoặc thay cặp lốp bám đường.',
    icon: ShieldCheck
  },
  {
    id: 'electrical_diagnostic',
    title: 'Chẩn đoán lỗi điện tử & Hệ thống dây điện',
    desc: 'Đo chập chạm, phục hồi màn hình đồng hồ tốc độ, xử lý xe ngập nước không lên nguồn.',
    icon: AlertTriangle
  }
];

const POPULAR_VEHICLES = [
  'VinFast Evo200 / Evo200 Lite',
  'VinFast Feliz / Feliz S',
  'VinFast Klara S / Klara S2',
  'VinFast Theon / Theon S',
  'VinFast Vento / Vento S',
  'Dat Bike Weaver++ / Weaver 200',
  'Dat Bike Quantum',
  'Yadea G5 / Keeness / VoltGuard',
  'Pega S / Pega Aura',
  'Dibao Pansy / Gogo',
  'Dòng xe máy điện độ khác'
];

export const BookingModule: React.FC<BookingModuleProps> = ({
  partners,
  parts = [],
  selectedPartner,
  onBookingCreated,
  onNavigateToTracker,
  loyaltyPoints = 0
}) => {
  const [serviceType, setServiceType] = useState<ServiceCategory>('periodic_maintenance');
  const [partnerId, setPartnerId] = useState<string>(selectedPartner?.id || partners[0]?.id || '');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [vehicleBrand, setVehicleBrand] = useState<string>('VinFast');
  const [vehicleModel, setVehicleModel] = useState<string>('VinFast Feliz S');
  const [licensePlate, setLicensePlate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [rescueAddress, setRescueAddress] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [preferredTime, setPreferredTime] = useState<string>('09:00');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Loyalty points discount in booking
  const [useBookingPoints, setUseBookingPoints] = useState<boolean>(false);
  const [bookingPointsToRedeem, setBookingPointsToRedeem] = useState<number>(50);

  // Suggested parts selected by customer
  const [selectedPartIds, setSelectedPartIds] = useState<string[]>([]);
  const [previewPart, setPreviewPart] = useState<SparePart | null>(null);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const selectedServiceObj = SERVICE_OPTIONS.find(s => s.id === serviceType) || SERVICE_OPTIONS[0];
  const activePartner = partners.find(p => p.id === partnerId) || partners[0];

  // Smart Recommendation Logic: Cross-referencing vehicle model & brand with warehouse parts
  const recommendedParts = useMemo(() => {
    if (!parts || parts.length === 0) return [];

    const brandQuery = vehicleBrand.toLowerCase().trim();
    const modelQuery = vehicleModel.toLowerCase().trim();

    // Extract model keywords (e.g., "feliz", "theon", "klara", "evo", "weaver", "quantum", "g5")
    const modelKeywords = modelQuery
      .replace(/vinfast|dat\s*bike|yadea|pega|dibao|\/|\+/gi, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 2);

    return parts.map(part => {
      let score = 0;
      let matchedReason = '';

      // 1. Check exact or partial compatibleModels list
      for (const comp of part.compatibleModels) {
        const compLower = comp.toLowerCase();
        
        // Direct model match
        for (const kw of modelKeywords) {
          if (compLower.includes(kw)) {
            score += 10;
            matchedReason = `Khớp chuẩn dòng ${kw.toUpperCase()}`;
            break;
          }
        }

        // Brand match
        if (compLower.includes(brandQuery)) {
          score += 5;
          if (!matchedReason) matchedReason = `Tương thích hệ sinh thái ${vehicleBrand}`;
        }

        // Universal match
        if (compLower.includes('tất cả') || compLower.includes('phổ thông')) {
          score += 3;
          if (!matchedReason) matchedReason = 'Chuẩn quy cách phổ thông xe điện';
        }
      }

      // 2. Service type alignment boost
      if (serviceType === 'battery_upgrade' && part.category === 'battery') {
        score += 8;
        matchedReason = 'Linh kiện đề xuất cho gói độ Pin';
      } else if (serviceType === 'motor_controller' && (part.category === 'controller' || part.category === 'motor')) {
        score += 8;
        matchedReason = 'Linh kiện đề xuất cho gói IC & Động cơ';
      } else if (serviceType === 'brake_tire' && (part.category === 'brake_suspension' || part.category === 'tire_wheel')) {
        score += 8;
        matchedReason = 'Linh kiện đề xuất cho hệ thống phanh & lốp';
      }

      // 3. In-stock bonus
      if (part.inStock && part.stock > 0) {
        score += 2;
      }

      return {
        part,
        score,
        matchedReason: matchedReason || `Linh kiện phù hợp xe ${vehicleBrand}`
      };
    })
    .filter(item => item.score > 2)
    .sort((a, b) => b.score - a.score);
  }, [parts, vehicleBrand, vehicleModel, serviceType]);

  const toggleSelectPart = (partId: string) => {
    setSelectedPartIds(prev => 
      prev.includes(partId) ? prev.filter(id => id !== partId) : [...prev, partId]
    );
  };

  const selectedPartsObjects = useMemo(() => {
    return parts.filter(p => selectedPartIds.includes(p.id));
  }, [parts, selectedPartIds]);

  const selectedPartsTotalAmount = useMemo(() => {
    return selectedPartsObjects.reduce((acc, p) => acc + p.price, 0);
  }, [selectedPartsObjects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Vui lòng nhập họ tên và số điện thoại liên hệ');
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN');
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const timestampFormatted = `${timeStr} ${dateStr}`;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `EV-BK-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${randomSuffix}`;

    // Attach suggested quote parts if customer selected any
    const attachedQuoteParts: QuotePartItem[] = selectedPartsObjects.map(p => ({
      partId: p.id,
      name: p.name,
      quantity: 1,
      price: p.price
    }));

    const effectiveBookingPoints = useBookingPoints && loyaltyPoints && loyaltyPoints >= 50
      ? Math.min(bookingPointsToRedeem, loyaltyPoints)
      : 0;
    const discountFromPoints = effectiveBookingPoints * 1000;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      bookingCode,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      vehicleBrand,
      vehicleModel,
      licensePlate: licensePlate.trim() || 'Chưa đăng ký biển',
      serviceType,
      serviceName: selectedServiceObj.title,
      description: selectedPartsObjects.length > 0
        ? `${description.trim() ? description.trim() + ' | ' : ''}Yêu cầu đăng ký lắp kèm: ${selectedPartsObjects.map(p => p.name).join(', ')}`
        : description.trim() || 'Khách hàng yêu cầu kiểm tra tổng quát theo gói dịch vụ.',
      isRescue: selectedServiceObj.isRescue || false,
      address: selectedServiceObj.isRescue ? (rescueAddress.trim() || 'Khu vực nội thành gần tiệm') : undefined,
      preferredDate,
      preferredTime: selectedServiceObj.isRescue ? 'Cứu hộ khẩn cấp ngay' : preferredTime,
      partnerId: activePartner.id,
      partnerName: activePartner.name,
      status: selectedPartsObjects.length > 0 ? 'quote_sent' : 'pending',
      quoteAmount: selectedPartsTotalAmount > 0 ? Math.max(0, selectedPartsTotalAmount - discountFromPoints) : undefined,
      quoteParts: attachedQuoteParts.length > 0 ? attachedQuoteParts : undefined,
      discountFromPoints: discountFromPoints > 0 ? discountFromPoints : undefined,
      pointsRedeemed: effectiveBookingPoints > 0 ? effectiveBookingPoints : undefined,
      pointsEarned: 150,
      timeline: [
        {
          status: 'pending',
          title: selectedServiceObj.isRescue ? 'Đã phát tín hiệu cứu hộ khẩn cấp 24/7' : 'Đã tiếp nhận lịch hẹn trên VoltFix Hub',
          time: timestampFormatted,
          note: selectedServiceObj.isRescue 
            ? `Hệ thống đã điều phối kỹ thuật viên trực trạm chuẩn bị xuất phát.${effectiveBookingPoints > 0 ? ` (Đã áp dụng voucher giảm ${formatPrice(discountFromPoints)} từ ${effectiveBookingPoints} VoltPoints)` : ''}`
            : selectedPartsObjects.length > 0
            ? `Tiệm đã nhận được yêu cầu và chuẩn bị sẵn ${selectedPartsObjects.length} linh kiện tương thích đăng ký kèm.${effectiveBookingPoints > 0 ? ` (Đã áp dụng voucher giảm ${formatPrice(discountFromPoints)})` : ''}`
            : `Tiệm đã nhận được yêu cầu và chuẩn bị sẵn khoang kỹ thuật.${effectiveBookingPoints > 0 ? ` (Đã áp dụng voucher giảm ${formatPrice(discountFromPoints)})` : ''}`
        }
      ],
      createdAt: timestampFormatted,
      estimatedCompletion: selectedServiceObj.isRescue ? '30-45 phút có mặt' : 'Trong ngày'
    };

    setTimeout(() => {
      onBookingCreated(newBooking);
      setCreatedBooking(newBooking);
      setIsSubmitting(false);
    }, 400);
  };

  // If just submitted successfully, show confirmation screen
  if (createdBooking) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              {createdBooking.isRescue ? 'Tín hiệu cứu hộ đã kích hoạt!' : 'Đặt lịch hẹn thành công!'}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Mã Lịch Hẹn: <span className="text-emerald-700 font-mono">{createdBooking.bookingCode}</span>
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto mt-2">
              Đối tác <span className="font-semibold text-slate-800">{createdBooking.partnerName}</span> đã nhận được thông tin và đang phân công kỹ thuật viên.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 text-left text-xs sm:text-sm space-y-2 max-w-md mx-auto">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Khách hàng:</span>
              <span className="font-medium text-slate-900">{createdBooking.customerName} ({createdBooking.customerPhone})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Dòng xe:</span>
              <span className="font-medium text-slate-900">{createdBooking.vehicleModel} - {createdBooking.licensePlate}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Dịch vụ:</span>
              <span className="font-medium text-slate-900">{createdBooking.serviceName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Thời gian:</span>
              <span className="font-medium text-emerald-700">{createdBooking.preferredTime} · {createdBooking.preferredDate}</span>
            </div>

            {createdBooking.quoteParts && createdBooking.quoteParts.length > 0 && (
              <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-600 font-semibold">
                  <span>Linh kiện gợi ý đã đăng ký ({createdBooking.quoteParts.length}):</span>
                  <span className="text-emerald-700 tabular-nums">{formatPrice(createdBooking.quoteAmount || 0)}</span>
                </div>
                <div className="space-y-1">
                  {createdBooking.quoteParts.map((qp, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] bg-white border border-emerald-100 p-1.5 rounded text-emerald-900">
                      <span className="truncate">{qp.name}</span>
                      <span className="font-mono font-semibold tabular-nums shrink-0 ml-2">{formatPrice(qp.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigateToTracker(createdBooking.bookingCode)}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>Xem tiến độ sửa chữa thời gian thực</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCreatedBooking(null)}
              className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              Đặt thêm lịch khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>Đặt Lịch Hẹn Chuẩn Hoá Toàn Quốc</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Đặt Lịch Sửa Chữa & Cứu Hộ Xe Điện 24/7
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Kết nối trực tiếp tới tiệm sửa xe điện và trung tâm linh kiện gần bạn nhất. Theo dõi từng bước kiểm tra, báo giá và tiến độ sửa xe trên màn hình thời gian thực.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
        
        {/* Step 1: Chọn dịch vụ */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">
            1. Chọn loại hình dịch vụ bạn cần
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SERVICE_OPTIONS.map((svc) => {
              const Icon = svc.icon;
              const isSelected = serviceType === svc.id;
              return (
                <div
                  key={svc.id}
                  onClick={() => setServiceType(svc.id)}
                  className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
                    isSelected
                      ? svc.isRescue
                        ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20'
                        : 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                      : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isSelected
                        ? svc.isRescue ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                        {svc.title}
                        {svc.isRescue && (
                          <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">
                            KHẨN CẤP
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {svc.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Chọn tiệm / Đối tác sửa xe */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            2. Chọn tiệm sửa xe hoặc trung tâm linh kiện tiếp nhận
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {partners.filter(p => p.type === 'repair_shop' || p.type === 'both').map(p => {
              const isSelected = partnerId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setPartnerId(p.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/30 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {p.name}
                      </h4>
                      {p.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {p.address}, {p.district}
                    </p>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {p.is24_7Rescue ? 'Cứu hộ 24/7' : 'Giờ làm: ' + p.openHours}
                    </div>
                  </div>

                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rescue address prompt if emergency rescue is selected */}
        {selectedServiceObj.isRescue && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>Vị trí cần cứu hộ khẩn cấp</span>
            </div>
            <input
              type="text"
              required
              value={rescueAddress}
              onChange={(e) => setRescueAddress(e.target.value)}
              placeholder="Nhập số nhà, tên đường, toà nhà hoặc mô tả vị trí bạn đang đứng..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-rose-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
            <p className="text-[11px] text-rose-700">
              * Kỹ thuật viên lưu động sẽ liên hệ số điện thoại của bạn ngay sau khi nhận yêu cầu để xác nhận vị trí GPS.
            </p>
          </div>
        )}

        {/* Step 3: Thông tin xe & Hiện trạng */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">
            3. Thông tin xe điện của bạn
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Hãng xe
              </label>
              <select
                value={vehicleBrand}
                onChange={(e) => setVehicleBrand(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="VinFast">VinFast</option>
                <option value="Dat Bike">Dat Bike</option>
                <option value="Yadea">Yadea</option>
                <option value="Pega">Pega</option>
                <option value="Dibao">Dibao</option>
                <option value="Gogoro">Gogoro</option>
                <option value="Khác">Hãng xe khác</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Dòng xe (Model)
              </label>
              <input
                type="text"
                list="models-list"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="VD: VinFast Feliz S, Weaver++"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <datalist id="models-list">
                {POPULAR_VEHICLES.map((m, idx) => (
                  <option key={idx} value={m} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Biển số xe (nếu có)
              </label>
              <input
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                placeholder="VD: 29-B1 123.45"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 uppercase"
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Mô tả triệu chứng / Yêu cầu sửa chữa cụ thể
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ví dụ: Xe vặn ga bị giật cục, pin chạy nhanh sụt vạch, phanh trước kêu rít..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Smart Spare Parts Recommendation Section */}
          <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-cyan-50/40 to-slate-50 border border-emerald-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-100">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>Gợi Ý Linh Kiện Tương Thích Chuẩn Kỹ Thuật: {vehicleModel || vehicleBrand}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Đối chiếu tự động giữa model xe của bạn và kho linh kiện ({recommendedParts.length} linh kiện tương thích 100%).
                </p>
              </div>

              {selectedPartIds.length > 0 && (
                <span className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full font-semibold tabular-nums shrink-0 shadow-xs">
                  Đã chọn {selectedPartIds.length} linh kiện ({formatPrice(selectedPartsTotalAmount)})
                </span>
              )}
            </div>

            {/* Suggested Parts Cards Grid */}
            {recommendedParts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recommendedParts.map(({ part, matchedReason }) => {
                  const isSelected = selectedPartIds.includes(part.id);
                  return (
                    <div
                      key={part.id}
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between bg-white text-xs ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs bg-emerald-50/20'
                          : 'border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex gap-2.5">
                          <img
                            src={part.image}
                            alt={part.name}
                            className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded truncate max-w-full">
                              ✓ {matchedReason}
                            </span>
                            <h5 className="font-bold text-slate-900 line-clamp-1 mt-0.5">
                              {part.name}
                            </h5>
                            <div className="text-[11px] font-mono text-slate-500">
                              {part.sku}
                            </div>
                          </div>
                        </div>

                        {/* Specs Pill List */}
                        <div className="flex flex-wrap gap-1 text-[10px] text-slate-600">
                          {Object.entries(part.specs).slice(0, 2).map(([k, v], idx) => (
                            <span key={idx} className="bg-slate-100 px-1.5 py-0.5 rounded">
                              {k}: <strong>{v}</strong>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Price and Add button */}
                      <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-slate-900 tabular-nums">
                            {formatPrice(part.price)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Kho còn: {part.stock} cái
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewPart(part)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                            title="Xem thông số kỹ thuật chi tiết"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleSelectPart(part.id)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Đã chọn</span>
                              </>
                            ) : (
                              <>
                                <span>+ Lắp kèm</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 bg-white/70 rounded-xl text-xs text-slate-500">
                Đang đối chiếu dữ liệu kho linh kiện cho dòng xe {vehicleBrand} {vehicleModel}...
              </div>
            )}

            {selectedPartIds.length > 0 && (
              <div className="p-2.5 bg-emerald-100/60 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Các linh kiện này sẽ được lưu kèm vào lịch hẹn để kỹ thuật viên chuẩn bị sẵn sàng khi bạn tới tiệm.
                  </span>
                </span>
                <span className="font-bold font-mono shrink-0 ml-2">
                  Tổng: {formatPrice(selectedPartsTotalAmount)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Step 4: Thời gian hẹn & Thông tin liên hệ */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">
            4. Thời gian hẹn & Thông tin liên hệ
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Họ và tên khách hàng *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Số điện thoại liên hệ *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0988 xxx xxx"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {!selectedServiceObj.isRescue && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Ngày hẹn
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Khung giờ dự kiến
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="08:00">08:00 - Sáng sớm</option>
                      <option value="09:30">09:30 - Buổi sáng</option>
                      <option value="11:00">11:00 - Trưa</option>
                      <option value="14:00">14:00 - Đầu giờ chiều</option>
                      <option value="16:00">16:00 - Chiều muộn</option>
                      <option value="18:30">18:30 - Tối</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Loyalty Points Voucher Discount at Partner Shop */}
        {loyaltyPoints > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-950">Đổi điểm thưởng VoltPoints giảm giá dịch vụ tại tiệm</div>
                  <div className="text-[11px] text-amber-800">
                    Số dư của bạn: <strong className="font-bold text-amber-950">{loyaltyPoints} điểm</strong> · Khấu trừ trực tiếp trên báo giá và công thợ
                  </div>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={useBookingPoints} 
                  onChange={(e) => setUseBookingPoints(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {useBookingPoints && (
              <div className="space-y-2 pt-2 border-t border-amber-200/60">
                <div className="text-[11px] font-semibold text-amber-900">Chọn mức voucher áp dụng tại {activePartner.name}:</div>
                <div className="grid grid-cols-3 gap-2">
                  {[50, 100, 150].map((preset) => {
                    const isSelectable = loyaltyPoints >= preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        disabled={!isSelectable}
                        onClick={() => setBookingPointsToRedeem(preset)}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          bookingPointsToRedeem === preset && isSelectable
                            ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                            : isSelectable
                            ? 'bg-white text-slate-800 border-amber-200 hover:bg-amber-100/70'
                            : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <div className="text-xs font-bold">-{formatPrice(preset * 1000)}</div>
                        <div className={`text-[10px] ${bookingPointsToRedeem === preset && isSelectable ? 'text-amber-100' : 'text-slate-500'}`}>
                          Đổi {preset} điểm
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Hoàn tất dịch vụ này bạn sẽ được tích luỹ thêm <strong>+150 VoltPoints</strong> vào tài khoản!</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            * Báo giá linh kiện & tiền công sẽ được gửi trực tiếp qua trang theo dõi thời gian thực để bạn phê duyệt trước khi thợ sửa chữa.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm text-white shadow-sm flex items-center justify-center gap-2 transition-all ${
              selectedServiceObj.isRescue
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
            }`}
          >
            {isSubmitting ? (
              <span>Đang gửi thông tin...</span>
            ) : selectedServiceObj.isRescue ? (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Gửi Tín Hiệu Cứu Hộ Khẩn Cấp Ngay</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác Nhận Đặt Lịch Hẹn Sửa Chữa</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* Suggested Part Quick Preview Modal */}
      {previewPart && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="relative aspect-16/9 bg-slate-100">
              <img
                src={previewPart.image}
                alt={previewPart.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => setPreviewPart(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <span className="font-mono font-semibold">{previewPart.sku}</span>
                  <span>·</span>
                  <span>Kho: {previewPart.partnerName}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {previewPart.name}
                </h3>
                <div className="text-lg font-bold text-emerald-700 mt-1 tabular-nums">
                  {formatPrice(previewPart.price)}
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">
                {previewPart.description}
              </p>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Thông Số Kỹ Thuật
                </h4>
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  {Object.entries(previewPart.specs).map(([key, val], idx) => (
                    <div
                      key={idx}
                      className={`flex py-1.5 px-3 justify-between ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
                    >
                      <span className="text-slate-500">{key}</span>
                      <span className="font-semibold text-slate-900 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Dòng Xe Tương Thích
                </h4>
                <div className="flex flex-wrap gap-1">
                  {previewPart.compatibleModels.map((m, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewPart(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Đóng
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toggleSelectPart(previewPart.id);
                    setPreviewPart(null);
                  }}
                  className={`px-4 py-2 rounded-lg font-bold shadow-xs flex items-center gap-1.5 ${
                    selectedPartIds.includes(previewPart.id)
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {selectedPartIds.includes(previewPart.id) ? (
                    <span>Bỏ chọn linh kiện này</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Chọn lắp kèm vào lịch hẹn ({formatPrice(previewPart.price)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
