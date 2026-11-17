import { useState } from 'react';
import { FileCheck2 } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  fallbackSubtitle: string;
  className?: string;
}

export function ResilientImage({
  src,
  alt,
  fallbackTitle,
  fallbackSubtitle,
  className = '',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-slate-900 text-slate-200 p-8 text-center border border-slate-800 ${className}`}
      >
        <FileCheck2 className="w-10 h-10 text-emerald-400 mb-3" aria-hidden="true" />
        <p className="font-display font-semibold text-lg text-white">{fallbackTitle}</p>
        <p className="text-sm text-slate-400 mt-1 max-w-xs">{fallbackSubtitle}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      decoding="sync"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
