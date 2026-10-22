export const ProductCardSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100">
    <div className="aspect-square bg-slate-200" />
    <div className="space-y-3 p-4">
      <div className="h-3 w-1/3 rounded bg-slate-200" />
      <div className="h-4 w-3/4 rounded bg-slate-200" />
      <div className="h-4 w-1/4 rounded bg-slate-200" />
    </div>
  </div>
)

export const ProductGridSkeleton = ({ count = 8, className = 'lg:grid-cols-4' }) => (
  <div className={`grid grid-cols-2 gap-4 sm:gap-6 ${className}`}>
    {Array.from({ length: count }, (_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
)

export const Spinner = () => (
  <div className="flex justify-center py-20">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
  </div>
)
