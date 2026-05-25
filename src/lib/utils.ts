import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Map slow random redirect picsum.photos URLs to fast high-quality CDN Unsplash alternatives and let them load directly.
const PICSUM_MAP: Record<string, string> = {
  'parkside-logo': '', // Empty lets it fall back gracefully to the beautiful typography-based text + icon logo in navbar
  'parkside-a': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', // Modern Studio
  'parkside-b': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688', // Spacious 1 Bed
  'parkside-c1': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2', // Bespoke 2 Bed
  'parkside-c2': 'https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5', // Refined 2 Bed Suite
  'parkside-d1': 'https://images.unsplash.com/photo-1484154218962-a197022b5858', // Versatile 2+1 Bed
  'parkside-d2': 'https://images.unsplash.com/photo-1513694203232-719a280e022f', // Pragmatic 2+1 Bed Area
  'parkside-d3': 'https://images.unsplash.com/photo-1505691938895-1758d7feb511', // Extensive 2+1 Bed Living Room
  'parkside-e1': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0', // Generous 3 Bed
  'parkside-e2': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d', // Penthouse 3 Bed
  'parkside-loc': 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83', // Clean dark stylized architect grid map
  'parkside-favicon': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', // Elegant real estate emblem aspect
  'parkside-og': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d' // High-end hero preview
};

interface OptimizeOptions {
  width?: number;
  quality?: number;
}

/**
 * Highly optimizes image URLs for the layout components:
 * 1. Automatically converts slow Picsum.photos placeholders to high-performance, beautiful Unsplash images.
 * 2. Rewrites Unsplash parameters to enforce modern 'webp' web compression format,
 *    appropriate fluid width bounds, and high-efficiency quality setting (defaults to q=60).
 */
export function optimizeImage(url: string | undefined | null, options: OptimizeOptions = {}): string {
  if (!url) return '';
  
  let targetUrl = url.trim();

  // 1. Resolve slow picsum.photos URLs
  if (targetUrl.includes('picsum.photos')) {
    const matchedKey = Object.keys(PICSUM_MAP).find(key => targetUrl.includes(key));
    if (matchedKey !== undefined) {
      const unsplashBase = PICSUM_MAP[matchedKey];
      if (!unsplashBase) return ''; // Let it fall back to text logo / styling alternative
      targetUrl = unsplashBase;
    }
  }

  // 2. Format and highly compress Unsplash URLs for speed
  if (targetUrl.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(targetUrl);
      
      const width = options.width || 800;
      const quality = options.quality || 60; // 60 is the perfect equilibrium of detail & byte optimization
      
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('fit', 'crop');
      urlObj.searchParams.set('q', quality.toString());
      urlObj.searchParams.set('w', width.toString());
      urlObj.searchParams.set('fm', 'webp'); // Enforce high-performance WebP compression
      
      return urlObj.toString();
    } catch {
      // Fallback manual append if standard URL parsing fails or is non-standard
      if (!targetUrl.includes('?')) {
        return `${targetUrl}?auto=format&fit=crop&q=${options.quality || 60}&w=${options.width || 800}&fm=webp`;
      }
      return targetUrl;
    }
  }

  return targetUrl;
}
