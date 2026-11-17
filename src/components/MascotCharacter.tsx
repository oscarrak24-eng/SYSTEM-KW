import { useState } from 'react';
import { SystemKwCubeMark } from './SystemKwCubeMark';

export const MASCOT_ASSET_PATH = '/assets/aistudio/20261112_194819_0000_19741b57.png';

export type MascotVariant = 'avatar' | 'pointing' | 'full-advisor';

interface MascotCharacterProps {
  variant: MascotVariant;
  alt?: string;
  className?: string;
  highPriority?: boolean;
}

const VARIANT_CONFIG: Record<
  MascotVariant,
  {
    aspectClass: string;
    maskLeftCorner: boolean;
    imgStyle: {
      width: string;
      left: string;
      top: string;
    };
  }
> = {
  // 1:1 close portrait of the Lion's face, glasses, and dreadlocks (zero adjacent card text)
  avatar: {
    aspectClass: 'aspect-square',
    maskLeftCorner: false,
    imgStyle: {
      width: '378%',
      left: '-277.5%',
      top: '-132.5%',
    },
  },
  // 4:5 portrait framing the Lion pointing with SystemKW polo & tablet
  pointing: {
    aspectClass: 'aspect-[4/5]',
    maskLeftCorner: true,
    imgStyle: {
      width: '338%',
      left: '-236%',
      top: '-90%',
    },
  },
  // 3:5 editorial framing including the Lion, tablet, laptop, and CFDI factura
  'full-advisor': {
    aspectClass: 'aspect-[3/5]',
    maskLeftCorner: true,
    imgStyle: {
      width: '332%',
      left: '-230%',
      top: '-78%',
    },
  },
};

export function MascotCharacter({
  variant,
  alt = 'Asesor principal SystemKW con lentes, playera SystemKW y tableta de facturación',
  className = '',
  highPriority = false,
}: MascotCharacterProps) {
  const [hasError, setHasError] = useState(false);
  const config = VARIANT_CONFIG[variant];

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-[#EBF3FA] text-[#062B5B] p-4 border border-[#C6DCF0] ${config.aspectClass} ${className}`}
      >
        <SystemKwCubeMark className="w-10 h-10 mb-2" />
        <span className="font-display font-bold text-xs text-center">SystemKW</span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-[#EBF3FA] ${config.aspectClass} ${className}`}
    >
      <img
        src={MASCOT_ASSET_PATH}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={highPriority ? 'eager' : 'lazy'}
        decoding="sync"
        fetchPriority={highPriority ? 'high' : 'auto'}
        onError={() => setHasError(true)}
        className="contrast-[1.03] saturate-[1.04]"
        style={{
          position: 'absolute',
          width: config.imgStyle.width,
          maxWidth: 'none',
          height: 'auto',
          left: config.imgStyle.left,
          top: config.imgStyle.top,
        }}
      />
      {config.maskLeftCorner && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 w-[18%] h-[52%]"
          style={{
            background:
              'radial-gradient(100% 85% at 0% 25%, #EBF3FA 40%, rgba(235, 243, 250, 0.8) 65%, rgba(235, 243, 250, 0) 92%)',
          }}
        />
      )}
    </div>
  );
}
