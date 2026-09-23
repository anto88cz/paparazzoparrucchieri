// Icone a linea sottile per la landing del Calendario dell'Avvento (ereditano il colore da currentColor)

type IconProps = { className?: string };

function Svg({ className = 'h-6 w-6', children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function BottleIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M10 2.5h4M12 2.5v2.5M9.5 5h5v3h-5z" />
      <path d="M8.5 8h7a1.5 1.5 0 0 1 1.5 1.5V20a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 20V9.5A1.5 1.5 0 0 1 8.5 8z" />
      <path d="M7 12.5h10M7 17.5h10" />
    </Svg>
  );
}

export function GiftCardIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="2.5" y="6" width="19" height="13" rx="2" />
      <path d="M8.5 6v13M2.5 11.5h19" />
      <path d="M8.5 11.5c-1.8 0-3.2-.9-3.2-2.1 0-1.4 2-1.6 3.2.9 1.2-2.5 3.2-2.3 3.2-.9 0 1.2-1.4 2.1-3.2 2.1z" />
      <path d="M8.5 11.5l-2 2.5M8.5 11.5l2 2.5" />
    </Svg>
  );
}

export function ScissorsIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="6" cy="6.5" r="2.5" />
      <circle cx="6" cy="17.5" r="2.5" />
      <path d="M8.2 7.7 20 17M8.2 16.3 20 7M13 12h.01" />
    </Svg>
  );
}

export function CardIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M2.5 9.5h19M6 15h4" />
    </Svg>
  );
}

export function WalletIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 7.5V6a2 2 0 0 1 2-2h11" />
      <rect x="3" y="7.5" width="18" height="12.5" rx="2" />
      <path d="M21 11.5h-4a2 2 0 0 0 0 4h4" />
      <path d="M17 13.5h.01" />
    </Svg>
  );
}

export function StoreIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3.5 9 5 4h14l1.5 5" />
      <path d="M3.5 9a2.8 2.8 0 0 0 5.67 0 2.8 2.8 0 0 0 5.66 0 2.8 2.8 0 0 0 5.67 0" />
      <path d="M5 11.5V20h14v-8.5" />
      <path d="M10 20v-5h4v5" />
    </Svg>
  );
}

export function LockIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2.5" />
    </Svg>
  );
}

export function SparkleIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z" />
      <path d="M19 16.5c.2 1.3.9 2 2.2 2.2-1.3.2-2 .9-2.2 2.2-.2-1.3-.9-2-2.2-2.2 1.3-.2 2-.9 2.2-2.2z" />
    </Svg>
  );
}

export function OrnamentIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 2.5v2M10 4.5h4v2.5h-4z" />
      <circle cx="12" cy="14" r="7" />
      <path d="M5.4 12c2.2 1.3 4.4 1.3 6.6 0s4.4-1.3 6.6 0M5.4 16c2.2 1.3 4.4 1.3 6.6 0s4.4-1.3 6.6 0" />
    </Svg>
  );
}

export const HIGHLIGHT_ICONS = {
  bottle: BottleIcon,
  giftcard: GiftCardIcon,
  scissors: ScissorsIcon,
} as const;

export type HighlightIcon = keyof typeof HIGHLIGHT_ICONS;

export function CameraIcon(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 8h3l1.5-2.5h7L17 8h3a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 20H4a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 4 8z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </Svg>
  );
}
