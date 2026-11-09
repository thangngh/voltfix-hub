import React, { useState } from 'react';
import { CartItem, Order, OrderItem } from '../types';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  QrCode, 
  Truck, 
  ShieldCheck, 
  CheckCircle2,
  CreditCard,
  Coins,
  Sparkles
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (partId: string, quantity: number) => void;
  onRemoveItem: (partId: string) => void;
  onClearCart: () => void;
  onOrderCreated: (order: Order) => void;
  onNavigateToTracker: (orderCode: string) => void;
  loyaltyPoints?: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCreated,
  onNavigateToTracker,
  loyaltyPoints = 0
}) => {
  const [isCheckoutMode, setIsCheckoutMode] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [city, setCity] = useState<string>('Hà Nội');
  const [district, setDistrict] = useState<string>('Cầu Giấy');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vietqr' | 'momo'>('vietqr');
  const [orderNote, setOrderNote] = useState<string>('');
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Loyalty points redemption in checkout
  const [usePoints, setUsePoints] = useState<boolean>(false);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(50);

  if (!isOpen) return null;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.part.price * item.quantity, 0);
  const shippingFee = subtotal > 3000000 ? 0 : (cartItems.length > 0 ? 35000 : 0);

  // Points redemption calculations: 1 point = 1,000 VND discount, max 50% of subtotal
  const maxRedeemablePoints = loyaltyPoints ? Math.min(loyaltyPoints, Math.floor((subtotal * 0.5) / 1000)) : 0;
  const effectivePointsToRedeem = usePoints ? Math.min(pointsToRedeem, maxRedeemablePoints) : 0;
  const discountFromPoints = effectivePointsToRedeem * 1000;
  const total = Math.max(0, subtotal + shippingFee - discountFromPoints);
  const pointsEarned = Math.max(15, Math.floor(total / 20000));

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận linh kiện');
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN');
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const timestampFormatted = `${timeStr} ${dateStr}`;

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderCode = `VF-ORD-${randomSuffix}`;

    const orderItems: OrderItem[] = cartItems.map(item => ({
      partId: item.part.id,
      partName: item.part.name,
      price: item.part.price,
      quantity: item.quantity,
      image: item.part.image,
      partnerId: item.part.partnerId
    }));

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderCode,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
      city,
      district,
      note: orderNote.trim(),
      items: orderItems,
      subtotal,
      shippingFee,
      discountFromPoints: discountFromPoints > 0 ? discountFromPoints : undefined,
      pointsRedeemed: effectivePointsToRedeem > 0 ? effectivePointsToRedeem : undefined,
      pointsEarned,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'vietqr' ? 'paid' : 'unpaid',
      status: 'pending',
      trackingTimeline: [
        {
          status: 'pending',
          title: 'Đơn hàng linh kiện đã ghi nhận trên hệ thống',
          time: timestampFormatted,
          description: `Phương thức thanh toán: ${paymentMethod === 'vietqr' ? 'VietQR 24/7 (Đã thanh toán)' : paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Ví MoMo'}${effectivePointsToRedeem > 0 ? ` · Đã áp dụng ${effectivePointsToRedeem} VoltPoints (-${formatPrice(discountFromPoints)})` : ''}`
        }
      ],
      createdAt: timestampFormatted
    };

    setTimeout(() => {
      onOrderCreated(newOrder);
      onClearCart();
      setIsSubmitting(false);
      onClose();
      onNavigateToTracker(orderCode);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              {isCheckoutMode ? 'Thông Tin Giao Hàng & Thanh Toán' : `Giỏ Hàng Linh Kiện (${cartItems.length})`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Giỏ hàng của bạn đang trống</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Khám phá kho linh kiện xe điện chuẩn kỹ thuật để thêm sản phẩm vào giỏ.
              </p>
            </div>
          ) : !isCheckoutMode ? (
            /* Items List in Cart */
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div 
                  key={item.part.id}
                  className="p-3 rounded-xl border border-slate-200 flex gap-3 bg-slate-50/50"
                >
                  <img
                    src={item.part.image}
                    alt={item.part.name}
                    className="w-16 h-16 rounded-lg object-cover bg-white border border-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {item.part.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {item.part.sku}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-xs font-bold text-slate-900 tabular-nums">
                        {formatPrice(item.part.price)}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-md bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.part.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 rounded-l"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.part.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 rounded-r"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.part.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Xoá linh kiện"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Checkout Form */
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Họ và tên người nhận *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Số điện thoại nhận hàng *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0912 xxx xxx"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tỉnh / Thành phố
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Quận / Huyện
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Quận Cầu Giấy"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Địa chỉ chi tiết (Số nhà, ngõ ngách, toà nhà) *
                </label>
                <input
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Số 25 ngõ 120 Hoàng Quốc Việt"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ghi chú giao hàng
                </label>
                <input
                  type="text"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Giao giờ hành chính, gọi trước khi đến..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              {/* VoltPoints Loyalty Points Redemption */}
              {loyaltyPoints > 0 && (
                <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-xs text-amber-950">Dùng điểm thưởng VoltPoints</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={usePoints} 
                        onChange={(e) => {
                          setUsePoints(e.target.checked);
                          if (e.target.checked && pointsToRedeem === 0 && loyaltyPoints > 0) {
                            setPointsToRedeem(Math.min(loyaltyPoints, 50));
                          }
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  <div className="text-[11px] text-amber-900 flex items-center justify-between">
                    <span>Số dư của bạn: <strong className="font-bold text-amber-950">{loyaltyPoints} điểm</strong></span>
                    <span className="text-slate-500">1 điểm = 1.000đ</span>
                  </div>

                  {usePoints && (
                    <div className="space-y-2 pt-2 border-t border-amber-200/60">
                      <div className="text-[11px] text-amber-800 font-medium">Chọn mức điểm đổi giảm giá:</div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[50, 100, 200].map((preset) => {
                          const isSelectable = loyaltyPoints >= preset && preset * 1000 <= subtotal * 0.5;
                          return (
                            <button
                              key={preset}
                              type="button"
                              disabled={!isSelectable}
                              onClick={() => setPointsToRedeem(preset)}
                              className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                                pointsToRedeem === preset && isSelectable
                                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                                  : isSelectable
                                  ? 'bg-white text-slate-800 border-amber-200 hover:bg-amber-100'
                                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                              }`}
                            >
                              -{preset}đ ({formatPrice(preset * 1000)})
                            </button>
                          );
                        })}
                      </div>

                      {maxRedeemablePoints > 0 && (
                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => setPointsToRedeem(maxRedeemablePoints)}
                            className="text-[11px] font-medium text-amber-800 hover:text-amber-950 underline cursor-pointer"
                          >
                            Đổi tối đa ({maxRedeemablePoints} điểm)
                          </button>
                          <span className="text-[11px] text-emerald-700 font-bold">
                            Giảm {formatPrice(effectivePointsToRedeem * 1000)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Payment Methods */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  Phương thức thanh toán
                </label>
                <div className="space-y-2">
                  <div
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'vietqr' ? 'border-emerald-600 bg-emerald-50/40 font-semibold' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span>Chuyển khoản VietQR 24/7 (Quét mã tức thì)</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Khuyên dùng</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-50/40 font-semibold' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-slate-600" />
                      <span>Thanh toán tiền mặt khi nhận hàng (COD)</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('momo')}
                    className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'momo' ? 'border-emerald-600 bg-emerald-50/40 font-semibold' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-rose-500" />
                      <span>Ví điện tử MoMo</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

        </div>

        {/* Drawer Footer Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Tạm tính linh kiện:</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển chuyên dụng:</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {shippingFee === 0 ? <span className="text-emerald-600">Miễn phí</span> : formatPrice(shippingFee)}
                </span>
              </div>
              {discountFromPoints > 0 && (
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    <span>Giảm trừ điểm ({effectivePointsToRedeem}đ):</span>
                  </span>
                  <span className="tabular-nums">-{formatPrice(discountFromPoints)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>Tổng thanh toán:</span>
                <span className="text-emerald-700 text-base tabular-nums">{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 font-medium">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tích luỹ sau khi nhận hàng:</span>
                </span>
                <span className="font-bold">+{pointsEarned} VoltPoints</span>
              </div>
            </div>

            {!isCheckoutMode ? (
              <button
                onClick={() => setIsCheckoutMode(true)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Tiến hành đặt hàng ({formatPrice(total)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutMode(false)}
                  className="w-1/3 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? 'Đang tạo đơn...' : 'Xác nhận mua linh kiện'}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
