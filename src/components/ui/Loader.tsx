export default function Loader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-3",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d1213]">
      <div className="flex flex-col items-center gap-4">
        <div
          className={`${sizeClasses[size]} animate-spin rounded-full border-shopify-green border-t-transparent`}
        ></div>
        <p className="text-white/70 text-sm">Loading...</p>
      </div>
    </div>
  );
}

