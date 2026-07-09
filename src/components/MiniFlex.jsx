// Compact Flex used on the race track and crew strip.
export default function MiniFlex({ color = '#ffcf5a', mood = 'content', s = 40, ring = false }) {
  const ink = '#3a2f16'
  return (
    <svg width={s} height={s * 1.15} viewBox="0 0 40 46">
      {ring && <circle cx="20" cy="24" r="23" fill={color} opacity="0.22" />}
      <path d="M20 4 C10 4 7 20 7 30 C7 40 13 44 20 44 C27 44 33 40 33 30 C33 20 30 4 20 4Z" fill={color} />
      {mood === 'sad' || mood === 'sleepy' ? (
        <>
          <ellipse cx="16" cy="23" rx="2.4" ry="3" fill={ink} />
          <ellipse cx="24" cy="23" rx="2.4" ry="3" fill={ink} />
          <path d="M16 32 Q20 29 24 32" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="16" cy="22" rx="2.4" ry="3" fill={ink} />
          <ellipse cx="24" cy="22" rx="2.4" ry="3" fill={ink} />
          <path d="M16 30 Q20 34 24 30" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}
