import type { ArtKind } from './demo-data';

// Illustrazioni segnaposto finché non ci sono le foto prodotto reali
const GOLD = '#C9A96E';
const GOLD_SOFT = '#E3CFA3';

function Shape({ kind }: { kind: ArtKind }) {
  switch (kind) {
    case 'bottle':
      return (
        <g>
          <rect x="86" y="40" width="28" height="22" rx="3" fill={GOLD} />
          <rect x="70" y="62" width="60" height="118" rx="14" fill="url(#body)" stroke={GOLD} strokeWidth="1.2" />
          <rect x="80" y="104" width="40" height="40" fill="none" stroke={GOLD} strokeWidth="0.8" />
          <text x="100" y="128" textAnchor="middle" fontSize="9" letterSpacing="2" fill={GOLD_SOFT} fontFamily="serif">P</text>
        </g>
      );
    case 'jar':
      return (
        <g>
          <rect x="58" y="88" width="84" height="20" rx="4" fill={GOLD} />
          <rect x="54" y="108" width="92" height="66" rx="10" fill="url(#body)" stroke={GOLD} strokeWidth="1.2" />
          <line x1="70" y1="140" x2="130" y2="140" stroke={GOLD} strokeWidth="0.8" />
        </g>
      );
    case 'dropper':
      return (
        <g>
          <rect x="94" y="30" width="12" height="26" rx="6" fill={GOLD_SOFT} />
          <rect x="88" y="56" width="24" height="18" rx="2" fill={GOLD} />
          <rect x="74" y="74" width="52" height="104" rx="18" fill="url(#body)" stroke={GOLD} strokeWidth="1.2" />
          <rect x="74" y="130" width="52" height="48" rx="0" fill={GOLD} opacity="0.18" />
        </g>
      );
    case 'tube':
      return (
        <g>
          <path d="M74 44 H126 L118 160 H82 Z" fill="url(#body)" stroke={GOLD} strokeWidth="1.2" />
          <rect x="84" y="160" width="32" height="20" rx="3" fill={GOLD} />
          <line x1="78" y1="54" x2="122" y2="54" stroke={GOLD} strokeWidth="0.8" />
        </g>
      );
    case 'dryer':
      return (
        <g fill="none" stroke={GOLD} strokeWidth="1.4">
          <circle cx="92" cy="86" r="36" fill="url(#body)" />
          <circle cx="92" cy="86" r="14" />
          <rect x="128" y="74" width="34" height="24" rx="4" fill="url(#body)" />
          <path d="M84 120 L80 182 H100 L102 120" fill="url(#body)" />
          <path d="M90 182 C 90 196, 120 196, 136 186" strokeWidth="1" />
        </g>
      );
    case 'brush':
      return (
        <g>
          <rect x="88" y="28" width="24" height="96" rx="12" fill="url(#body)" stroke={GOLD} strokeWidth="1.2" />
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1="80" x2="120" y1={38 + i * 11} y2={38 + i * 11} stroke={GOLD} strokeWidth="1" opacity="0.7" />
          ))}
          <rect x="94" y="124" width="12" height="60" rx="6" fill={GOLD} />
        </g>
      );
    case 'extension':
      return (
        <g fill="none" strokeLinecap="round">
          <rect x="70" y="34" width="60" height="10" rx="2" fill={GOLD} />
          {Array.from({ length: 9 }).map((_, i) => (
            <path
              key={i}
              d={`M${74 + i * 6.5} 44 C ${70 + i * 6.5} 100, ${82 + i * 6.5} 140, ${72 + i * 7} 188`}
              stroke={i % 2 ? GOLD_SOFT : GOLD}
              strokeWidth="2.2"
              opacity={0.55 + (i % 3) * 0.15}
            />
          ))}
        </g>
      );
    case 'giftcard':
      return (
        <g>
          <rect x="34" y="66" width="132" height="84" rx="8" fill="url(#body)" stroke={GOLD} strokeWidth="1.2" />
          <text x="100" y="104" textAnchor="middle" fontSize="13" letterSpacing="4" fill={GOLD_SOFT} fontFamily="serif">PAPARAZZO</text>
          <text x="100" y="128" textAnchor="middle" fontSize="9" letterSpacing="3" fill={GOLD} fontFamily="serif">GIFT CARD</text>
        </g>
      );
  }
}

export default function ProductArt({ kind, className = '' }: { kind: ArtKind; className?: string }) {
  return (
    <svg viewBox="0 0 200 220" className={className} role="img" aria-hidden="true">
      <defs>
        <radialGradient id="bg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#262320" />
          <stop offset="100%" stopColor="#121110" />
        </radialGradient>
        <linearGradient id="body" x1="0" x2="1">
          <stop offset="0%" stopColor="#1d1b19" />
          <stop offset="45%" stopColor="#2c2824" />
          <stop offset="100%" stopColor="#151413" />
        </linearGradient>
      </defs>
      <rect width="200" height="220" fill="url(#bg)" />
      <ellipse cx="100" cy="190" rx="54" ry="5" fill="#000" opacity="0.5" />
      <Shape kind={kind} />
    </svg>
  );
}
