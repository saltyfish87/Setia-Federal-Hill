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
 * 3. Rewrites Google Drive & Google User Content (lh3) URLs to use Google's fast WebP edge thumbnail cache.
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

  // 3. Optimize Google Drive & Google User Content links
  // Convert slow direct Google Drive links to Google's fast WebP edge server
  if (targetUrl.includes('drive.google.com') || targetUrl.includes('googleusercontent.com')) {
    const width = options.width || 1200;
    // Check for drive ID in path or query
    const driveMatch = targetUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || targetUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      const fileId = driveMatch[1];
      return `https://lh3.googleusercontent.com/d/${fileId}=w${width}-rw`;
    }
    if (targetUrl.includes('lh3.googleusercontent.com')) {
      const base = targetUrl.split('=')[0];
      return `${base}=w${width}-rw`;
    }
  }

  return targetUrl;
}

/**
 * Compresses an image file on the client before uploading to cloud storage.
 * Shrinks multi-megabyte photos (e.g. 5MB-15MB phone camera shots) to ~150-300KB WebP files.
 */
export async function compressImageFile(file: File, maxWidth = 1920, quality = 0.82): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const outputType = 'image/webp';
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve(file);
              return;
            }
            const compressedName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], compressedName, {
              type: outputType,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          },
          outputType,
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
