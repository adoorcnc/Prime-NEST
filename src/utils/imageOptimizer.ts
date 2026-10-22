export interface OptimizedImageResult {
  dataUrl: string;
  virtualPath: string;
  originalSizeKb: number;
  optimizedSizeKb: number;
  width: number;
  height: number;
}

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB limit
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

export function slugifyText(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'project';
}

export function isValidDomainOrUrl(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith('/') || trimmed.startsWith('data:image/')) return true;

  // Check if it is already a full http/https URL
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return Boolean(parsed.hostname && parsed.hostname.includes('.'));
    }
  } catch {
    // Not a full URL with protocol; test as a domain or domain+path
  }

  // Test by prepending https:// for domain inputs like "example.com" or "www.site.in/shop"
  try {
    const parsedWithHttps = new URL(`https://${trimmed}`);
    const host = parsedWithHttps.hostname;
    return /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/.test(host);
  } catch {
    return false;
  }
}

export function isValidUrl(urlStr: string): boolean {
  return isValidDomainOrUrl(urlStr);
}

export function normalizeWebsiteUrl(domainOrUrl: string): string {
  const trimmed = domainOrUrl.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed.replace(/^\/+/, '')}`;
}

export function extractWebsiteDomain(domainOrUrl: string): string {
  const trimmed = domainOrUrl.trim();
  if (!trimmed) return '';
  try {
    const normalized = normalizeWebsiteUrl(trimmed);
    const parsed = new URL(normalized);
    return parsed.hostname.replace(/^www\./i, '');
  } catch {
    return trimmed
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .split('/')[0];
  }
}

export function deriveProjectTitleFromDomainOrUrl(domainOrUrl: string): string {
  const domain = extractWebsiteDomain(domainOrUrl);
  if (!domain) return 'Showcased Website';
  const basePart = domain.split('.')[0] || domain;
  return basePart
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) =>
      word.length <= 4
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ');
}

export function generateShowcaseCoverDataUrl(
  projectName: string,
  domainOrUrl: string,
  category: string = 'Business'
): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1280, 800);
    bgGrad.addColorStop(0, '#0B0B14');
    bgGrad.addColorStop(0.55, '#151329');
    bgGrad.addColorStop(1, '#1E1640');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1280, 800);

    // Glow accent
    const radial = ctx.createRadialGradient(950, 260, 40, 950, 260, 420);
    radial.addColorStop(0, 'rgba(108, 78, 255, 0.38)');
    radial.addColorStop(1, 'rgba(108, 78, 255, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 1280, 800);

    // Browser window mockup frame
    ctx.fillStyle = '#181926';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(110, 90, 1060, 620, 20);
    ctx.fill();
    ctx.stroke();

    // Browser top bar
    ctx.fillStyle = '#222436';
    ctx.beginPath();
    ctx.roundRect(110, 90, 1060, 56, [20, 20, 0, 0]);
    ctx.fill();

    // Traffic dots
    const dotColors = ['#FF5F56', '#FFBD2E', '#27C93F'];
    dotColors.forEach((color, idx) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(146 + idx * 22, 118, 6.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Address bar pill showing Domain / URL
    const cleanDomain = extractWebsiteDomain(domainOrUrl) || domainOrUrl || 'primenest.studio';
    ctx.fillStyle = '#12131F';
    ctx.beginPath();
    ctx.roundRect(240, 102, 560, 32, 8);
    ctx.fill();

    ctx.fillStyle = '#A594FF';
    ctx.font = '600 15px monospace';
    ctx.fillText(`https://${cleanDomain}`, 260, 123);

    // Category badge inside canvas
    ctx.fillStyle = 'rgba(108, 78, 255, 0.22)';
    ctx.beginPath();
    ctx.roundRect(170, 220, 190, 38, 19);
    ctx.fill();

    ctx.fillStyle = '#B8A6FF';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(category.toUpperCase(), 195, 244);

    // Project Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 56px sans-serif';
    ctx.fillText((projectName || cleanDomain).slice(0, 28), 170, 330);

    // Domain / Live URL subtitle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    ctx.font = '500 24px sans-serif';
    ctx.fillText(`Live Showcase • ${cleanDomain}`, 170, 382);

    // Decorative UI cards inside browser window
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(170, 440, 440, 190, 14);
    ctx.fill();

    ctx.fillStyle = 'rgba(108, 78, 255, 0.18)';
    ctx.beginPath();
    ctx.roundRect(640, 440, 460, 190, 14);
    ctx.fill();

    ctx.fillStyle = '#6C4EFF';
    ctx.beginPath();
    ctx.roundRect(170, 560, 180, 44, 22);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Visit Website ↗', 202, 588);

    return canvas.toDataURL('image/webp', 0.82);
  } catch {
    return '';
  }
}

export function sanitizeText(input: string): string {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
}

export async function optimizeImageToWebP(
  file: File,
  projectSlug: string,
  slotName: string = 'cover',
  maxWidth: number = 1280,
  quality: number = 0.78
): Promise<OptimizedImageResult> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Unsupported file format. Please upload a PNG, JPG, or WebP image.');
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('File exceeds the 10MB maximum upload limit.');
  }

  const originalSizeKb = Math.round(file.size / 1024);
  const safeSlug = slugifyText(projectSlug || 'primenest-project');
  const virtualPath = `portfolio/${safeSlug}/${slotName}.webp`;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file content.'));
      img.onload = () => {
        let targetWidth = img.width;
        let targetHeight = img.height;

        if (targetWidth > maxWidth) {
          const ratio = maxWidth / targetWidth;
          targetWidth = Math.round(targetWidth * ratio);
          targetHeight = Math.round(targetHeight * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Browser canvas context unavailable for WebP optimization.'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        let dataUrl = canvas.toDataURL('image/webp', quality);
        // Fallback if browser doesn't encode WebP or if image is still large
        if (dataUrl.length > 450000) {
          dataUrl = canvas.toDataURL('image/webp', 0.62);
        }

        const optimizedSizeKb = Math.max(1, Math.round((dataUrl.length * 3) / 4 / 1024));

        resolve({
          dataUrl,
          virtualPath,
          originalSizeKb,
          optimizedSizeKb,
          width: targetWidth,
          height: targetHeight,
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
