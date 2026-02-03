"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Category cards configuration
const categoryCards = [
  {
    id: 1,
    title: "TAILORED",
    subtitle: "PANTS",
    description: "LIGHTWEIGHT / STRETCH",
    tagline: "DESIGNED FOR COMFORT",
    image: "/images/new-collection/Pant 11/pant1.jpg",
    link: "/pant",
    startingPrice: "₹799",
  },
  {
    id: 2,
    title: "GURKHA",
    subtitle: "COLLECTION",
    description: "CLASSIC / PREMIUM",
    tagline: "HANDCRAFTED ELEGANCE",
    image: "/images/new-collection/Pant 22/p1.png",
    link: "/pant",
    startingPrice: "₹799",
  },
  {
    id: 3,
    title: "PREMIUM",
    subtitle: "SHIRTS",
    description: "FORMAL / CASUAL",
    tagline: "LUXURIOUS FABRICS",
    image: "/images/new-collection/Shirts/shirt2.jpg",
    link: "/shirt",
    startingPrice: "₹799",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Auto-slide for mobile
  useEffect(() => {
    if (isMobile) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % categoryCards.length);
      }, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMobile]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isMobile) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % categoryCards.length);
      }, 4000);
    }
  };

  return (
    <section className="relative w-full min-h-[85vh] md:min-h-[90vh] bg-black pt-[100px] md:pt-[80px] overflow-hidden">
      {/* Desktop View - Three Cards Side by Side */}
      <div className="hidden md:flex h-[calc(90vh-80px)] w-full px-2 gap-2">
        {categoryCards.map((card, index) => (
          <Link
            key={card.id}
            href={card.link}
            className={`relative flex-1 overflow-hidden cursor-pointer transition-all duration-500 ease-out ${isHovered !== null && isHovered !== index
              ? "flex-[0.8]"
              : isHovered === index
                ? "flex-[1.4]"
                : "flex-1"
              }`}
            onMouseEnter={() => setIsHovered(index)}
            onMouseLeave={() => setIsHovered(null)}
          >
            <motion.div
              className="relative w-full h-full rounded-lg overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              {/* Background Image */}
              <Image
                src={card.image}
                alt={`${card.title} ${card.subtitle}`}
                fill
                className="object-cover object-top transition-transform duration-700"
                style={{
                  transform: isHovered === index ? "scale(1.1)" : "scale(1)",
                }}
                priority={index === 0}
                sizes="(min-width: 768px) 33vw, 100vw"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 lg:p-8 pb-20 lg:pb-24">
                {/* Top Tags */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/80 tracking-widest font-light">
                    {card.description.split(" / ")[0]}
                  </span>
                  <span className="text-white/50">/</span>
                  <span className="text-xs text-white/80 tracking-widest font-light">
                    {card.description.split(" / ")[1]}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <motion.h2
                      className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-none"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {card.title}
                    </motion.h2>
                    <motion.h3
                      className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white tracking-tight leading-none mt-1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
                    >
                      {card.subtitle}
                    </motion.h3>
                  </div>

                  {/* Tagline */}
                  <p className="text-sm text-white/70 tracking-wide">
                    {card.tagline}
                  </p>

                  {/* Price Badge */}
                  <motion.div
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    <span className="text-white/80 text-sm">STARTING AT</span>
                    <span className="text-white font-bold text-lg">
                      {card.startingPrice}
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Hover Indicator */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isHovered === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ originX: 0 }}
              />
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Mobile View - Carousel */}
      <div className="md:hidden relative h-[calc(85vh-100px)] w-full">
        <AnimatePresence mode="wait">
          {categoryCards.map(
            (card, index) =>
              currentSlide === index && (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 mx-2"
                >
                  <Link href={card.link} className="block w-full h-full">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      {/* Background Image */}
                      <Image
                        src={card.image}
                        alt={`${card.title} ${card.subtitle}`}
                        fill
                        className="object-cover object-top"
                        priority
                        sizes="100vw"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 pb-24">
                        {/* Title */}
                        <div className="mb-4">
                          <h2 className="text-4xl font-bold text-white tracking-tight leading-none">
                            {card.title}
                          </h2>
                          <h3 className="text-3xl font-bold text-white tracking-tight leading-none mt-1">
                            {card.subtitle}
                          </h3>
                        </div>

                        {/* Price Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 w-fit">
                          <span className="text-white/80 text-sm">
                            STARTING AT
                          </span>
                          <span className="text-white font-bold text-lg">
                            {card.startingPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
          )}
        </AnimatePresence>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
          {categoryCards.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-8 h-1 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-white" : "bg-white/40"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Featured Categories Label */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm py-4 text-center border-t border-white/10">
        <h4 className="text-sm font-semibold tracking-[0.3em] text-white">
          FEATURED CATEGORIES
        </h4>
      </div>
    </section>
  );
};

export default HeroSection;
