import React, { useState, useMemo } from 'react';
import { Partner } from '../types';
import { 
  MapPin, 
  Search, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Wrench, 
  Package, 
  Zap, 
  Navigation, 
  BatteryCharging, 
  Star,
  ChevronRight,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

interface DigitalMapProps {
  partners: Partner[];
  onSelectPartnerForBooking: (partner: Partner) => void;
  onFilterPartsByPartner: (partnerId: string) => void;
}

export const DigitalMap: React.FC<DigitalMapProps> = ({
  partners,
  onSelectPartnerForBooking,
  onFilterPartsByPartner
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'repair_shop' | 'parts_hub' | 'rescue' | 'swap'>('all');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(partners[0]?.id || '');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name: string }>({
    lat: 21.0285,
    lng: 105.8542,
    name: 'Vị trí hiện tại (Hà Nội)'
  });

  // Calculate distance in km using Haversine approximation
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d.toFixed(1);
  };

  const filteredPartners = useMemo(() => {
    return partners.filter(p => {
      // City filter
      if (selectedCity !== 'all' && !p.city.toLowerCase().includes(selectedCity.toLowerCase())) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchAddress = p.address.toLowerCase().includes(query) || p.district.toLowerCase().includes(query);
        const matchService = p.servicesOffered.some(s => s.toLowerCase().includes(query));
        const matchBrand = p.compatibleBrands.some(b => b.toLowerCase().includes(query));
        if (!matchName && !matchAddress && !matchService && !matchBrand) return false;
      }
      // Type filter
      if (filterType === 'repair_shop') {
        return p.type === 'repair_shop' || p.type === 'both';
      }
      if (filterType === 'parts_hub') {
        return p.type === 'parts_hub' || p.type === 'both';
      }
      if (filterType === 'rescue') {
        return p.is24_7Rescue;
      }
      if (filterType === 'swap') {
        return p.fastBatterySwap;
      }
      return true;
    });
  }, [partners, selectedCity, searchQuery, filterType]);

  const activePartner = useMemo(() => {
    return partners.find(p => p.id === selectedPartnerId) || filteredPartners[0] || partners[0];
  }, [partners, selectedPartnerId, filteredPartners]);

  // Handle switching city location preset
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    if (city === 'hanoi') {
      setUserLocation({ lat: 21.0285, lng: 105.8542, name: 'Khu vực Hà Nội' });
    } else if (city === 'hcm') {
      setUserLocation({ lat: 10.7769, lng: 106.7009, name: 'Khu vực TP. Hồ Chí Minh' });
    } else if (city === 'danang') {
      setUserLocation({ lat: 16.0544, lng: 108.2022, name: 'Khu vực Đà Nẵng' });
    } else if (city === 'cantho') {
      setUserLocation({ lat: 10.0452, lng: 105.7469, name: 'Khu vực Cần Thơ' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner / Filter controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Bản Đồ Số Trực Tuyến Hệ Sinh Thái EV</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Tìm Tiệm Sửa Xe Điện & Trung Tâm Linh Kiện Gần Nhất
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Hơn {partners.length} đối tác chính hãng hỗ trợ cứu hộ khẩn cấp 24/7, thay pin cấp tốc và phân phối linh kiện chuẩn an toàn.
            </p>
          </div>

          {/* Quick city picker */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0">
            {[
              { id: 'all', label: 'Toàn quốc' },
              { id: 'hanoi', label: 'Hà Nội' },
              { id: 'hcm', label: 'TP.HCM' },
              { id: 'danang', label: 'Đà Nẵng' },
              { id: 'cantho', label: 'Cần Thơ' }
            ].map(c => (
              <button
                key={c.id}
                onClick={() => handleCityChange(c.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedCity === c.id 
                    ? 'bg-white text-slate-900 shadow-xs font-semibold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Tag Filters */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên tiệm, quận huyện, dịch vụ (độ pin, cứu hộ, phanh)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50/50"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filterType === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({partners.length})
            </button>

            <button
              onClick={() => setFilterType('repair_shop')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filterType === 'repair_shop'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Tiệm sửa chữa</span>
            </button>

            <button
              onClick={() => setFilterType('parts_hub')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filterType === 'parts_hub'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Kho linh kiện</span>
            </button>

            <button
              onClick={() => setFilterType('rescue')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filterType === 'rescue'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Cứu hộ 24/7</span>
            </button>

            <button
              onClick={() => setFilterType('swap')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filterType === 'swap'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>Trạm pin / Sạc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map + Shop List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Digital Map Canvas (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-[580px]">
          
          {/* Map Top Bar */}
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="font-medium">Bản đồ số định vị thời gian thực</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300 font-mono">GPS: {activePartner.lat.toFixed(4)}, {activePartner.lng.toFixed(4)}</span>
            </div>
            <div className="text-slate-400 hidden sm:block">
              Click vào điểm ghim để xem chi tiết
            </div>
          </div>

          {/* Interactive SVG Street Map Visualizer */}
          <div className="relative flex-1 bg-slate-950 overflow-hidden select-none">
            {/* Background Map Grid & Roads */}
            <svg className="w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
                </pattern>
                <linearGradient id="roadGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="#090d16" />
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Simulated Major Highway & River Arteries */}
              <path d="M -50 150 Q 250 120 400 280 T 800 450" fill="none" stroke="#0ea5e9" strokeWidth="8" strokeOpacity="0.25" />
              <path d="M 100 -50 L 250 600" fill="none" stroke="#334155" strokeWidth="14" strokeOpacity="0.7" />
              <path d="M 500 -50 L 380 600" fill="none" stroke="#334155" strokeWidth="12" strokeOpacity="0.7" />
              <path d="M -50 320 Q 300 350 750 200" fill="none" stroke="#334155" strokeWidth="16" strokeOpacity="0.8" />
              <path d="M 50 480 L 700 480" fill="none" stroke="#334155" strokeWidth="10" strokeOpacity="0.6" />
              <path d="M 200 100 L 600 100" fill="none" stroke="#334155" strokeWidth="8" strokeOpacity="0.5" />
              
              {/* Distance radius circles around selected */}
              <circle cx="360" cy="270" r="130" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.3" />
              <circle cx="360" cy="270" r="240" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="6 6" strokeOpacity="0.15" />
            </svg>

            {/* Simulated Live User Position Marker */}
            <div 
              className="absolute left-[30%] top-[45%] -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
              title="Vị trí của bạn"
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute w-8 h-8 rounded-full bg-cyan-500/20 animate-ping"></div>
                <div className="w-5 h-5 rounded-full bg-cyan-500 border-2 border-white shadow-lg flex items-center justify-center text-slate-950 font-bold text-[9px]">
                  B
                </div>
              </div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/95 text-cyan-300 text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap border border-slate-700">
                Bạn ở đây
              </div>
            </div>

            {/* Partner Pin Markers on the interactive map */}
            {filteredPartners.map((partner, index) => {
              // Distribute pins across visual space consistently based on index/coordinates
              const pinPositions = [
                { top: '32%', left: '48%' },
                { top: '58%', left: '38%' },
                { top: '25%', left: '72%' },
                { top: '68%', left: '62%' },
                { top: '42%', left: '80%' },
                { top: '78%', left: '26%' }
              ];
              const pos = pinPositions[index % pinPositions.length];
              const isSelected = partner.id === activePartner.id;
              const isRescue = partner.is24_7Rescue;
              const isParts = partner.type === 'parts_hub';

              return (
                <button
                  key={partner.id}
                  onClick={() => setSelectedPartnerId(partner.id)}
                  style={{ top: pos.top, left: pos.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all transform focus:outline-none ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {/* Pin Box */}
                    <div className={`p-2 rounded-xl shadow-lg border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-emerald-500 border-white text-slate-950 ring-4 ring-emerald-500/30'
                        : isRescue
                        ? 'bg-rose-600 border-slate-900 text-white'
                        : isParts
                        ? 'bg-blue-600 border-slate-900 text-white'
                        : 'bg-slate-800 border-emerald-400 text-emerald-400'
                    }`}>
                      {isParts ? (
                        <Package className="w-4 h-4" />
                      ) : isRescue ? (
                        <Zap className="w-4 h-4 fill-current" />
                      ) : (
                        <Wrench className="w-4 h-4" />
                      )}
                    </div>

                    {/* Pin Label */}
                    <div className={`mt-1 text-[11px] font-semibold px-2 py-0.5 rounded shadow-md whitespace-nowrap border ${
                      isSelected
                        ? 'bg-white text-slate-950 border-emerald-500'
                        : 'bg-slate-900/90 text-slate-200 border-slate-800'
                    }`}>
                      {partner.name.split(' ')[0]} {partner.name.split(' ')[1]}
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Quick Map Overlay: Active Partner Mini Bar */}
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl text-white flex items-center justify-between gap-3 z-30">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-semibold truncate text-white">
                      {activePartner.name}
                    </h4>
                    {activePartner.verified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 truncate">
                    {activePartner.address}, {activePartner.district}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onSelectPartnerForBooking(activePartner)}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg transition-colors whitespace-nowrap"
                >
                  Đặt lịch ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Directory List & Selected Details (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Partner Detail Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-emerald-700">
                    {activePartner.type === 'both' ? 'Tiệm Sửa Xe & Kho Linh Kiện' : activePartner.type === 'repair_shop' ? 'Tiệm Sửa Xe Điện' : 'Trung Tâm Linh Kiện'}
                  </span>
                  <span>·</span>
                  <span>{activePartner.city}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {activePartner.name}
                </h3>
              </div>

              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-semibold tabular-nums shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{activePartner.rating}</span>
                <span className="text-slate-400 text-[10px]">({activePartner.reviewsCount})</span>
              </div>
            </div>

            {/* Address & Hotline */}
            <div className="mt-3 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{activePartner.address}, {activePartner.district}, {activePartner.city}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{activePartner.openHours}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 font-semibold font-mono">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Cách bạn ~{calculateDistance(userLocation.lat, userLocation.lng, activePartner.lat, activePartner.lng)} km</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={`tel:${activePartner.phone}`} className="font-semibold text-slate-800 hover:text-emerald-600">
                  {activePartner.phone}
                </a>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500">Chủ tiệm: {activePartner.ownerName}</span>
              </div>
            </div>

            {/* Services Highlights */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Dịch vụ nổi bật
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activePartner.servicesOffered.slice(0, 3).map((s, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="truncate">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brands compatibility */}
            <div className="mt-3 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Dòng xe hỗ trợ: </span>
              {activePartner.compatibleBrands.join(', ')}
            </div>

            {/* Action Buttons */}
            <div className="mt-5 grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => onSelectPartnerForBooking(activePartner)}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Đặt lịch hẹn ngay</span>
              </button>

              <button
                onClick={() => onFilterPartsByPartner(activePartner.id)}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Xem linh kiện ({activePartner.name.split(' ')[0]})</span>
              </button>
            </div>
          </div>

          {/* List of other partners */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-800">
                Danh Sách Tiệm & Kho ({filteredPartners.length})
              </span>
              <span className="text-slate-500">
                Sắp xếp theo khoảng cách
              </span>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {filteredPartners.map(p => {
                const isSelected = p.id === activePartner.id;
                const distance = calculateDistance(userLocation.lat, userLocation.lng, p.lat, p.lng);

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPartnerId(p.id)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-xs' 
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {p.name}
                        </h4>
                        {p.is24_7Rescue && (
                          <span className="text-[10px] text-rose-600 font-semibold shrink-0">
                            24/7
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {p.district}, {p.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-right">
                      <div>
                        <div className="text-xs font-semibold text-slate-800 tabular-nums">
                          {distance} km
                        </div>
                        <div className="text-[10px] text-amber-600 flex items-center justify-end gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>{p.rating}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
