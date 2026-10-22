const SectionHeading = ({ eyebrow, title, subtitle, align = 'center', action }) => (
  <div
    className={`mb-10 flex flex-col gap-4 ${
      align === 'center' ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'
    }`}
  >
    <div className={align === 'center' ? 'max-w-2xl' : ''}>
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">{eyebrow}</p>}
      <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-slate-500">{subtitle}</p>}
    </div>
    {action}
  </div>
)

export default SectionHeading
