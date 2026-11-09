import { Partner, SparePart, Booking, Order, Review, NotificationItem } from '../types';

export const INITIAL_PARTNERS: Partner[] = [
  {
    id: 'partner-1',
    name: 'VoltMaster EV Service Center Cầu Giấy',
    type: 'both',
    ownerName: 'Nguyễn Văn Hùng (Kỹ sư EV)',
    phone: '0988 123 456',
    email: 'hung.voltmaster@voltfix.vn',
    address: 'Số 136 Xuân Thuỷ, Phường Dịch Vọng Hậu',
    district: 'Cầu Giấy',
    city: 'Hà Nội',
    lat: 21.0362,
    lng: 105.7891,
    rating: 4.9,
    reviewsCount: 142,
    is24_7Rescue: true,
    fastBatterySwap: true,
    verified: true,
    status: 'active',
    heroImage: '/src/assets/images/ev_hero_service_hub_1794145376515.jpg',
    servicesOffered: [
      'Cứu hộ lưu động 24/7',
      'Độ & đóng pin Lithium LiFePO4',
      'Bảo dưỡng định kỳ xe VinFast & Dat Bike',
      'Cân chỉnh phanh ABS & phục hồi giảm xóc',
      'Nâng cấp IC Votol / FarDriver'
    ],
    compatibleBrands: ['VinFast (Klara, Theon, Feliz, Evo200)', 'Dat Bike (Weaver, Quantum)', 'Yadea', 'Pega'],
    openHours: '07:30 - 21:30 (Cứu hộ trực 24/7)',
    joinedDate: '2024-03-15'
  },
  {
    id: 'partner-2',
    name: 'GreenSpeed EV Garage Đống Đa',
    type: 'repair_shop',
    ownerName: 'Trần Minh Đức',
    phone: '0912 345 678',
    email: 'duc.greenspeed@gmail.com',
    address: 'Số 88 Thái Hà, Phường Trung Liệt',
    district: 'Đống Đa',
    city: 'Hà Nội',
    lat: 21.0142,
    lng: 105.8193,
    rating: 4.8,
    reviewsCount: 98,
    is24_7Rescue: true,
    fastBatterySwap: false,
    verified: true,
    status: 'active',
    heroImage: '/src/assets/images/ev_hero_service_hub_1794145376515.jpg',
    servicesOffered: [
      'Bảo dưỡng hệ thống điện & phanh',
      'Thay thế tay ga cảm biến Hall & công tắc',
      'Cứu hộ khẩn cấp nội thành',
      'Xử lý xe ngập nước / chập đường dây'
    ],
    compatibleBrands: ['VinFast', 'Yadea', 'Dibao', 'Gogoro', 'Aima'],
    openHours: '08:00 - 20:00 (Cứu hộ trực 24/7)',
    joinedDate: '2024-06-20'
  },
  {
    id: 'partner-3',
    name: 'Tổng Kho Linh Kiện EV Sài Gòn Q1',
    type: 'parts_hub',
    ownerName: 'Lê Hoàng Long',
    phone: '0903 889 999',
    email: 'long.evsaigon@parts.vn',
    address: 'Số 45 Trần Hưng Đạo, Phường Cầu Ông Lãnh',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    lat: 10.7681,
    lng: 106.6942,
    rating: 5.0,
    reviewsCount: 215,
    is24_7Rescue: false,
    fastBatterySwap: true,
    verified: true,
    status: 'active',
    heroImage: '/src/assets/images/ev_battery_parts_1794145376845.jpg',
    servicesOffered: [
      'Phân phối sỉ & lẻ pin Lithium EVE/CATL',
      'Đại lý IC điều tốc Votol & FarDriver chính hãng',
      'Sạc nhanh thông minh chống cháy nổ',
      'Giao hoả tốc linh kiện trong 2 giờ'
    ],
    compatibleBrands: ['Tất cả dòng xe điện phổ thông', 'VinFast', 'Dat Bike', 'Yadea', 'Xe máy điện độ'],
    openHours: '08:00 - 18:30 (Thứ 2 - Thứ 7)',
    joinedDate: '2023-11-10'
  },
  {
    id: 'partner-4',
    name: 'Đại Lý Linh Kiện & Cứu Hộ EV Thủ Đức',
    type: 'both',
    ownerName: 'Vũ Quốc Khánh',
    phone: '0977 654 321',
    email: 'khanh.thuducev@gmail.com',
    address: 'Số 215 Võ Văn Ngân, Phường Linh Chiểu',
    district: 'TP. Thủ Đức',
    city: 'TP. Hồ Chí Minh',
    lat: 10.8524,
    lng: 106.7645,
    rating: 4.7,
    reviewsCount: 76,
    is24_7Rescue: true,
    fastBatterySwap: true,
    verified: true,
    status: 'active',
    heroImage: '/src/assets/images/ev_motor_controller_1794145377334.jpg',
    servicesOffered: [
      'Cứu hộ 24/7 khu vực phía Đông Sài Gòn',
      'Cung cấp phụ tùng thay thế nhanh',
      'Đo kiểm tra dung lượng SOH của bình/pin',
      'Lắp đặt định vị chống trộm GPS EV'
    ],
    compatibleBrands: ['VinFast', 'Dat Bike', 'Pega', 'Yadea'],
    openHours: '07:00 - 22:00',
    joinedDate: '2024-01-05'
  },
  {
    id: 'partner-5',
    name: 'FastVolt EV Service Hải Châu',
    type: 'repair_shop',
    ownerName: 'Phạm Thanh Bình',
    phone: '0935 112 233',
    email: 'binh.fastvolt@danang-ev.vn',
    address: 'Số 182 Bạch Đằng, Phường Phước Ninh',
    district: 'Hải Châu',
    city: 'Đà Nẵng',
    lat: 16.0678,
    lng: 108.2235,
    rating: 4.9,
    reviewsCount: 64,
    is24_7Rescue: true,
    fastBatterySwap: true,
    verified: true,
    status: 'active',
    heroImage: '/src/assets/images/ev_smart_charger_1794145377977.jpg',
    servicesOffered: [
      'Bảo dưỡng toàn diện xe máy điện',
      'Trạm sạc nhanh 15kW công cộng',
      'Cứu hộ khẩn cấp ven biển & nội đô',
      'Thay lốp không săm & vá nấm cao cấp'
    ],
    compatibleBrands: ['VinFast', 'Dat Bike', 'Yadea', 'Dibao'],
    openHours: '07:30 - 21:00',
    joinedDate: '2024-05-12'
  },
  {
    id: 'partner-6',
    name: 'Trung Tâm Công Nghệ Pin & EV Tây Đô',
    type: 'parts_hub',
    ownerName: 'Ngô Vĩnh Khang',
    phone: '0944 556 677',
    email: 'khang.taydoev@cantho.vn',
    address: 'Số 79 Đường 30 Tháng 4, Phường Hưng Lợi',
    district: 'Ninh Kiều',
    city: 'Cần Thơ',
    lat: 10.0245,
    lng: 105.7723,
    rating: 4.8,
    reviewsCount: 53,
    is24_7Rescue: false,
    fastBatterySwap: true,
    verified: false,
    status: 'pending_approval',
    heroImage: '/src/assets/images/ev_battery_parts_1794145376845.jpg',
    servicesOffered: [
      'Phân phối pin LiFePO4 cho khu vực ĐBSCL',
      'Sửa chữa mạch BMS thông minh kết nối Bluetooth',
      'Cung cấp sạc và cáp chuyển đổi chuẩn chống nước'
    ],
    compatibleBrands: ['VinFast', 'Pega', 'Asama', 'Xe ba gác điện'],
    openHours: '08:00 - 18:00',
    joinedDate: '2026-10-01'
  }
];

