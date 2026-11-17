interface SystemKwCubeMarkProps {
  className?: string;
}

export function SystemKwCubeMark({ className = 'w-7 h-7' }: SystemKwCubeMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Top cyan facet */}
      <path d="M32 6L56 19.5L32 33L8 19.5L32 6Z" fill="#009FE3" />
      {/* Left amber-gold facet */}
      <path d="M8 23L30 35.5V58L8 45.5V23Z" fill="#F5B400" />
      {/* Right deep-navy facet */}
      <path d="M56 23L34 35.5V58L56 45.5V23Z" fill="#0A3D7A" />
    </svg>
  );
}
