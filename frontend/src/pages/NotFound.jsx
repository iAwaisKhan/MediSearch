import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="text-7xl mb-6">💊</div>
      <h1 className="font-display text-5xl font-bold text-slate-800 mb-3">404</h1>
      <p className="text-slate-500 text-lg mb-2">Page not found</p>
      <p className="text-slate-400 text-sm mb-8 max-w-sm">
        The page you're looking for doesn't exist. Let's get you back on track.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link to="/"       className="btn-primary">Go Home</Link>
        <Link to="/search" className="btn-secondary">Search a Medicine</Link>
      </div>
    </div>
  );
}
