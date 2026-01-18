"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const desktopImages = [
  {
    src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1920&h=800&fit=crop&crop=center&q=85",
    quote: "Redefining Men's Fashion",
    subtext: "Experience the perfect blend of comfort and style with our premium collection."
  },
  {
    src: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1920&h=800&fit=crop&crop=center&q=85",
    quote: "Tailored to Perfection",
    subtext: "Handcrafted Gurkhas and Shirts designed for the modern gentleman."
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=800&fit=crop&crop=center&q=85",
    quote: "Effortless Elegance",
    subtext: "Elevate your wardrobe with our latest arrivals and timeless classics."
  }
];

const mobileImages = [
  {
    src: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=768&h=600&fit=crop&crop=center&q=85",
    quote: "Redefining Men's Fashion",
    subtext: "Experience the perfect blend of comfort and style."
  },
  {
    src: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=768&h=600&fit=crop&crop=center&q=85",
    quote: "Tailored to Perfection",
    subtext: "Handcrafted Gurkhas and Shirts for the modern gentleman."
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=768&h=600&fit=crop&crop=center&q=85",
    quote: "Effortless Elegance",
    subtext: "Elevate your wardrobe with our latest arrivals."
  }
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const imagesToPreload = isMobile ? mobileImages : desktopImages;
    let loadedCount = 0;
    
    // Safety check just in case, though isMobile default is false
    if (imagesToPreload.length === 0) {
        setIsLoaded(true);
        return;
    }

    imagesToPreload.forEach((imageObj) => {
      const img = new window.Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imagesToPreload.length) {
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
          // Handle error by counting it anyway to avoid stalling
           loadedCount++;
            if (loadedCount === imagesToPreload.length) {
            setIsLoaded(true);
            }
      }
      img.src = imageObj.src;
    });
  }, [isMobile]);

  useEffect(() => {
    if (isLoaded) {
      setProgress(0);
      
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % (isMobile ? mobileImages.length : desktopImages.length));
        setProgress(0);
      }, 5000);

      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 2;
        });
      }, 100);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isMobile, isLoaded]);

  const goToSlide = (index: number) => {
    setCurrent(index);
    setProgress(0);
    // Reset timer on manual interaction
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % (isMobile ? mobileImages.length : desktopImages.length));
        setProgress(0);
      }, 5000);

      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 2;
        });
      }, 100);
  };

  const currentImages = isMobile ? mobileImages : desktopImages;

  return (
    <section 
      className="relative w-full h-[85vh] sm:h-[90vh] md:h-[95vh] overflow-hidden bg-gray-50 pt-[120px] md:pt-[100px]"
      role="region"
      aria-label="Hero carousel"
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 z-20 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                 <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
        </div>
      )}

      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {currentImages.map((imageObj, index) => (
            current === index && (
              <motion.div
                key={`${isMobile ? "mobile" : "desktop"}-${index}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={imageObj.src}
                  alt={`${imageObj.quote} - Fittara Fashion`}
                  fill
                  className="object-cover object-top"
                  priority={index === 0}
                  sizes="100vw"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                <div className="absolute inset-0 flex items-center px-4 sm:px-8 md:px-12 lg:px-20">
                  <div className="max-w-3xl pt-20">
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="backdrop-blur-sm bg-white/10 rounded-3xl p-6 sm:p-8 md:p-10 border border-white/20 shadow-2xl"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "60px" }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="h-1 bg-white mb-4 sm:mb-6 rounded-full"
                      ></motion.div>

                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-5 text-white leading-tight tracking-tight drop-shadow-lg"
                      >
                        {imageObj.quote}
                      </motion.h1>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-gray-100 mb-6 sm:mb-8 leading-relaxed max-w-xl drop-shadow-md"
                      >
                        {imageObj.subtext}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                      >
                        <Link href="/products">
                          <button className="group relative px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-white/30 text-sm sm:text-base md:text-lg cursor-pointer w-full sm:w-auto">
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              Shop Collection
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </span>
                          </button>
                        </Link>

                        <Link href="/pant">
                          <button className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-transparent text-white font-semibold rounded-full border-2 border-white/50 backdrop-blur-sm hover:bg-white/10 hover:border-white transition-all duration-300 text-sm sm:text-base md:text-lg w-full sm:w-auto">
                            View Pants
                          </button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center gap-2 sm:gap-3 bg-black/20 backdrop-blur-md px-4 py-3 rounded-full border border-white/20 shadow-lg">
          {currentImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="relative group"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={current === index ? "true" : "false"}
            >
              <div
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                  current === index
                    ? "bg-white scale-110"
                    : "bg-white/50 group-hover:bg-white/80"
                }`}
              />
              {current === index && (
                <motion.div
                  className="absolute inset-0 rounded-full border border-white"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <motion.div
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
