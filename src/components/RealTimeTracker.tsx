import React, { useState } from 'react';
import { Booking, Order, BookingStatus } from '../types';
import { 
  Activity, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  Package, 
  Phone, 
  User, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Star,
  PlayCircle,
  Truck,
  Coins,
  Sparkles
} from 'lucide-react';

interface RealTimeTrackerProps {
  bookings: Booking[];
  orders: Order[];
  activeCode?: string;
  onApproveQuote: (bookingId: string) => void;
  onAdvanceBookingStep: (bookingId: string) => void;
  onOpenReviewModal: (targetType: 'partner' | 'part', targetId: string, targetName: string) => void;
}

const BOOKING_STEPS_FLOW: { status: BookingStatus; label: string; desc: string }[] = [
  { status: 'pending', label: '1. Tiếp nhận lịch hẹn', desc: 'Tiệm đã tiếp nhận và sắp xếp khoang kỹ thuật.' },
  { status: 'diagnosing', label: '2. Đo kiểm & Chẩn đoán', desc: 'Kỹ thuật viên đo kiểm SOH pin, động cơ & hệ thống điện.' },
  { status: 'quote_sent', label: '3. Báo giá linh kiện', desc: 'Gửi bảng linh kiện thay thế kèm tiền công để khách duyệt.' },
  { status: 'repairing', label: '4. Đang sửa chữa & Lắp đặt', desc: 'Tiến hành thay thế linh kiện mới và cân chỉnh thông số.' },
  { status: 'safety_testing', label: '5. Kiểm định an toàn', desc: 'Test tải thực tế trên bàn dyno hoặc đường chạy thử nghiệm.' },
  { status: 'completed', label: '6. Sẵn sàng bàn giao', desc: 'Hoàn tất nghiệm thu, rửa xe và sẵn sàng trả xe cho khách.' }
];

