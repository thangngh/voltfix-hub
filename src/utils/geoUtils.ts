import { Partner } from '../types';

/**
 * Calculates distance in kilometers between two GPS coordinates using the Haversine formula.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Number(distance.toFixed(1));
}

export interface NearestPartnerResult {
  partner: Partner;
  distanceKm: number;
  travelTime: { min: number; max: number; text: string };
}

/**
 * Estimates technician or customer travel time by motorbike based on urban traffic in Vietnam.
 * Avg speed: 20-30 km/h in city traffic, plus 5-10 mins preparation.
 */
export function estimateTravelTime(distanceKm: number): {
  min: number;
  max: number;
  text: string;
} {
  const minMinutes = Math.max(8, Math.round(distanceKm * 2.5 + 5));
  const maxMinutes = Math.max(15, Math.round(distanceKm * 3.5 + 10));
  return {
    min: minMinutes,
    max: maxMinutes,
    text: `${minMinutes} - ${maxMinutes} phút`
  };
}

/**
 * Finds the closest partner given user coordinates and optional filters.
 */
export function findNearestPartner(
  partners: Partner[],
  userLat: number,
  userLng: number,
  options?: {
    rescueOnly?: boolean;
    repairOnly?: boolean;
  }
): NearestPartnerResult | null {
  if (!partners || partners.length === 0) return null;

  let candidatePartners = partners.filter((p) => p.status === 'active');

  if (options?.rescueOnly) {
    candidatePartners = candidatePartners.filter((p) => p.is24_7Rescue);
  } else if (options?.repairOnly) {
    candidatePartners = candidatePartners.filter(
      (p) => p.type === 'repair_shop' || p.type === 'both'
    );
  }

  if (candidatePartners.length === 0) {
    candidatePartners = partners;
  }

  let nearest: Partner = candidatePartners[0];
  let minDistance = calculateDistanceKm(userLat, userLng, nearest.lat, nearest.lng);

  for (let i = 1; i < candidatePartners.length; i++) {
    const current = candidatePartners[i];
    const dist = calculateDistanceKm(userLat, userLng, current.lat, current.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = current;
    }
  }

  return {
    partner: nearest,
    distanceKm: minDistance,
    travelTime: estimateTravelTime(minDistance)
  };
}

/**
 * Prompts browser geolocation API with graceful timeout and high-accuracy option.
 */
export function requestBrowserGeolocation(): Promise<{
  lat: number;
  lng: number;
  accuracy?: number;
}> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Trình duyệt không hỗ trợ Geolocation'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

/**
 * Rough city/district estimation for display when reverse geocoding is unavailable offline.
 */
export function getApproximateAreaName(lat: number, lng: number): string {
  // Hanoi bounding check: ~20.9 - 21.2 N, 105.7 - 106.0 E
  if (lat >= 20.8 && lat <= 21.3 && lng >= 105.5 && lng <= 106.1) {
    if (lat > 21.03 && lng < 105.80) return 'Khu vực Cầu Giấy - Từ Liêm (Hà Nội)';
    if (lat < 21.02 && lng < 105.83) return 'Khu vực Đống Đa - Thanh Xuân (Hà Nội)';
    return 'Khu vực Trung Tâm Hà Nội';
  }

  // HCMC bounding check: ~10.6 - 11.0 N, 106.5 - 106.9 E
  if (lat >= 10.5 && lat <= 11.1 && lng >= 106.4 && lng <= 107.0) {
    if (lng > 106.74) return 'Khu vực TP. Thủ Đức (TP.HCM)';
    if (lat < 10.76) return 'Khu vực Quận 7 - Nam Sài Gòn';
    return 'Khu vực Trung Tâm TP. Hồ Chí Minh';
  }

  // Da Nang check: ~15.9 - 16.2 N, 108.1 - 108.3 E
  if (lat >= 15.9 && lat <= 16.3 && lng >= 108.0 && lng <= 108.4) {
    return 'Khu vực TP. Đà Nẵng';
  }

  return `Toạ độ GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
}
