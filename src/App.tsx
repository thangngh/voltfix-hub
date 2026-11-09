/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  Partner, 
  SparePart, 
  Booking, 
  Order, 
  Review, 
  NotificationItem, 
  CartItem, 
  BookingStatus,
  LoyaltyTransaction,
  LoyaltyReward
} from './types';
import { 
  INITIAL_PARTNERS, 
  INITIAL_PARTS, 
  INITIAL_BOOKINGS, 
  INITIAL_ORDERS, 
  INITIAL_REVIEWS, 
  INITIAL_NOTIFICATIONS,
  INITIAL_LOYALTY_POINTS,
  INITIAL_LOYALTY_HISTORY,
  STORAGE_KEYS,
  getStoredData,
  setStoredData
} from './data/mockData';

import { RoleSwitcher } from './components/RoleSwitcher';
import { Navbar } from './components/Navbar';
import { DigitalMap } from './components/DigitalMap';
import { BookingModule } from './components/BookingModule';
import { PartsStore } from './components/PartsStore';
import { CartDrawer } from './components/CartDrawer';
import { RealTimeTracker } from './components/RealTimeTracker';
import { PartnerPortal } from './components/PartnerPortal';
import { AdminPortal } from './components/AdminPortal';
import { ReviewsSection } from './components/ReviewsSection';
import { ReviewModal } from './components/ReviewModal';
import { NotificationCenter } from './components/NotificationCenter';
import { LoyaltyPointsModal } from './components/LoyaltyPointsModal';

import { Zap, ShieldCheck, HeartHandshake, PhoneCall, Coins, Sparkles, Gift } from 'lucide-react';

