"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

type ProductImagesProps = {
  images: string[];
};

function ProductImages({ images }: ProductImagesProps) {
  const [current, setCurrent] = useState(0);

  
  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        alt="product image"
        height={1000}
        width={1000}
        priority
        className="min-h-75 object-cover object-center"
      />
      <div className="flex">
        {images.map((image, index) => (
          <div
            className={cn(
              "border-2 mr-2 cursor-pointer hover:border-orange-600",
              current === index && "border-orange-500",
            )}
            onClick={() => setCurrent(index)}
            key={index}
          >
            <Image src={image} height={100} width={100} alt="product image" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductImages;