export const INITIAL_PARTS: SparePart[] = [
  {
    id: 'part-1',
    name: 'Khối Pin Lithium LiFePO4 VoltMax 72V 40Ah (Smart BMS)',
    sku: 'BAT-72V-40AH-LFP',
    category: 'battery',
    price: 11500000,
    costPrice: 8800000,
    stock: 14,
    minStockAlert: 3,
    partnerId: 'partner-3',
    partnerName: 'Tổng Kho Linh Kiện EV Sài Gòn Q1',
    compatibleModels: ['VinFast Feliz S', 'VinFast Klara S2', 'Pega S', 'Xe điện độ 72V'],
    specs: {
      'Điện áp danh định': '72V (Tối đa 84V)',
      'Dung lượng': '40Ah (2.88 kWh)',
      'Tuổi thọ chu kỳ': '3000 chu kỳ nạp xả (>8 năm)',
      'Dòng xả liên tục': '80A (Đỉnh 160A)',
      'Mạch quản lý': 'Smart BMS Daly kết nối App Bluetooth',
      'Vỏ bảo vệ': 'Hợp kim nhôm + Ron cao su IP67 chống nước'
    },
    image: '/src/assets/images/ev_battery_parts_1794145376845.jpg',
    rating: 4.9,
    reviewsCount: 38,
    soldCount: 84,
    warrantyMonths: 24,
    description: 'Khối pin Lithium-iron phosphate (LiFePO4) an toàn tuyệt đối chống cháy nổ, dòng xả cực kỳ ổn định, tích hợp màn hình LED báo dung lượng và kết nối Bluetooth giám sát từng cell pin.',
    inStock: true
  },
  {
    id: 'part-2',
    name: 'Bộ Điều Tốc Thông Minh Votol EM-150 SP (72V 160A Bus)',
    sku: 'CTRL-VOTOL-EM150',
    category: 'controller',
    price: 3850000,
    costPrice: 2900000,
    stock: 22,
    minStockAlert: 5,
    partnerId: 'partner-3',
    partnerName: 'Tổng Kho Linh Kiện EV Sài Gòn Q1',
    compatibleModels: ['VinFast Theon', 'VinFast Klara', 'Dat Bike Weaver++', 'Yadea Keeness'],
    specs: {
      'Điện áp hoạt động': '48V - 84V',
      'Dòng Phase cực đại': '350A',
      'Dòng Bus tối đa': '160A',
      'Chuẩn giao tiếp': 'CAN-Bus / USB PC Tuning',
      'Tính năng': 'Phanh tái sinh E-ABS, Cruise control, Giới hạn tốc độ theo cấp số',
      'Tản nhiệt': 'Nhôm nguyên khối phay CNC Anodized đen'
    },
    image: '/src/assets/images/ev_motor_controller_1794145377334.jpg',
    rating: 4.8,
    reviewsCount: 29,
    soldCount: 112,
    warrantyMonths: 18,
    description: 'IC điều tốc sóng Sin chuẩn FOC cao cấp nhất phân khúc xe máy điện. Khởi động êm ái không giật cục, tối ưu hoá năng lượng tiết kiệm pin tới 18%. Hỗ trợ tuning trên máy tính.',
    inStock: true
  },
  {
    id: 'part-3',
    name: 'Động Cơ Không Chổi Than QS Motor 3000W V3 Vành 12 Inch',
    sku: 'MTR-QS-3000W-V3',
    category: 'motor',
    price: 6200000,
    costPrice: 4700000,
    stock: 8,
    minStockAlert: 2,
    partnerId: 'partner-1',
    partnerName: 'VoltMaster EV Service Center Cầu Giấy',
    compatibleModels: ['VinFast Feliz', 'VinFast Klara', 'Pega Aura', 'Xe điện độ thể thao'],
    specs: {
      'Công suất danh định': '3000W (Đỉnh 6000W)',
      'Mô-men xoắn': '155 Nm',
      'Tốc độ thiết kế': '85 - 100 km/h',
      'Đường kính vành': '12 inch tương thích lốp không săm',
      'Cảm biến': 'Dual Hall Sensor dự phòng',
      'Chuẩn chống bụi nước': 'IP66'
    },
    image: '/src/assets/images/ev_motor_controller_1794145377334.jpg',
    rating: 5.0,
    reviewsCount: 19,
    soldCount: 45,
    warrantyMonths: 24,
    description: 'Động cơ BLDC Hub-motor chính hãng QS Motor danh tiếng, dây đồng nguyên chất quấn máy chịu nhiệt độ cao 200°C. Cảm ứng từ tính mạnh mẽ cho gia tốc vượt trội khi leo dốc.',
    inStock: true
  },
  {
    id: 'part-4',
    name: 'Bộ Sạc Nhanh Thông Minh VoltCharge X1 72V 15A (Màn hình LED)',
    sku: 'CHG-VOLT-X1-15A',
    category: 'charger',
    price: 2450000,
    costPrice: 1750000,
    stock: 35,
    minStockAlert: 5,
    partnerId: 'partner-4',
    partnerName: 'Đại Lý Linh Kiện & Cứu Hộ EV Thủ Đức',
    compatibleModels: ['Tất cả pin LiFePO4 & Li-ion hệ 72V (20S/24S)'],
    specs: {
      'Điện áp sạc': '84.0V / 87.6V tự nhận diện',
      'Dòng sạc tối đa': '15A (Rút ngắn thời gian sạc còn 2.5 giờ)',
      'Bảo vệ': 'Chống ngược cực, quá áp, quá nhiệt, tự ngắt 100%',
      'Cổng cắm': 'Chuẩn Chogori 3 chân chống nước',
      'Quạt tản nhiệt': 'Quạt bi êm ái Smart Fan điều tốc theo tải nhiệt'
    },
    image: '/src/assets/images/ev_smart_charger_1794145377977.jpg',
    rating: 4.9,
    reviewsCount: 62,
    soldCount: 190,
    warrantyMonths: 12,
    description: 'Sạc nhanh thế hệ mới cho xe máy điện. Hiệu suất chuyển đổi 94%, tự động giảm dòng ở giai đoạn sạc nhỏ giọt để bảo vệ tuổi thọ cell pin lâu dài.',
    inStock: true
  },
  {
    id: 'part-5',
    name: 'Bộ Phanh Đĩa Thuỷ Lực Kép E-ABS Chuyên Dụng Xe Điện',
    sku: 'BRK-EABS-DUAL',
    category: 'brake_suspension',
    price: 1850000,
    costPrice: 1250000,
    stock: 19,
    minStockAlert: 4,
    partnerId: 'partner-1',
    partnerName: 'VoltMaster EV Service Center Cầu Giấy',
    compatibleModels: ['VinFast Evo200', 'VinFast Feliz', 'Yadea G5', 'Dat Bike Quantum'],
    specs: {
      'Hệ thống': 'Heo dầu 2 piston đối xứng + Dây dầu bọc thép bấm đầu',
      'Cảm biến': 'Công tắc ngắt điện motor tích hợp cùm tay phanh',
      'Đĩa phanh': 'Thép không gỉ tản nhiệt đường kính 220mm',
      'Dầu phanh': 'DOT 4 chuyên dụng chịu nhiệt'
    },
    image: '/src/assets/images/ev_hero_service_hub_1794145376515.jpg',
    rating: 4.7,
    reviewsCount: 15,
    soldCount: 68,
    warrantyMonths: 12,
    description: 'Cụm phanh an toàn cao cấp giúp dừng xe gấp mà không trượt bánh, ngắt điện động cơ lập tức khi bóp phanh để tái sinh năng lượng hồi điện cho bình.',
    inStock: true
  },
  {
    id: 'part-6',
    name: 'Cặp Lốp Không Săm Chống Đinh Michelin City Extra EV (100/80-12)',
    sku: 'TIRE-MICH-EV12',
    category: 'tire_wheel',
    price: 1650000,
    costPrice: 1300000,
    stock: 2, // Low stock on purpose for testing!
    minStockAlert: 5,
    partnerId: 'partner-1',
    partnerName: 'VoltMaster EV Service Center Cầu Giấy',
    compatibleModels: ['VinFast Klara', 'VinFast Feliz', 'Yadea', 'Vespa Elettrica'],
    specs: {
      'Kích thước': '100/80-12 và 110/80-12',
      'Công nghệ': 'Water Sipe Technology rãnh gai thoát nước tốt',
      'Kháng lăn': 'Giảm lực cản lăn 12% giúp tăng quãng đường đi pin'
    },
    image: '/src/assets/images/ev_hero_service_hub_1794145376515.jpg',
    rating: 4.9,
    reviewsCount: 44,
    soldCount: 120,
    warrantyMonths: 6,
    description: 'Dòng lốp thiết kế tối ưu hoá cho xe điện chịu tải trọng pin nặng, bám đường cực chắc trong điều kiện trời mưa trơn trượt.',
    inStock: true
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'booking-101',
    bookingCode: 'EV-BK-20261108-01',
    customerName: 'Nguyễn Tiến Dũng',
    customerPhone: '0912 888 777',
    vehicleBrand: 'VinFast',
    vehicleModel: 'VinFast Theon S',
    licensePlate: '29-B1 989.88',
    serviceType: 'battery_upgrade',
    serviceName: 'Độ & Nâng cấp khối Pin Lithium 72V dung lượng cao',
    description: 'Xe đi được 3 năm pin chai chỉ còn 40km/lần sạc. Muốn nâng cấp lên pin Lithium 72V 40Ah để chạy được >110km.',
    isRescue: false,
    preferredDate: '2026-11-09',
    preferredTime: '09:00',
    partnerId: 'partner-1',
    partnerName: 'VoltMaster EV Service Center Cầu Giấy',
    status: 'quote_sent',
    timeline: [
      {
        status: 'pending',
        title: 'Đã nhận lịch hẹn qua VoltFix',
        time: '08:15 08/11/2026',
        note: 'Khách hàng đặt hẹn bảo dưỡng pin trực tuyến.'
      },
      {
        status: 'diagnosing',
        title: 'Kỹ thuật viên đo kiểm SOH cell pin',
        time: '09:30 08/11/2026',
        note: 'Đo điện áp độ lệch 0.4V giữa các chuỗi cell, cell số 6 bị sụt áp nhanh.'
      },
      {
        status: 'quote_sent',
        title: 'Đã gửi báo giá chi tiết linh kiện',
        time: '10:00 08/11/2026',
        note: 'Báo giá khối pin VoltMax 72V 40Ah + công lắp đặt & cân chỉnh BMS.'
      }
    ],
    quoteAmount: 11900000,
    quoteParts: [
      { name: 'Khối Pin Lithium LiFePO4 VoltMax 72V 40Ah', quantity: 1, price: 11500000 },
      { name: 'Công cân bằng cell & lắp đặt giắc chống cháy', quantity: 1, price: 400000 }
    ],
    createdAt: '2026-11-08 08:15',
    technicianNote: 'Khung pin Theon vừa khít kích thước khối pin LiFePO4 40Ah, không cần cắt gọt cốp xe.',
    estimatedCompletion: '16:00 09/11/2026'
  },
  {
    id: 'booking-102',
    bookingCode: 'EV-RESCUE-20261108-02',
    customerName: 'Lê Thuỳ Linh',
    customerPhone: '0983 456 789',
    vehicleBrand: 'Dat Bike',
    vehicleModel: 'Dat Bike Weaver++',
    licensePlate: '59-S2 678.90',
    serviceType: 'emergency_rescue',
    serviceName: 'Cứu hộ khẩn cấp tại chỗ 24/7 (Xe chết máy giữa đường)',
    description: 'Xe đang đi trên đường Võ Văn Ngân thì bị tắt ngúm màn hình, tay ga không phản hồi, báo lỗi mã Error 04.',
    isRescue: true,
    address: 'Cổng ĐH Sư Phạm Kỹ Thuật TP.HCM, Võ Văn Ngân, Thủ Đức',
    preferredDate: '2026-11-08',
    preferredTime: 'Cứu hộ khẩn cấp ngay',
    partnerId: 'partner-4',
    partnerName: 'Đại Lý Linh Kiện & Cứu Hộ EV Thủ Đức',
    status: 'repairing',
    timeline: [
      {
        status: 'pending',
        title: 'Yêu cầu cứu hộ khẩn cấp tiếp nhận',
        time: '10:20 08/11/2026',
        note: 'Hệ thống định vị vị trí khách cách tiệm 1.8km.'
      },
      {
        status: 'diagnosing',
        title: 'Đội cứu hộ có mặt tại hiện trường',
        time: '10:35 08/11/2026',
        note: 'Kỹ thuật viên kiểm tra lỗi giắc cắm tín hiệu tay ga và cầu chì DC-DC.'
      },
      {
        status: 'quote_approved',
        title: 'Khách hàng đồng ý thay cụm cầu chì an toàn',
        time: '10:40 08/11/2026'
      },
      {
        status: 'repairing',
        title: 'Đang tiến hành thay thế & kiểm tra tải',
        time: '10:45 08/11/2026',
        note: 'Đang đấu nối giắc chống nước mới và test ga trên chân chống giữa.'
      }
    ],
    quoteAmount: 350000,
    quoteParts: [
      { name: 'Cụm cầu chì tự ngắt DC 100A & Giắc cắm chịu nhiệt', quantity: 1, price: 150000 },
      { name: 'Phí cứu hộ lưu động bán kính < 3km', quantity: 1, price: 200000 }
    ],
    createdAt: '2026-11-08 10:20',
    technicianNote: 'Kỹ thuật viên Nguyễn Hoàng đang xử lý trực tiếp.',
    estimatedCompletion: '11:15 08/11/2026'
  },
  {
    id: 'booking-103',
    bookingCode: 'EV-BK-20261107-99',
    customerName: 'Hoàng Minh Tuấn',
    customerPhone: '0904 999 111',
    vehicleBrand: 'VinFast',
    vehicleModel: 'VinFast Feliz S',
    licensePlate: '30-F4 123.45',
    serviceType: 'periodic_maintenance',
    serviceName: 'Bảo dưỡng định kỳ 10.000 km & Tra mỡ vòng bi',
    description: 'Bảo dưỡng tổng thể trước chuyến đi xa, kiểm tra má phanh, cổ phốt và nâng cấp firmware xe.',
    isRescue: false,
    preferredDate: '2026-11-07',
    preferredTime: '14:00',
    partnerId: 'partner-1',
    partnerName: 'VoltMaster EV Service Center Cầu Giấy',
    status: 'completed',
    timeline: [
      { status: 'pending', title: 'Tiếp nhận xe', time: '14:00 07/11/2026' },
      { status: 'diagnosing', title: 'Kiểm tra 18 hạng mục kỹ thuật', time: '14:20 07/11/2026' },
      { status: 'quote_approved', title: 'Duyệt bảo dưỡng', time: '14:35 07/11/2026' },
      { status: 'repairing', title: 'Vệ sinh & bôi trơn', time: '15:00 07/11/2026' },
      { status: 'safety_testing', title: 'Kiểm tra thắng & đèn', time: '15:45 07/11/2026' },
      { status: 'completed', title: 'Bàn giao xe hoàn tất', time: '16:15 07/11/2026', note: 'Xe chạy êm, phanh nhạy, ắc quy phụ hoạt động tốt.' }
    ],
    quoteAmount: 250000,
    quoteParts: [
      { name: 'Gói bảo dưỡng xe máy điện 18 điểm an toàn', quantity: 1, price: 200000 },
      { name: 'Mỡ bôi trơn bạc đạn cao cấp', quantity: 1, price: 50000 }
    ],
    createdAt: '2026-11-07 14:00',
    technicianNote: 'Đã hoàn tất thanh toán. Khách hàng rất hài lòng.'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'order-201',
    orderCode: 'VF-ORD-88231',
    customerName: 'Đặng Quốc Huy',
    customerPhone: '0978 999 888',
    customerAddress: 'Toà nhà Golden Palm, 21 Lê Văn Lương, Nhân Chính',
    city: 'Hà Nội',
    district: 'Thanh Xuân',
    note: 'Giao giờ hành chính, gọi trước 15 phút',
    items: [
      {
        partId: 'part-4',
        partName: 'Bộ Sạc Nhanh Thông Minh VoltCharge X1 72V 15A (Màn hình LED)',
        price: 2450000,
        quantity: 1,
        image: '/src/assets/images/ev_smart_charger_1794145377977.jpg',
        partnerId: 'partner-4'
      }
    ],
    subtotal: 2450000,
    shippingFee: 35000,
    total: 2485000,
    paymentMethod: 'vietqr',
    paymentStatus: 'paid',
    status: 'shipping',
    trackingTimeline: [
      {
        status: 'pending',
        title: 'Đơn hàng đã được tạo',
        time: '08:00 08/11/2026',
        description: 'Khách hàng thanh toán qua VietQR thành công'
      },
      {
        status: 'confirmed',
        title: 'Trung tâm linh kiện đã đóng gói',
        time: '09:15 08/11/2026',
        description: 'Kiểm tra tem bảo hành & phụ kiện sạc đầy đủ'
      },
      {
        status: 'shipping',
        title: 'Đang vận chuyển hoả tốc',
        time: '10:30 08/11/2026',
        description: 'Shipper chuyên chở linh kiện xe điện đang giao tới khách hàng'
      }
    ],
    createdAt: '2026-11-08 08:00'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    targetType: 'partner',
    targetId: 'partner-1',
    targetName: 'VoltMaster EV Service Center Cầu Giấy',
    userName: 'Anh Vũ Hoàng',
    userPhoneMasked: '0982***331',
    rating: 5,
    comment: 'Cứu hộ đêm khuya cực kỳ nhanh! Xe mình bị đứt dây ga lúc 10h đêm ở Cầu Giấy, gọi điện 15 phút sau anh thợ đã mang đồ nghề tới sửa tại chỗ, giá lại rất minh bạch.',
    serviceOrPart: 'Cứu hộ khẩn cấp 24/7',
    createdAt: '06/11/2026',
    partnerReply: 'Cảm ơn anh Hoàng đã tin tưởng dịch vụ cứu hộ của VoltMaster EV! Chúc anh vạn dặm bình an.',
    partnerReplyDate: '07/11/2026'
  },
  {
    id: 'rev-2',
    targetType: 'part',
    targetId: 'part-1',
    targetName: 'Khối Pin Lithium LiFePO4 VoltMax 72V 40Ah',
    userName: 'Chị Mai Lan',
    userPhoneMasked: '0915***672',
    rating: 5,
    comment: 'Lên khối pin này cho chiếc Klara chạy phê thật sự, tăng tốc ngọt ngào không bị tụt volt như ắc quy chì cũ. Quản lý app Bluetooth xem nhiệt độ cell rất tiện.',
    serviceOrPart: 'Linh kiện độ pin Lithium',
    createdAt: '03/11/2026',
    partnerReply: 'VoltFix và Tổng kho Q1 rất vui vì chị Lan ưng ý. Pin được bảo hành 24 tháng chính hãng ạ!',
    partnerReplyDate: '04/11/2026'
  },
  {
    id: 'rev-3',
    targetType: 'partner',
    targetId: 'partner-2',
    targetName: 'GreenSpeed EV Garage Đống Đa',
    userName: 'Phan Nhật Minh',
    userPhoneMasked: '0936***909',
    rating: 4,
    comment: 'Thợ tay nghề chuẩn, có máy chẩn đoán lỗi chuyên biệt cắm vào xe hiển thị ngay. Tiệm hơi đông nên phải chờ tầm 20 phút.',
    serviceOrPart: 'Bảo dưỡng định kỳ',
    createdAt: '01/11/2026'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'booking',
    title: 'Tiến độ sửa xe cập nhật mới',
    message: 'Lịch hẹn EV-BK-20261108-01 của bạn đã được kỹ thuật viên gửi bảng báo giá linh kiện.',
    timestamp: '10:00 08/11/2026',
    read: false,
    roleTarget: 'user'
  },
  {
    id: 'notif-2',
    type: 'booking',
    title: 'Có lịch cứu hộ khẩn cấp mới!',
    message: 'Khách hàng yêu cầu cứu hộ xe Dat Bike Weaver++ tại đường Võ Văn Ngân, Thủ Đức.',
    timestamp: '10:20 08/11/2026',
    read: false,
    roleTarget: 'partner'
  },
  {
    id: 'notif-3',
    type: 'inventory',
    title: 'Cảnh báo tồn kho thấp',
    message: 'Linh kiện "Cặp Lốp Không Săm Michelin City Extra EV" chỉ còn 2 bộ trong kho.',
    timestamp: '09:00 08/11/2026',
    read: false,
    roleTarget: 'partner'
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Hồ sơ đối tác mới chờ duyệt',
    message: 'Trung Tâm Công Nghệ Pin & EV Tây Đô vừa gửi hồ sơ đăng ký mạng lưới.',
    timestamp: '08:00 08/11/2026',
    read: true,
    roleTarget: 'system_admin'
  }
];

