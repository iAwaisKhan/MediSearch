export default function ErrorBox({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 bg-red-50 border border-red-100 rounded-2xl p-6 text-center animate-fade-up">
      <div className="text-3xl">⚠️</div>
      <p className="text-sm text-red-600 font-medium">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary text-xs px-4 py-1.5">
          Try again
        </button>
      )}
    </div>
  );
}
