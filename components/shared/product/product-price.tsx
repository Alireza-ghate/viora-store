import { cn } from "@/lib/utils";

type ProductPriceProps = { value: number; className?: string };

function ProductPrice({ value, className }: ProductPriceProps) {
  // to make sure our price has 2 decimal number like: 99.99
  const stringValue = value.toFixed(2);
  // seprate int and float parts
  const [intValue, floatValue] = stringValue.split(".");
  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      {intValue}
      <span className="text-xs align-super">.{floatValue}</span>
    </p>
  );
}

export default ProductPrice;