export const INITIAL_LOYALTY_POINTS = 280;

export const INITIAL_LOYALTY_HISTORY: import('../types').LoyaltyTransaction[] = [
  {
    id: 'tx-1',
    type: 'earned',
    amount: 150,
    balanceAfter: 150,
    description: 'Thưởng hoàn tất cứu hộ ắc quy tại VoltMaster EV Cầu Giấy',
    timestamp: '09:30 02/11/2026',
    referenceCode: 'VF-BK-10492'
  },
  {
    id: 'tx-2',
    type: 'earned',
    amount: 180,
    balanceAfter: 330,
    description: 'Tích điểm đơn hàng linh kiện bộ sạc thông minh Smart Charger',
    timestamp: '14:20 04/11/2026',
    referenceCode: 'VF-ORD-88219'
  },
  {
    id: 'tx-3',
    type: 'redeemed',
    amount: 50,
    balanceAfter: 280,
    description: 'Đổi voucher giảm 50.000đ khi mua dây cu-roa Bando EV',
    timestamp: '16:45 06/11/2026',
    referenceCode: 'VF-ORD-91204'
  }
];

export const DEFAULT_LOYALTY_REWARDS: import('../types').LoyaltyReward[] = [
  {
    id: 'rew-1',
    pointsRequired: 50,
    discountValue: 50000,
    title: 'Voucher Giảm 50.000 VNĐ',
    description: 'Áp dụng cho mọi đơn mua linh kiện hoặc hoá đơn sửa chữa từ 200.000đ tại các đối tác.',
    category: 'all',
    badge: 'Phổ biến'
  },
  {
    id: 'rew-2',
    pointsRequired: 100,
    discountValue: 100000,
    title: 'Voucher Cứu Hộ & Công Thợ 100.000 VNĐ',
    description: 'Khấu trừ trực tiếp tiền công thợ cứu hộ khẩn cấp hoặc bảo dưỡng toàn diện 18 hạng mục.',
    category: 'service',
    badge: 'Tiết kiệm'
  },
  {
    id: 'rew-3',
    pointsRequired: 200,
    discountValue: 200000,
    title: 'Voucher Nâng Cấp Pin EV 200.000 VNĐ',
    description: 'Giảm ngay 200.000đ khi độ pin Lithium LiFePO4 hoặc thay cụm IC Votol điều tốc.',
    category: 'service',
    badge: 'Đặc quyền EV'
  },
  {
    id: 'rew-4',
    pointsRequired: 300,
    discountValue: 300000,
    title: 'Voucher Phụ Tùng Cao Cấp 300.000 VNĐ',
    description: 'Dành riêng cho đơn hàng phụ tùng xe điện có giá trị từ 2.000.000đ trở lên.',
    category: 'parts',
    badge: 'VIP Club'
  }
];

// Helper functions for persistent state management
const STORAGE_KEYS = {
  PARTNERS: 'voltfix_partners_data',
  PARTS: 'voltfix_parts_data',
  BOOKINGS: 'voltfix_bookings_data',
  ORDERS: 'voltfix_orders_data',
  REVIEWS: 'voltfix_reviews_data',
  NOTIFICATIONS: 'voltfix_notifications_data',
  LOYALTY_POINTS: 'voltfix_loyalty_points',
  LOYALTY_HISTORY: 'voltfix_loyalty_history'
};

export function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

export { STORAGE_KEYS };
