export function WaveRipple({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 70"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main wave */}
      <path
        d="M0,40 C75,53 225,27 300,40"
        stroke="currentColor"
        strokeWidth="10"
        vectorEffect="non-scaling-stroke"
        fill="none"
      />

      {/* Lower wave */}
      <path
        d="M0,50 C75,63 225,37 300,50"
        stroke="currentColor"
        strokeWidth="6"
        vectorEffect="non-scaling-stroke"
        fill="none"
      />

      {/* Upper wave */}
      <path
        d="M0,30 C75,43 225,17 300,30"
        stroke="currentColor"
        strokeWidth="10"
        vectorEffect="non-scaling-stroke"
        fill="none"
      />
    </svg>
  );
}