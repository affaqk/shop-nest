// User avatar that falls back to generated initials when the profile URL is missing or broken
const Avatar = ({ user, className = 'h-10 w-10' }) => {
  const fallback = `https://ui-avatars.com/api/?background=dbeafe&color=1d4ed8&name=${encodeURIComponent(user?.name || 'U')}`

  return (
    <img
      src={user?.profile || fallback}
      alt={user?.name}
      onError={(e) => {
        e.currentTarget.onerror = null
        e.currentTarget.src = fallback
      }}
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  )
}

export default Avatar
