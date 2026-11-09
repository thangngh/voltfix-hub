export type UserRole = 'user' | 'partner' | 'system_admin';

export type PartnerType = 'repair_shop' | 'parts_hub' | 'both';

export type ServiceCategory = 
  | 'periodic_maintenance' 
  | 'emergency_rescue' 
  | 'battery_upgrade' 
  | 'motor_controller' 
  | 'brake_tire' 
  | 'electrical_diagnostic';

export type PartCategory = 
  | 'battery' 
  | 'motor' 
  | 'controller' 
  | 'charger' 
  | 'brake_suspension' 
  | 'tire_wheel' 
  | 'electrical_lighting';

export type BookingStatus = 
  | 'pending' 
  | 'diagnosing' 
  | 'quote_sent' 
  | 'quote_approved' 
  | 'repairing' 
  | 'safety_testing' 
  | 'completed' 
  | 'cancelled';

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  lat: number;
  lng: number;
  rating: number;
  reviewsCount: number;
  is24_7Rescue: boolean;
  fastBatterySwap: boolean;
  verified: boolean;
  status: 'active' | 'pending_approval' | 'suspended';
  heroImage: string;
  servicesOffered: string[];
  compatibleBrands: string[];
  openHours: string;
  joinedDate: string;
}

export interface SparePart {
  id: string;
  name: string;
  sku: string;
  category: PartCategory;
  price: number;
  costPrice: number;
  stock: number;
  minStockAlert: number;
  partnerId: string;
  partnerName: string;
  compatibleModels: string[];
  specs: Record<string, string>;
  image: string;
  rating: number;
  reviewsCount: number;
  soldCount: number;
  warrantyMonths: number;
  description: string;
  inStock: boolean;
}

export interface BookingTimelineStep {
  status: BookingStatus;
  title: string;
  time: string;
  note?: string;
}

export interface QuotePartItem {
  partId?: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Booking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  vehicleBrand: string;
  vehicleModel: string;
  licensePlate: string;
  serviceType: ServiceCategory;
  serviceName: string;
  description: string;
  isRescue: boolean;
  address?: string;
  preferredDate: string;
  preferredTime: string;
  partnerId: string;
  partnerName: string;
  status: BookingStatus;
  timeline: BookingTimelineStep[];
  quoteAmount?: number;
  quoteParts?: QuotePartItem[];
  discountFromPoints?: number;
  pointsRedeemed?: number;
  pointsEarned?: number;
  estimatedCostMin?: number;
  estimatedCostMax?: number;
  createdAt: string;
  technicianNote?: string;
  estimatedCompletion?: string;
}

export interface ServiceCostBenchmark {
  serviceId: ServiceCategory;
  name: string;
  laborMin: number;
  laborMax: number;
  partsMin: number;
  partsMax: number;
  typicalItems: string[];
  warrantyMonths: number;
  timeEstimate: string;
}

export interface CartItem {
  part: SparePart;
  quantity: number;
}

export interface OrderItem {
  partId: string;
  partName: string;
  price: number;
  quantity: number;
  image: string;
  partnerId: string;
}

export interface OrderTimelineStep {
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  title: string;
  time: string;
  description: string;
}

export interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  city: string;
  district: string;
  note?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountFromPoints?: number;
  pointsRedeemed?: number;
  pointsEarned?: number;
  total: number;
  paymentMethod: 'cod' | 'vietqr' | 'momo';
  paymentStatus: 'unpaid' | 'paid';
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  trackingTimeline: OrderTimelineStep[];
  createdAt: string;
}

export interface Review {
  id: string;
  targetType: 'partner' | 'part';
  targetId: string;
  targetName: string;
  userName: string;
  userPhoneMasked: string;
  rating: number; // 1 to 5
  comment: string;
  serviceOrPart: string;
  createdAt: string;
  partnerReply?: string;
  partnerReplyDate?: string;
}

export interface NotificationItem {
  id: string;
  type: 'booking' | 'order' | 'inventory' | 'system' | 'loyalty';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  roleTarget: 'all' | 'user' | 'partner' | 'system_admin';
  actionUrl?: string;
}

export interface LoyaltyTransaction {
  id: string;
  type: 'earned' | 'redeemed';
  amount: number;
  balanceAfter: number;
  description: string;
  timestamp: string;
  referenceCode?: string;
}

export interface LoyaltyReward {
  id: string;
  pointsRequired: number;
  discountValue: number;
  title: string;
  description: string;
  category: 'all' | 'service' | 'parts';
  badge: string;
}
