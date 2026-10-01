export default function Loader() {
  return (
    <div className="flex gap-2">
      <span className="sr-only">Loading...</span>
      <div className="bg-white w-8 h-8 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="bg-white w-8 h-8 rounded-full animate-bounce [animation-delau:-0.15s]" />
      <div className="bg-white w-8 h-8 rounded-full animate-bounce" />
    </div>
  );
}
