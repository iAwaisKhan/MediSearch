export default function Spinner({ size = "md", className = "" }) {
  const s = { sm: "w-5 h-5 border-2", md: "w-8 h-8 border-3", lg: "w-12 h-12 border-4" }[size];
  return (
    <div className={`${s} border-brand-100 border-t-brand-300 rounded-full animate-spin ${className}`} />
  );
}
