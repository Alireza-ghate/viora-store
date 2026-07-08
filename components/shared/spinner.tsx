import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

type SpinnerProps = {
  size: number;
  className?: string;
};

function Spinner({ size, className }: SpinnerProps) {
  return (
    <LoaderCircle
      size={size}
      className={cn("animate-spin text-gray-50", className)}
    />
  );
}

export default Spinner;