export default function App() {
  // 1. Roles & Navigation State
  const [currentRole, setCurrentRole] = useState<UserRole>('user');
  const [currentTab, setCurrentTab] = useState<string>('map');
  const [activeTrackerCode, setActiveTrackerCode] = useState<string>('');

  // 2. Persistent Domain State
  const [partners, setPartners] = useState<Partner[]>(() => 
    getStoredData<Partner[]>(STORAGE_KEYS.PARTNERS, INITIAL_PARTNERS)
  );
  const [parts, setParts] = useState<SparePart[]>(() => 
    getStoredData<SparePart[]>(STORAGE_KEYS.PARTS, INITIAL_PARTS)
  );
  const [bookings, setBookings] = useState<Booking[]>(() => 
    getStoredData<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS)
  );
  const [orders, setOrders] = useState<Order[]>(() => 
    getStoredData<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );
  const [reviews, setReviews] = useState<Review[]>(() => 
    getStoredData<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => 
    getStoredData<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );

  // 2.1 User Loyalty Points System State
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => 
    getStoredData<number>(STORAGE_KEYS.LOYALTY_POINTS, INITIAL_LOYALTY_POINTS)
  );
  const [loyaltyHistory, setLoyaltyHistory] = useState<LoyaltyTransaction[]>(() => 
    getStoredData<LoyaltyTransaction[]>(STORAGE_KEYS.LOYALTY_HISTORY, INITIAL_LOYALTY_HISTORY)
  );
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState<boolean>(false);

  // 3. Cart & Modals State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [selectedPartnerForBooking, setSelectedPartnerForBooking] = useState<Partner | null>(null);
  const [selectedPartnerFilterForParts, setSelectedPartnerFilterForParts] = useState<string | null>(null);

  // Active Partner for Partner Portal view
  const [activePartnerStore, setActivePartnerStore] = useState<Partner>(partners[0] || INITIAL_PARTNERS[0]);

  // Review modal state
  const [reviewModalState, setReviewModalState] = useState<{
    isOpen: boolean;
    targetType: 'partner' | 'part';
    targetId: string;
    targetName: string;
  }>({
    isOpen: false,
    targetType: 'partner',
    targetId: '',
    targetName: ''
  });

  // Real-time toast feedback
  const [activeToast, setActiveToast] = useState<{ title: string; message: string } | null>(null);

  const showToast = (title: string, message: string) => {
    setActiveToast({ title, message });
    setTimeout(() => {
      setActiveToast(null);
    }, 4500);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    setStoredData(STORAGE_KEYS.PARTNERS, partners);
  }, [partners]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.PARTS, parts);
  }, [parts]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.BOOKINGS, bookings);
  }, [bookings]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.REVIEWS, reviews);
  }, [reviews]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.LOYALTY_POINTS, loyaltyPoints);
  }, [loyaltyPoints]);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.LOYALTY_HISTORY, loyaltyHistory);
  }, [loyaltyHistory]);

  // 4. Cart Handlers
  const handleAddToCart = (part: SparePart, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.part.id === part.id);
      if (existing) {
        return prev.map(item => 
          item.part.id === part.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { part, quantity }];
    });
    showToast('Đã thêm vào giỏ', `${quantity}x ${part.name}`);
  };

  const handleUpdateCartQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(partId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.part.id === partId ? { ...item, quantity } : item
    ));
  };

  const handleRemoveFromCart = (partId: string) => {
    setCartItems(prev => prev.filter(item => item.part.id !== partId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // 4.1 Loyalty Points System Handlers
  const handleAddLoyaltyPoints = (amount: number, description: string, referenceCode?: string) => {
    if (amount <= 0) return;
    const now = new Date();
    const timeFormatted = `${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${now.toLocaleDateString('vi-VN')}`;

    setLoyaltyPoints(prev => {
      const newTotal = prev + amount;
      const newTx: LoyaltyTransaction = {
        id: `tx-${Date.now()}`,
        type: 'earned',
        amount,
        balanceAfter: newTotal,
        description,
        timestamp: timeFormatted,
        referenceCode
      };
      setLoyaltyHistory(h => [newTx, ...h]);
      return newTotal;
    });

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'loyalty',
      title: `🎉 Nhận được +${amount} VoltPoints!`,
      message: description,
      timestamp: timeFormatted,
      read: false,
      roleTarget: 'user',
      actionUrl: referenceCode
    };
    setNotifications(prev => [notif, ...prev]);

    showToast(`+${amount} VoltPoints`, description);
  };

  const handleRedeemLoyaltyPoints = (amount: number, description: string, referenceCode?: string): boolean => {
    if (amount <= 0 || loyaltyPoints < amount) return false;
    const now = new Date();
    const timeFormatted = `${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${now.toLocaleDateString('vi-VN')}`;

    setLoyaltyPoints(prev => {
      const newTotal = prev - amount;
      const newTx: LoyaltyTransaction = {
        id: `tx-${Date.now()}`,
        type: 'redeemed',
        amount,
        balanceAfter: newTotal,
        description,
        timestamp: timeFormatted,
        referenceCode
      };
      setLoyaltyHistory(h => [newTx, ...h]);
      return newTotal;
    });

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'loyalty',
      title: `Đã đổi -${amount} VoltPoints`,
      message: `Giảm ${new Intl.NumberFormat('vi-VN').format(amount * 1000)} VNĐ tại đối tác.`,
      timestamp: timeFormatted,
      read: false,
      roleTarget: 'user',
      actionUrl: referenceCode
    };
    setNotifications(prev => [notif, ...prev]);

    showToast(`Đã đổi -${amount} điểm`, `Giảm ${new Intl.NumberFormat('vi-VN').format(amount * 1000)} VNĐ`);
    return true;
  };

  const handleRedeemReward = (reward: LoyaltyReward) => {
    const success = handleRedeemLoyaltyPoints(
      reward.pointsRequired,
      `Đổi voucher ưu đãi "${reward.title}" giảm ${new Intl.NumberFormat('vi-VN').format(reward.discountValue)} VNĐ tại đối tác`,
      `VF-VOUCHER-${Math.floor(10000 + Math.random() * 90000)}`
    );
    if (success) {
      showToast(
        'Đổi voucher thành công!',
        `Bạn đã nhận ${reward.title}. Có thể dùng trực tiếp khi thanh toán giỏ hàng hoặc đặt lịch sửa chữa.`
      );
    } else {
      showToast('Không đủ điểm', `Bạn cần tối thiểu ${reward.pointsRequired} VoltPoints để đổi ưu đãi này.`);
    }
  };

  // 5. Booking Handlers
  const handleBookingCreated = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);

    // If customer redeemed points for this booking
    if (newBooking.pointsRedeemed && newBooking.pointsRedeemed > 0) {
      handleRedeemLoyaltyPoints(
        newBooking.pointsRedeemed,
        `Áp dụng voucher giảm ${new Intl.NumberFormat('vi-VN').format(newBooking.discountFromPoints || 0)}đ cho lịch hẹn tại ${newBooking.partnerName}`,
        newBooking.bookingCode
      );
    }

    // Create real-time notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'booking',
      title: newBooking.isRescue ? 'Yêu cầu Cứu hộ khẩn cấp 24/7!' : 'Lịch hẹn sửa chữa mới',
      message: `${newBooking.customerName} vừa đặt hẹn: ${newBooking.serviceName} (${newBooking.vehicleModel})`,
      timestamp: newBooking.createdAt,
      read: false,
      roleTarget: 'all',
      actionUrl: newBooking.bookingCode
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(
      newBooking.isRescue ? 'Tín hiệu cứu hộ đã phát!' : 'Đặt lịch thành công',
      `Mã hồ sơ: ${newBooking.bookingCode}`
    );
  };

  const handleAdvanceBookingStep = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const flow: BookingStatus[] = [
      'pending', 
      'diagnosing', 
      'quote_sent', 
      'repairing', 
      'safety_testing', 
      'completed'
    ];
    const currentIndex = flow.indexOf(booking.status as BookingStatus);
    const nextStatus = flow[Math.min(flow.length - 1, currentIndex + 1)];

    handleUpdateBookingStatus(
      bookingId, 
      nextStatus, 
      `Kỹ thuật viên đã hoàn thành bước và chuyển sang: ${nextStatus}`
    );
  };

  const handleUpdateBookingStatus = (bookingId: string, nextStatus: BookingStatus, note?: string) => {
    const now = new Date();
    const timeFormatted = `${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${now.toLocaleDateString('vi-VN')}`;

    // When service is completed, assign loyalty points to customer!
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (targetBooking && targetBooking.status !== 'completed' && nextStatus === 'completed') {
      const earnedPoints = targetBooking.pointsEarned || Math.max(100, Math.min(450, Math.round((targetBooking.quoteAmount || 1200000) / 10000)));
      handleAddLoyaltyPoints(
        earnedPoints,
        `Tích điểm hoàn tất dịch vụ "${targetBooking.serviceName}" tại ${targetBooking.partnerName}`,
        targetBooking.bookingCode
      );
    }

    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;

      const newTimeline = [...b.timeline, {
        status: nextStatus,
        title: nextStatus === 'diagnosing' ? 'Đo kiểm chẩn đoán hệ thống' :
               nextStatus === 'quote_sent' ? 'Đã gửi báo giá linh kiện' :
               nextStatus === 'repairing' ? 'Đang sửa chữa & thay thế' :
               nextStatus === 'safety_testing' ? 'Kiểm định an toàn điện' :
               nextStatus === 'completed' ? 'Hoàn tất nghiệm thu & trả xe' : 'Cập nhật tiến trình',
        time: timeFormatted,
        note
      }];

      return {
        ...b,
        status: nextStatus,
        timeline: newTimeline
      };
    }));

    // Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'booking',
      title: 'Tiến độ sửa xe cập nhật mới!',
      message: `Hồ sơ ${bookingId} vừa chuyển trạng thái sang [${nextStatus}].`,
      timestamp: timeFormatted,
      read: false,
      roleTarget: 'user',
      actionUrl: bookings.find(b => b.id === bookingId)?.bookingCode
    };
    setNotifications(prev => [notif, ...prev]);

    showToast('Đã cập nhật tiến độ thời gian thực', `Trạng thái: ${nextStatus}`);
  };

  const handleSendBookingQuote = (
    bookingId: string, 
    quoteAmount: number, 
    quoteParts: { name: string; quantity: number; price: number }[]
  ) => {
    const now = new Date();
    const timeFormatted = `${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${now.toLocaleDateString('vi-VN')}`;

    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;
      return {
        ...b,
        status: 'quote_sent',
        quoteAmount,
        quoteParts,
        timeline: [
          ...b.timeline,
          {
            status: 'quote_sent',
            title: 'Tiệm đã gửi bảng báo giá linh kiện',
            time: timeFormatted,
            note: `Tổng chi phí: ${new Intl.NumberFormat('vi-VN').format(quoteAmount)} VNĐ.`
          }
        ]
      };
    }));

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'booking',
      title: 'Có bảng báo giá linh kiện mới',
      message: `Tiệm đã gửi báo giá cho hồ sơ của bạn. Vui lòng kiểm tra và duyệt để tiếp tục.`,
      timestamp: timeFormatted,
      read: false,
      roleTarget: 'user'
    };
    setNotifications(prev => [notif, ...prev]);

    showToast('Đã gửi báo giá tới khách hàng', `${new Intl.NumberFormat('vi-VN').format(quoteAmount)} VNĐ`);
  };

  const handleApproveQuote = (bookingId: string) => {
    handleUpdateBookingStatus(
      bookingId, 
      'repairing', 
      'Khách hàng đã phê duyệt báo giá. Kỹ thuật viên bắt đầu lắp đặt linh kiện.'
    );
    showToast('Phê duyệt thành công', 'Tiệm đang bắt đầu sửa chữa xe của bạn.');
  };

  // 6. Order Handlers
  const handleOrderCreated = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);

    // Decrement stock for ordered parts
    newOrder.items.forEach(orderItem => {
      setParts(prevParts => prevParts.map(p => {
        if (p.id === orderItem.partId) {
          const updatedStock = Math.max(0, p.stock - orderItem.quantity);
          return {
            ...p,
            stock: updatedStock,
            soldCount: p.soldCount + orderItem.quantity,
            inStock: updatedStock > 0
          };
        }
        return p;
      }));
    });

    // If user redeemed points in order checkout
    if (newOrder.pointsRedeemed && newOrder.pointsRedeemed > 0) {
      handleRedeemLoyaltyPoints(
        newOrder.pointsRedeemed,
        `Khấu trừ ${newOrder.pointsRedeemed} điểm (-${new Intl.NumberFormat('vi-VN').format(newOrder.discountFromPoints || 0)}đ) cho đơn hàng ${newOrder.orderCode}`,
        newOrder.orderCode
      );
    }

    // Award loyalty points for the purchase
    const pointsFromPurchase = newOrder.pointsEarned || Math.max(20, Math.floor(newOrder.total / 20000));
    handleAddLoyaltyPoints(
      pointsFromPurchase,
      `Tích điểm hoàn tiền đơn hàng linh kiện phụ tùng ${newOrder.orderCode}`,
      newOrder.orderCode
    );

    // Create notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'order',
      title: 'Đơn mua linh kiện mới!',
      message: `Đơn ${newOrder.orderCode} trị giá ${new Intl.NumberFormat('vi-VN').format(newOrder.total)} VNĐ cần đóng gói.${newOrder.pointsRedeemed ? ` (Đã giảm ${newOrder.pointsRedeemed} điểm)` : ''}`,
      timestamp: newOrder.createdAt,
      read: false,
      roleTarget: 'partner',
      actionUrl: newOrder.orderCode
    };
    setNotifications(prev => [notif, ...prev]);

    showToast(
      'Đặt mua linh kiện thành công', 
      `Mã đơn: ${newOrder.orderCode} · Tích luỹ +${pointsFromPurchase} VoltPoints`
    );
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: Order['status'], description?: string) => {
    const now = new Date();
    const timeFormatted = `${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${now.toLocaleDateString('vi-VN')}`;

    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        status: nextStatus,
        trackingTimeline: [
          ...o.trackingTimeline,
          {
            status: nextStatus,
            title: nextStatus === 'confirmed' ? 'Đã đóng gói & xuất kho' :
                   nextStatus === 'shipping' ? 'Đang giao hoả tốc' :
                   nextStatus === 'delivered' ? 'Đã giao thành công' : 'Cập nhật',
            time: timeFormatted,
            description: description || `Trạng thái đơn hàng: ${nextStatus}`
          }
        ]
      };
    }));

    showToast('Đã cập nhật trạng thái đơn hàng', `Trạng thái: ${nextStatus}`);
  };

  // 7. Inventory Stock Handlers
  const handleUpdatePartStock = (partId: string, newStock: number) => {
    setParts(prev => prev.map(p => {
      if (p.id !== partId) return p;
      return {
        ...p,
        stock: newStock,
        inStock: newStock > 0
      };
    }));
  };

  const handleAddNewPart = (newPart: SparePart) => {
    setParts(prev => [newPart, ...prev]);
    showToast('Đã thêm linh kiện mới', newPart.name);
  };

  // 8. Admin Handlers
  const handleApprovePartner = (partnerId: string) => {
    setPartners(prev => prev.map(p => {
      if (p.id !== partnerId) return p;
      return {
        ...p,
        status: 'active',
        verified: true
      };
    }));
    showToast('Đã phê duyệt đối tác', 'Cơ sở đã chính thức hiển thị trên bản đồ số toàn quốc');
  };

  const handleToggleVerifyPartner = (partnerId: string) => {
    setPartners(prev => prev.map(p => {
      if (p.id !== partnerId) return p;
      return {
        ...p,
        verified: !p.verified
      };
    }));
  };

  const handleTogglePartnerStatus = (partnerId: string) => {
    setPartners(prev => prev.map(p => {
      if (p.id !== partnerId) return p;
      return {
        ...p,
        status: p.status === 'active' ? 'suspended' : 'active'
      };
    }));
  };

  const handleUpdatePartnerInfo = (updatedPartner: Partner) => {
    setPartners(prev => prev.map(p => p.id === updatedPartner.id ? updatedPartner : p));
    setActivePartnerStore(updatedPartner);
    showToast('Cập nhật thông tin tiệm thành công', `Thông tin của "${updatedPartner.name}" đã được lưu trên toàn hệ thống.`);
  };

  // 9. Review Handlers
  const handleOpenReviewModal = (targetType: 'partner' | 'part', targetId: string, targetName: string) => {
    setReviewModalState({
      isOpen: true,
      targetType,
      targetId,
      targetName
    });
  };

  const handleSubmitReview = (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);

    // Recalculate rating on partner if target was partner
    if (newReview.targetType === 'partner') {
      setPartners(prev => prev.map(p => {
        if (p.id !== newReview.targetId) return p;
        const currentCount = p.reviewsCount;
        const newRating = Number(((p.rating * currentCount + newReview.rating) / (currentCount + 1)).toFixed(1));
        return {
          ...p,
          rating: newRating,
          reviewsCount: currentCount + 1
        };
      }));
    }

    showToast('Đã gửi đánh giá thành công', `Cảm ơn bạn đã đóng góp cho cộng đồng!`);
  };

  const handleReplyReview = (reviewId: string, replyText: string) => {
    const today = new Date().toLocaleDateString('vi-VN');
    setReviews(prev => prev.map(r => {
      if (r.id !== reviewId) return r;
      return {
        ...r,
        partnerReply: replyText,
        partnerReplyDate: today
      };
    }));
    showToast('Đã đăng phản hồi của tiệm', 'Khách hàng có thể đọc phản hồi này công khai.');
  };

  // Navigation helpers
  const handleSelectPartnerForBooking = (partner: Partner) => {
    setSelectedPartnerForBooking(partner);
    setCurrentTab('booking');
  };

  const handleFilterPartsByPartner = (partnerId: string) => {
    setSelectedPartnerFilterForParts(partnerId);
    setCurrentTab('parts');
  };

  const handleNavigateToTracker = (code: string) => {
    setActiveTrackerCode(code);
    setCurrentTab('tracker');
  };

  const unreadNotifsCount = notifications.filter(
    n => !n.read && (n.roleTarget === 'all' || n.roleTarget === currentRole)
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      
      {/* 1. Global Role Switcher Bar */}
      <RoleSwitcher
        currentRole={currentRole}
        onRoleChange={(newRole) => {
          setCurrentRole(newRole);
          showToast(`Đã chuyển sang quyền: ${newRole.toUpperCase()}`, 'Giao diện và quyền hạn nghiệp vụ đã thay đổi tương ứng.');
        }}
        activePartnerName={activePartnerStore.name}
      />

      {/* 2. Top Navigation Bar (Zone 1 - 2 - 3) */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          // If user clicked any tab while in partner/admin view, return to user role or stay in view
          if (currentRole !== 'user' && tab !== 'partner_view') {
            setCurrentRole('user');
          }
        }}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        unreadNotifsCount={unreadNotifsCount}
        onOpenNotifs={() => setIsNotifsOpen(true)}
        currentRole={currentRole}
        onOpenBookingModal={() => {
          setSelectedPartnerForBooking(null);
          setCurrentTab('booking');
        }}
        loyaltyPoints={loyaltyPoints}
        onOpenLoyaltyModal={() => setIsLoyaltyModalOpen(true)}
      />

      {/* 3. Real-Time Floating Toast Alert */}
      {activeToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 animate-slide-up max-w-sm">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white">{activeToast.title}</div>
            <div className="text-[11px] text-slate-300 truncate">{activeToast.message}</div>
          </div>
        </div>
      )}

      {/* User Loyalty Points Banner */}
      {currentRole === 'user' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-0 w-full">
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-emerald-500/10 border border-amber-300/80 rounded-2xl p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                <Coins className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-950">Ví điểm thưởng VoltPoints:</span>
                  <span className="font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full text-[11px] tabular-nums border border-amber-300">
                    {loyaltyPoints} điểm (~{new Intl.NumberFormat('vi-VN').format(loyaltyPoints * 1000)}đ)
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Tích điểm tự động sau mỗi lần sửa xe hoặc mua linh kiện · Giảm giá trực tiếp tại tất cả tiệm đối tác
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setIsLoyaltyModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Đổi ưu đãi / Lịch sử</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Main Body Content Routed by Active Role & Tab */}
      <main className="flex-1">
        {currentRole === 'system_admin' ? (
          /* SYSTEM ADMIN VIEW */
          <AdminPortal
            partners={partners}
            parts={parts}
            bookings={bookings}
            orders={orders}
            reviews={reviews}
            onApprovePartner={handleApprovePartner}
            onToggleVerifyPartner={handleToggleVerifyPartner}
            onTogglePartnerStatus={handleTogglePartnerStatus}
          />
        ) : currentRole === 'partner' ? (
          /* PARTNER (REPAIR SHOP & PARTS HUB) VIEW */
          <PartnerPortal
            partners={partners}
            activePartner={activePartnerStore}
            onSelectPartner={setActivePartnerStore}
            parts={parts}
            bookings={bookings}
            orders={orders}
            reviews={reviews}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onSendBookingQuote={handleSendBookingQuote}
            onUpdatePartStock={handleUpdatePartStock}
            onAddNewPart={handleAddNewPart}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onReplyReview={handleReplyReview}
            onUpdatePartnerInfo={handleUpdatePartnerInfo}
          />
        ) : (
          /* USER (CUSTOMER / EV RIDER) VIEW */
          <>
            {currentTab === 'map' && (
              <DigitalMap
                partners={partners}
                onSelectPartnerForBooking={handleSelectPartnerForBooking}
                onFilterPartsByPartner={handleFilterPartsByPartner}
              />
            )}

            {currentTab === 'booking' && (
              <BookingModule
                partners={partners}
                parts={parts}
                selectedPartner={selectedPartnerForBooking}
                onBookingCreated={handleBookingCreated}
                onNavigateToTracker={handleNavigateToTracker}
                loyaltyPoints={loyaltyPoints}
              />
            )}

            {currentTab === 'parts' && (
              <PartsStore
                parts={parts}
                onAddToCart={handleAddToCart}
                selectedPartnerFilter={selectedPartnerFilterForParts}
                onClearPartnerFilter={() => setSelectedPartnerFilterForParts(null)}
                onOpenCart={() => setIsCartOpen(true)}
              />
            )}

            {currentTab === 'tracker' && (
              <RealTimeTracker
                bookings={bookings}
                orders={orders}
                activeCode={activeTrackerCode}
                onApproveQuote={handleApproveQuote}
                onAdvanceBookingStep={handleAdvanceBookingStep}
                onOpenReviewModal={handleOpenReviewModal}
              />
            )}

            {currentTab === 'reviews' && (
              <ReviewsSection
                reviews={reviews}
                partners={partners}
                onOpenReviewModal={handleOpenReviewModal}
              />
            )}
          </>
        )}
      </main>

      {/* 5. Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderCreated={handleOrderCreated}
        onNavigateToTracker={handleNavigateToTracker}
        loyaltyPoints={loyaltyPoints}
      />

      <LoyaltyPointsModal
        isOpen={isLoyaltyModalOpen}
        onClose={() => setIsLoyaltyModalOpen(false)}
        points={loyaltyPoints}
        history={loyaltyHistory}
        onRedeemReward={handleRedeemReward}
        onAddTestPoints={(amount) => handleAddLoyaltyPoints(amount, 'Cộng điểm thử nghiệm hệ sinh thái VoltPoints')}
        onNavigateToTab={(tab) => {
          setCurrentRole('user');
          setCurrentTab(tab);
        }}
      />

      <NotificationCenter
        isOpen={isNotifsOpen}
        onClose={() => setIsNotifsOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) => {
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        }}
        onMarkAllAsRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
        onNavigateToBookingOrOrder={(code) => {
          if (code) {
            handleNavigateToTracker(code);
          }
        }}
        currentRole={currentRole}
      />

      <ReviewModal
        isOpen={reviewModalState.isOpen}
        onClose={() => setReviewModalState(prev => ({ ...prev, isOpen: false }))}
        targetType={reviewModalState.targetType}
        targetId={reviewModalState.targetId}
        targetName={reviewModalState.targetName}
        onSubmitReview={handleSubmitReview}
      />

      {/* 6. Clean Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-10 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span>VoltFix Hub</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Mạng lưới liên minh kết nối các tiệm sửa xe máy điện uy tín và trung tâm kinh doanh linh kiện xe điện chuẩn kỹ thuật hàng đầu Việt Nam.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Dành Cho Khách Hàng</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => { setCurrentRole('user'); setCurrentTab('map'); }} className="hover:text-white">Bản đồ số tìm tiệm gần nhất</button></li>
              <li><button onClick={() => { setCurrentRole('user'); setCurrentTab('booking'); }} className="hover:text-white">Cứu hộ khẩn cấp 24/7</button></li>
              <li><button onClick={() => { setCurrentRole('user'); setCurrentTab('parts'); }} className="hover:text-white">Kho linh kiện pin & sạc</button></li>
              <li><button onClick={() => { setCurrentRole('user'); setCurrentTab('tracker'); }} className="hover:text-white">Tra cứu tiến độ sửa chữa</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Dành Cho Đối Tác & Kho</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => setCurrentRole('partner')} className="hover:text-white">Đăng ký trở thành Tiệm liên kết</button></li>
              <li><button onClick={() => setCurrentRole('partner')} className="hover:text-white">Phần mềm quản lý kho linh kiện</button></li>
              <li><button onClick={() => setCurrentRole('partner')} className="hover:text-white">Nhận đơn cứu hộ lưu động</button></li>
              <li><button onClick={() => setCurrentRole('system_admin')} className="hover:text-white">Cổng quản trị Admin</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Tổng Đài Trợ Giúp EV</h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">1900 8899 (Cứu hộ 24/7)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Hỗ trợ VinFast, Dat Bike, Yadea, Pega và các dòng xe điện thông minh.
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div>
            © 2026 VoltFix Hub Vietnam · Nền tảng kết nối sửa chữa và linh kiện xe điện.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Điều khoản dịch vụ</span>
            <span className="hover:text-slate-300 cursor-pointer">Quy chế bảo hành linh kiện</span>
            <span className="hover:text-slate-300 cursor-pointer">Bảo mật thông tin</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
