export default function PageHeader({ eyebrow, title, subtitle, center = false }) {
  return (
    <div className={`mb-8 ${center ? "text-center" : ""}`}>
      {eyebrow && (
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-brand-300 mb-2">
          {eyebrow}
        </span>
      )}
      <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-800 leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-slate-500 text-base font-light max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
