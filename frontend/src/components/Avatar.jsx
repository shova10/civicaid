import { useAvatar } from '../hooks/useAvatar'

const SIZES = {
  sm: 'w-9 h-9 text-base',
  md: 'w-12 h-12 text-xl',
  lg: 'w-16 h-16 text-2xl',
}

export default function Avatar({ userId, name, size = 'md', className = '' }) {
  const avatar = useAvatar(userId)

  const base = `${SIZES[size]} rounded-[10px_3px_10px_3px] flex items-center justify-center font-black overflow-hidden ${className}`

  if (avatar?.type === 'image') {
    return (
      <img
        src={avatar.value}
        alt={name ?? 'avatar'}
        className={`${base} object-cover`}
      />
    )
  }

  if (avatar?.type === 'emoji') {
    return (
      <div className={`${base} bg-white/10 border border-white/10`}>
        <span>{avatar.value}</span>
      </div>
    )
  }

  return (
    <div
      className="w-8 h-8 rounded-full bg-linear-to-br
                            from-blue-400 to-violet-500 flex items-center justify-center shrink-0"
    >
      <span className="text-xs font-bold text-white">
        {name?.[0]?.toUpperCase() ?? '?'}
      </span>
    </div>
  )
}