export const RealTimeTracker: React.FC<RealTimeTrackerProps> = ({
  bookings,
  orders,
  activeCode,
  onApproveQuote,
  onAdvanceBookingStep,
  onOpenReviewModal
}) => {
  const [activeTab, setActiveTab] = useState<'booking' | 'order'>('booking');
  const [searchQuery, setSearchQuery] = useState<string>(activeCode || '');
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    bookings.find(b => b.bookingCode === activeCode)?.id || bookings[0]?.id || ''
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.find(o => o.orderCode === activeCode)?.id || orders[0]?.id || ''
  );

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const activeBooking = bookings.find(b => b.id === selectedBookingId) || bookings[0];
  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  // Helper to determine step completion index
  const getStepStatus = (stepStatus: BookingStatus, currentStatus: BookingStatus) => {
    const statusOrder: BookingStatus[] = [
      'pending', 
      'diagnosing', 
      'quote_sent', 
      'quote_approved', 
      'repairing', 
      'safety_testing', 
      'completed'
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (currentStatus === 'cancelled') return 'cancelled';
    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Hệ Thống Giám Sát Tiến Trình Minh Bạch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Theo Dõi Trạng Thái Đơn Hàng & Sửa Chữa Thời Gian Thực
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cập nhật tức thời từ bàn nâng kỹ thuật viên và kho vận. Khách hàng trực tiếp phê duyệt linh kiện báo giá.
          </p>
        </div>

        {/* Tab switch between Repair and Spare Parts order */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('booking')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'booking'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Tiến độ sửa xe ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('order')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'order'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Đơn hàng phụ tùng ({orders.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'booking' ? (
        /* REPAIR BOOKINGS SECTION */
        <div className="space-y-6">
          
          {/* Quick Booking Selector Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Chọn hồ sơ xe:</span>
              {bookings.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBookingId(b.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    b.id === activeBooking?.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{b.vehicleModel.split(' ')[0]} {b.vehicleModel.split(' ')[1]}</span>
                  <span className="text-[10px] opacity-80 font-mono">({b.bookingCode.slice(-4)})</span>
                </button>
              ))}
            </div>

            {/* Simulation Demo Button */}
            {activeBooking && activeBooking.status !== 'completed' && (
              <button
                onClick={() => onAdvanceBookingStep(activeBooking.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
                title="Giả lập kỹ thuật viên cập nhật bước tiếp theo"
              >
                <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mô phỏng thợ cập nhật bước tiếp</span>
              </button>
            )}
          </div>

          {activeBooking ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Visual Stepper & Timeline (8 cols on lg) */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                
                {/* Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Mã hồ sơ:</span>
                      <span className="font-mono font-bold text-slate-900">{activeBooking.bookingCode}</span>
                      <span>·</span>
                      <span>{activeBooking.createdAt}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                      {activeBooking.serviceName}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                      activeBooking.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : activeBooking.status === 'repairing'
                        ? 'bg-blue-100 text-blue-800 animate-pulse'
                        : activeBooking.status === 'quote_sent'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {activeBooking.status === 'completed' ? 'Đã hoàn tất nghiệm thu' :
                       activeBooking.status === 'safety_testing' ? 'Đang chạy kiểm định tải' :
                       activeBooking.status === 'repairing' ? 'Đang tháo lắp & sửa chữa' :
                       activeBooking.status === 'quote_sent' ? 'Chờ bạn duyệt báo giá' :
                       activeBooking.status === 'diagnosing' ? 'Đang đo kiểm chẩn đoán' : 'Tiếp nhận yêu cầu'}
                    </span>
                  </div>
                </div>

                {/* Interactive Multi-step Progress Bar */}
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Tiến Trình Xử Lý Thực Tế
                  </h3>

                  <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                    {BOOKING_STEPS_FLOW.map((step, idx) => {
                      const state = getStepStatus(step.status, activeBooking.status);
                      const matchingTimeline = activeBooking.timeline.find(t => t.status === step.status);

                      return (
                        <div key={step.status} className="relative group">
                          {/* Dot / Icon Indicator */}
                          <div className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            state === 'completed'
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                              : state === 'current'
                              ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-100 animate-bounce-subtle'
                              : 'bg-slate-200 text-slate-500'
                          }`}>
                            {state === 'completed' ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>

                          {/* Content */}
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h4 className={`text-sm font-bold ${
                                state === 'current' ? 'text-cyan-800' : state === 'completed' ? 'text-slate-900' : 'text-slate-400'
                              }`}>
                                {step.label}
                              </h4>
                              {matchingTimeline?.time && (
                                <span className="text-xs text-slate-400 font-mono">
                                  {matchingTimeline.time}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-500">
                              {matchingTimeline?.note || step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quote Approval Interactive Box if quote_sent */}
                {activeBooking.status === 'quote_sent' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <span>Kỹ Thuật Viên Đã Gửi Báo Giá Linh Kiện Cần Thay</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Vui lòng xem lại danh mục linh kiện và phê duyệt để tiệm bắt đầu tháo lắp sửa chữa xe.
                        </p>
                      </div>
                    </div>

                    {/* Breakdown table */}
                    <div className="bg-white rounded-lg border border-amber-200/80 overflow-hidden text-xs">
                      <div className="p-3 bg-amber-100/50 font-semibold text-slate-800 grid grid-cols-12">
                        <span className="col-span-8">Hạng mục / Linh kiện</span>
                        <span className="col-span-2 text-center">SL</span>
                        <span className="col-span-2 text-right">Đơn giá</span>
                      </div>
                      {activeBooking.quoteParts?.map((qp, idx) => (
                        <div key={idx} className="p-3 border-t border-slate-100 grid grid-cols-12 items-center">
                          <span className="col-span-8 font-medium text-slate-800">{qp.name}</span>
                          <span className="col-span-2 text-center tabular-nums">{qp.quantity}</span>
                          <span className="col-span-2 text-right font-semibold tabular-nums">{formatPrice(qp.price)}</span>
                        </div>
                      ))}
                      {activeBooking.discountFromPoints && activeBooking.discountFromPoints > 0 && (
                        <div className="p-2.5 bg-amber-50/70 border-t border-amber-200/60 flex justify-between text-xs font-semibold text-amber-800">
                          <span className="flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5 text-amber-600" />
                            <span>Voucher giảm giá từ điểm thưởng ({activeBooking.pointsRedeemed} điểm):</span>
                          </span>
                          <span className="tabular-nums">-{formatPrice(activeBooking.discountFromPoints)}</span>
                        </div>
                      )}
                      <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                        <span>Tổng chi phí thanh toán dự kiến:</span>
                        <span className="text-emerald-700 tabular-nums">
                          {formatPrice(activeBooking.quoteAmount || 0)}
                        </span>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        onClick={() => onApproveQuote(activeBooking.id)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Tôi Phê Duyệt Báo Giá Này</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Rating CTA & Loyalty Reward when completed */}
                {activeBooking.status === 'completed' && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-cyan-500/10 border border-amber-300 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <Coins className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                          <span className="font-bold text-amber-950">
                            +{activeBooking.pointsEarned || 150} VoltPoints đã được tích luỹ vào ví của bạn!
                          </span>
                          <p className="text-[11px] text-amber-800">
                            Cảm ơn bạn đã nghiệm thu dịch vụ tại {activeBooking.partnerName}. Điểm thưởng có thể dùng giảm giá cho lần sửa chữa hoặc mua linh kiện tiếp theo.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-emerald-900">
                          Xe của bạn đã sửa xong và hoạt động hoàn hảo!
                        </h4>
                        <p className="text-xs text-emerald-700 mt-0.5">
                          Hãy để lại đánh giá dịch vụ để nhận thêm +20 VoltPoints và giúp cộng đồng người đi xe điện tìm được địa chỉ uy tín.
                        </p>
                      </div>

                      <button
                        onClick={() => onOpenReviewModal('partner', activeBooking.partnerId, activeBooking.partnerName)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shadow-xs cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Viết đánh giá 5 sao</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Vehicle & Workshop Info (4 cols on lg) */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Vehicle Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                    Thông Tin Xe & Khách Hàng
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Chủ xe:</span>
                      <span className="font-semibold text-slate-900">{activeBooking.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Số điện thoại:</span>
                      <span className="font-mono text-slate-800">{activeBooking.customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dòng xe điện:</span>
                      <span className="font-semibold text-emerald-700">{activeBooking.vehicleModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Biển số:</span>
                      <span className="font-mono font-bold text-slate-900">{activeBooking.licensePlate}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500 font-medium">Hiện trạng lỗi:</span>
                    <p className="text-xs text-slate-700 mt-1 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      "{activeBooking.description}"
                    </p>
                  </div>
                </div>

                {/* Partner Assigned Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                    Tiệm Sửa Chữa Phụ Trách
                  </h4>

                  <div>
                    <h5 className="font-bold text-sm text-slate-900">
                      {activeBooking.partnerName}
                    </h5>
                    {activeBooking.technicianNote && (
                      <div className="mt-2 text-xs text-slate-600 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                        <span className="font-semibold text-emerald-800">Ghi chú thợ chính: </span>
                        {activeBooking.technicianNote}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 text-xs text-slate-600 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Dự kiến xong: {activeBooking.estimatedCompletion || 'Trong ngày'}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
              <p className="text-slate-500 text-sm">Chưa có lịch sửa xe nào được tạo.</p>
            </div>
          )}

        </div>
      ) : (
        /* SPARE PARTS ORDERS SECTION */
        <div className="space-y-6">
          {activeOrder ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Mã đơn hàng:</span>
                    <span className="font-mono font-bold text-slate-900">{activeOrder.orderCode}</span>
                    <span>·</span>
                    <span>{activeOrder.createdAt}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    Đơn hàng linh kiện giao tới {activeOrder.customerAddress}, {activeOrder.city}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-100 text-cyan-800 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    <span>{activeOrder.status === 'shipping' ? 'Đang vận chuyển hoả tốc' : activeOrder.status === 'confirmed' ? 'Đã đóng gói chuẩn bị giao' : 'Đang xử lý'}</span>
                  </span>
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Danh Sách Linh Kiện Đặt Mua
                </h3>
                <div className="space-y-2">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.partName} className="w-12 h-12 rounded object-cover border border-slate-200" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{item.partName}</h4>
                          <span className="text-[11px] text-slate-500">Số lượng: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900 tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 text-right text-xs pt-2 border-t border-slate-100">
                  {activeOrder.discountFromPoints && activeOrder.discountFromPoints > 0 && (
                    <div className="text-amber-700 font-semibold flex items-center justify-end gap-1">
                      <Coins className="w-3.5 h-3.5" />
                      <span>Giảm trừ điểm thưởng ({activeOrder.pointsRedeemed} điểm): -{formatPrice(activeOrder.discountFromPoints)}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500">Tổng thanh toán: </span>
                    <span className="text-base font-bold text-emerald-700 tabular-nums">{formatPrice(activeOrder.total)}</span>
                    <span className="text-slate-400 text-[11px] ml-1">({activeOrder.paymentMethod === 'vietqr' ? 'Đã thanh toán VietQR' : 'COD'})</span>
                  </div>
                  {activeOrder.pointsEarned && (
                    <div className="text-[11px] text-emerald-700 font-medium flex items-center justify-end gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Đơn hàng đã tích luỹ: <strong>+{activeOrder.pointsEarned} VoltPoints</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Tracking Stepper */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                  Nhật Ký Vận Chuyển Thời Gian Thực
                </h3>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeOrder.trackingTimeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{step.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
              <p className="text-slate-500 text-sm">Chưa có đơn mua phụ tùng nào.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
