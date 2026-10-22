import { FaStar, FaStarHalfStroke, FaRegStar } from 'react-icons/fa6'

const Rating = ({ value, reviews, size = 'h-3.5 w-3.5' }) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (value >= i + 1) return <FaStar key={i} className={size} />
    if (value >= i + 0.5) return <FaStarHalfStroke key={i} className={size} />
    return <FaRegStar key={i} className={size} />
  })

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex text-amber-400">{stars}</div>
      {reviews != null && <span className="text-xs text-slate-500">({reviews.toLocaleString()})</span>}
    </div>
  )
}

export default Rating
