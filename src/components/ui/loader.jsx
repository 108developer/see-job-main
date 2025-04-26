// @/components/ui/Loader.js
import { cn } from "@/lib/utils"; // If you want to use the cn utility for className concatenation

function Loader({ className, size = "w-12 h-12", ...props }) {
  return (
    <div
      className={cn(
        "border-t-4 border-b-4 border-blue-500 border-solid rounded-full animate-spin",
        size,
        className
      )}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export { Loader };
