// Utility functions for image handling in PDF generation

export async function imageUrlToBase64(url: string): Promise<string | null> {
  // Try multiple strategies to load image
  const strategies = [
    () => loadImageWithCORS(url, 'anonymous'),
    () => loadImageWithCORS(url, null), // No CORS
    () => createBlobUrlFromImage(url), // Blob URL method
    () => loadImageWithProxy(url),
    () => loadImageDirect(url)
  ];

  for (let i = 0; i < strategies.length; i++) {
    try {
      console.log(`Trying image loading strategy ${i + 1}/${strategies.length} for: ${url}`);
      const result = await strategies[i]();
      if (result) {
        console.log(`Success with strategy ${i + 1}`);
        return result;
      }
    } catch (error) {
      console.warn(`Image loading strategy ${i + 1} failed:`, error);
      continue;
    }
  }

  console.error('All image loading strategies failed for URL:', url);
  return null;
}

async function loadImageWithCORS(url: string, crossOrigin: string | null, timeout: number = 8000): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let timeoutId: NodeJS.Timeout;
    
    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      img.onload = null;
      img.onerror = null;
    };

    if (crossOrigin) {
      img.crossOrigin = crossOrigin;
    }
    
    img.onload = () => {
      cleanup();
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Handle potential size issues
        const maxSize = 2048; // Prevent memory issues
        let { width, height } = img;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        const base64 = canvas.toDataURL('image/png', 0.8); // Compress slightly
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = (e) => {
      cleanup();
      reject(new Error(`Failed to load image with CORS: ${crossOrigin} - ${e}`));
    };
    
    timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error(`Image loading timeout (${timeout}ms)`));
    }, timeout);
    
    // Add error handling for invalid URLs
    try {
      img.src = url;
    } catch (error) {
      cleanup();
      reject(new Error(`Invalid image URL: ${url}`));
    }
  });
}

async function loadImageWithProxy(url: string): Promise<string | null> {
  // Try using multiple CORS proxy services
  const proxyUrls = [
    `https://corsproxy.io/${encodeURIComponent(url)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    `https://images.weserv.nl/?url=${encodeURIComponent(url)}`,
    `https://cors-anywhere.herokuapp.com/${url}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://thingproxy.freeboard.io/fetch/${url}`,
  ];

  for (const proxyUrl of proxyUrls) {
    try {
      console.log(`Trying proxy: ${proxyUrl}`);
      const result = await loadImageWithCORS(proxyUrl, 'anonymous');
      if (result) {
        console.log(`Success with proxy: ${proxyUrl}`);
        return result;
      }
    } catch (error) {
      console.warn(`Proxy failed: ${proxyUrl}`, error);
      continue;
    }
  }

  return null;
}

async function loadImageDirect(url: string): Promise<string | null> {
  try {
    // Try to fetch the image data directly using different methods
    const methods = [
      { mode: 'cors' as RequestMode, credentials: 'omit' as RequestCredentials },
      { mode: 'no-cors' as RequestMode, cache: 'no-cache' as RequestCache },
      { mode: 'same-origin' as RequestMode }
    ];

    for (const method of methods) {
      try {
        const response = await fetch(url, method);
        
        if (response.ok && response.type !== 'opaque') {
          const blob = await response.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          });
        }
      } catch (error) {
        continue;
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

// Alternative method using blob URL
async function createBlobUrlFromImage(url: string): Promise<string | null> {
  try {
    // Try to create a blob URL as intermediate step
    const response = await fetch(url, { 
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Accept': 'image/*',
      }
    });

    if (!response.ok) return null;

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    // Now try to load the blob URL as image
    const result = await loadImageWithCORS(blobUrl, null);
    
    // Clean up blob URL
    URL.revokeObjectURL(blobUrl);
    
    return result;
  } catch (error) {
    return null;
  }
}

export async function preloadImage(url: string): Promise<HTMLImageElement | null> {
  // Try multiple preload strategies
  const strategies = [
    () => preloadImageWithCORS(url, 'anonymous'),
    () => preloadImageWithCORS(url, null),
    () => preloadImageWithCORS(url, 'use-credentials')
  ];

  for (const strategy of strategies) {
    try {
      const result = await strategy();
      if (result) return result;
    } catch (error) {
      continue;
    }
  }

  return null;
}

async function preloadImageWithCORS(url: string, crossOrigin: string | null): Promise<HTMLImageElement | null> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (crossOrigin) {
      img.crossOrigin = crossOrigin;
    }
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to preload image'));
    
    setTimeout(() => {
      reject(new Error('Image preload timeout'));
    }, 8000);
    
    img.src = url;
  });
}

export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    const validProtocols = ['http:', 'https:', 'data:'];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    
    // Check protocol
    if (!validProtocols.includes(urlObj.protocol)) return false;
    
    // If it's a data URL, it's valid
    if (urlObj.protocol === 'data:') return true;
    
    // Check file extension
    const pathname = urlObj.pathname.toLowerCase();
    return validExtensions.some(ext => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

export async function getImageDimensions(url: string): Promise<{width: number, height: number} | null> {
  try {
    const img = await preloadImage(url);
    if (!img) return null;
    
    return {
      width: img.naturalWidth,
      height: img.naturalHeight
    };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    return null;
  }
}

export async function testImageCORS(url: string): Promise<boolean> {
  try {
    await loadImageWithCORS(url, 'anonymous');
    return true;
  } catch (error) {
    return false;
  }
}

export function getImageProxyUrl(originalUrl: string): string {
  // Return a CORS proxy URL as fallback
  return `https://corsproxy.io/${encodeURIComponent(originalUrl)}`;
}

export function getSuggestedProxyUrls(originalUrl: string): string[] {
  return [
    `https://corsproxy.io/${encodeURIComponent(originalUrl)}`,
    `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(originalUrl)}`,
  ];
}

export function analyzeCorsError(url: string): {
  domain: string;
  suggestions: string[];
  alternativeUrls: string[];
} {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    const suggestions = [
      `Contact ${domain} administrator to enable CORS headers`,
      'Upload logo to same domain as your application',
      'Use a CDN service that supports CORS (like Cloudinary, AWS S3)',
      'Use our proxy services (automatic fallback)',
    ];

    const alternativeUrls = getSuggestedProxyUrls(url);

    return {
      domain,
      suggestions,
      alternativeUrls
    };
  } catch (error) {
    return {
      domain: 'unknown',
      suggestions: ['Use a valid HTTPS URL', 'Check image URL format'],
      alternativeUrls: []
    };
  }
}