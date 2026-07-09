// All custom SVG icons — no emoji, no stock icon fonts.
export const Steps = ({ c = 'currentColor', s = 22 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M4 18 L10 6 L13 11 L20 8" stroke={c} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /><circle cx="20" cy="8" r="2.2" fill={c} /></svg>
)
export const Sunrise = ({ c = 'currentColor', s = 22 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M5 16 a7 7 0 0 1 14 0" fill={c} /><line x1="3" y1="17" x2="21" y2="17" stroke={c} strokeWidth="2.2" strokeLinecap="round" /><path d="M12 3v3M5 8l1.6 1.6M19 8l-1.6 1.6" stroke={c} strokeWidth="2.2" strokeLinecap="round" /></svg>
)
export const Dumbbell = ({ c = 'currentColor', s = 22 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><rect x="1.5" y="9.5" width="3.5" height="5" rx="1.4" fill={c} /><rect x="19" y="9.5" width="3.5" height="5" rx="1.4" fill={c} /><rect x="5" y="8" width="3" height="8" rx="1.2" fill={c} /><rect x="16" y="8" width="3" height="8" rx="1.2" fill={c} /><rect x="8" y="10.8" width="8" height="2.4" rx="1.2" fill={c} /></svg>
)
export const Drop = ({ c = 'currentColor', s = 22 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 3 C12 3 5 11 5 16 a7 7 0 0 0 14 0 C19 11 12 3 12 3z" fill={c} /></svg>
)
export const Flame = ({ c = 'currentColor', s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 2 C12 2 5 9 5 14 a7 7 0 0 0 14 0 C19 9 12 2 12 2z" fill={c} /><path d="M12 8 C12 8 9 12 9 15 a3 3 0 0 0 6 0 C15 12 12 8 12 8z" fill="#ffe08a" /></svg>
)
export const Check = ({ c = '#fff', s = 12 }) => (
  <svg width={s} height={s} viewBox="0 0 12 12"><path d="M2 6l3 3 5-6" stroke={c} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
export const Bolt = ({ c = 'currentColor', s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M13 2 L4 14 h6 l-1 8 9-12 h-6 z" fill={c} /></svg>
)
export const HomeIcon = ({ c = 'currentColor', s = 22 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M4 11 L12 4 L20 11 V20 a1 1 0 0 1-1 1 h-4 v-6 h-6 v6 H5 a1 1 0 0 1-1-1 Z" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>
)
export const TrackIcon = ({ c = 'currentColor', s = 22 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M5 20 C5 16 19 16 19 12 C19 8 5 8 5 4" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /><circle cx="5" cy="20" r="2" fill={c} /><path d="M19 4 h4 v3 h-4 z" fill={c} /></svg>
)
export const Flag = ({ c = '#28c76f', s = 20 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><line x1="6" y1="3" x2="6" y2="21" stroke="#1f1a12" strokeWidth="2.2" strokeLinecap="round" /><path d="M6 4 h11 l-2.5 3.5 L17 11 H6 z" fill={c} /></svg>
)
export const Pencil = ({ c = 'currentColor', s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M4 20 l0.8 -4.2 L15.6 5 a1.5 1.5 0 0 1 2.1 0 l1.3 1.3 a1.5 1.5 0 0 1 0 2.1 L8.2 19.2 Z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" /><line x1="14" y1="6.5" x2="17.5" y2="10" stroke={c} strokeWidth="1.8" /></svg>
)
export const Google = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6a4.8 4.8 0 0 1-2 3.2v2.6h3.3c2-1.8 3.1-4.5 3.1-7.6z" fill="#4285F4" /><path d="M12 23c2.7 0 5-.9 6.6-2.4l-3.3-2.6c-.9.6-2 1-3.3 1a5.7 5.7 0 0 1-5.4-4H3.2v2.6A10 10 0 0 0 12 23z" fill="#34A853" /><path d="M6.6 15A5.6 5.6 0 0 1 6.3 12c0-1 .2-2 .5-2.9V6.5H3.2A10 10 0 0 0 2 12c0 1.6.4 3.1 1.1 4.5L6.6 15z" fill="#FBBC05" /><path d="M12 6.4c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 12 2 10 10 0 0 0 3.2 6.5l3.4 2.6A5.7 5.7 0 0 1 12 6.4z" fill="#EA4335" /></svg>
)

// A 0.5L-granularity water bottle. level: 0 empty, 1 half, 2 full.
export const Bottle = ({ level = 0, s = 30 }) => {
  const blue = '#2f8fdd'
  const empty = '#b9c6d1'
  return (
    <svg width={s} height={s * 1.66} viewBox="0 0 30 50" className="bottle">
      <defs>
        <clipPath id={`btl${level}`}><path d="M9 9 h12 c2 1.4 3 3.2 3 5.5 V44 a4 4 0 0 1 -4 4 h-8 a4 4 0 0 1 -4 -4 V14.5 C6 12.2 7 10.4 9 9z" /></clipPath>
      </defs>
      <rect x="11" y="2" width="8" height="6" rx="2" fill={level === 2 ? '#1f1a12' : empty} />
      <path d="M9 9 h12 c2 1.4 3 3.2 3 5.5 V44 a4 4 0 0 1 -4 4 h-8 a4 4 0 0 1 -4 -4 V14.5 C6 12.2 7 10.4 9 9z" fill="none" stroke={level ? blue : empty} strokeWidth="2.4" />
      {level > 0 && (
        <g clipPath={`url(#btl${level})`}>
          <rect x="4" y={level === 2 ? 6 : 27} width="22" height="44" fill={blue} />
        </g>
      )}
    </svg>
  )
}
