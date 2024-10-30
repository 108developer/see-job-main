"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function InfiniteLogoCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", containScroll: "trim" },
    [Autoplay({ delay: 2000, stopOnInteraction: true })]
  );

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // List of logo URLs
  const logos = [
    "https://seejob.netlify.app/images/logo/wipro.jpg",
    "https://seejob.netlify.app/images/logo/police.jpeg",
    "https://seejob.netlify.app/images/logo/IOCL.jpg",
    "https://seejob.netlify.app/images/logo/Cognizant.jpg",
    "https://seejob.netlify.app/images/logo/infosys.jpg",
    "https://seejob.netlify.app/images/logo/logo-amazon.png",
    "https://seejob.netlify.app/images/logo/mail.png",
    "https://seejob.netlify.app/images/logo/Microsoft.png",
    "https://seejob.netlify.app/images/logo/tata.png"
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div ref={emblaRef} className="overflow-hidden w-full">
        <div className="flex">
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex-[0_0_20%] min-w-0 flex items-center justify-center"
            >
                  <Image
                    height={100}
                    width={100}
                    src={logo}
                    alt={`Logo ${index + 1}`}
                    className="h-fit w-fit object-contain"
                  />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
