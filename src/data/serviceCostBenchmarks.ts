import { ServiceCategory, ServiceCostBenchmark } from '../types';

export const SERVICE_COST_BENCHMARKS: Record<ServiceCategory, ServiceCostBenchmark> = {
  emergency_rescue: {
    serviceId: 'emergency_rescue',
    name: 'Cứu hộ khẩn cấp 24/7 (Lưu động tại chỗ)',
    laborMin: 150000,
    laborMax: 250000,
    partsMin: 80000,
    partsMax: 200000,
    typicalItems: [
      'Phí xuất xe cứu hộ tận nơi trong bán kính 10km',
      'Đo kiểm điện áp pack pin & cầu chì chịu tải',
      'Vá nấm lốp không săm / thay giắc nguồn chịu nhiệt'
    ],
    warrantyMonths: 3,
    timeEstimate: '15 - 30 phút có mặt'
  },
  periodic_maintenance: {
    serviceId: 'periodic_maintenance',
    name: 'Bảo dưỡng định kỳ 18 hạng mục an toàn',
    laborMin: 180000,
    laborMax: 300000,
    partsMin: 60000,
    partsMax: 150000,
    typicalItems: [
      'Siết lực ốc cổ phốt & kiểm tra độ rơ chén cổ',
      'Tra mỡ bôi trơn vòng bi bánh trước/sau',
      'Vệ sinh cùm heo dầu phanh & xịt RP7 chống ẩm giắc điện'
    ],
    warrantyMonths: 6,
    timeEstimate: '45 - 60 phút'
  },
  battery_upgrade: {
    serviceId: 'battery_upgrade',
    name: 'Độ & Nâng cấp Khối Pin Lithium LiFePO4',
    laborMin: 350000,
    laborMax: 600000,
    partsMin: 4500000,
    partsMax: 8500000,
    typicalItems: [
      'Khối cell pin LiFePO4 EVE/CATL chuẩn A+ dung lượng cao',
      'Mạch thông minh Smart BMS kết nối Bluetooth quản lý cell',
      'Hộp nhôm/inox gia cố chống nước tiêu chuẩn IP67'
    ],
    warrantyMonths: 24,
    timeEstimate: '2 - 4 giờ làm việc'
  },
  motor_controller: {
    serviceId: 'motor_controller',
    name: 'Sửa chữa & Cân chỉnh Động cơ, IC Votol',
    laborMin: 200000,
    laborMax: 350000,
    partsMin: 350000,
    partsMax: 1200000,
    typicalItems: [
      'Cân chỉnh map ga sóng sin êm mượt trên máy tính',
      'Thay thế cụm 3 mắt đọc cảm biến Hall động cơ',
      'IC điều tốc Votol EM50s / EM100s chính hãng'
    ],
    warrantyMonths: 12,
    timeEstimate: '1 - 2 giờ'
  },
  brake_tire: {
    serviceId: 'brake_tire',
    name: 'Hệ thống Phanh E-ABS & Lốp chuyên dụng EV',
    laborMin: 100000,
    laborMax: 180000,
    partsMin: 250000,
    partsMax: 750000,
    typicalItems: [
      'Cặp má phanh gốm Ceramic chịu nhiệt không chai đĩa',
      'Dầu phanh chuyên dụng DOT4 chống bó cứng',
      'Lốp không săm gai bám đường chống trơn trượt mưa gió'
    ],
    warrantyMonths: 6,
    timeEstimate: '30 - 45 phút'
  },
  electrical_diagnostic: {
    serviceId: 'electrical_diagnostic',
    name: 'Chẩn đoán lỗi điện tử & Hệ thống dây điện',
    laborMin: 150000,
    laborMax: 300000,
    partsMin: 100000,
    partsMax: 350000,
    typicalItems: [
      'Đo kiểm rò điện cao áp & phục hồi xe mất nguồn',
      'Cầu chì tự ngắt & relay chuyển đổi DC-DC 12V',
      'Gen co nhiệt bảo vệ toàn bộ bó dây điện chống chuột cắn'
    ],
    warrantyMonths: 6,
    timeEstimate: '45 - 90 phút'
  }
};
