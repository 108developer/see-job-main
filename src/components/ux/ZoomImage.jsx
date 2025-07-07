// components/ZoomImage.js
"use client"; // if you're using Next.js 13+ App Router

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ZoomImage({ src, alt, width = 100, height = 100 }) {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover cursor-pointer"
        onClick={() => setIsZoomed(true)}
      />

      {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsZoomed(false)}
        >
          <Image
            src={src}
            alt={alt}
            width={600}
            height={600}
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  );
}
