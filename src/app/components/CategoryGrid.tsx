"use client";

import React from "react";

const CategoryGrid = () => {
    return (
        <section className="bg-black py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wide">
                        Explore Our <span className="italic font-serif">Collections</span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Premium craftsmanship for the modern gentleman
                    </p>
                </div>

                {/* Advertising Video */}
                <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
                    <video
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src="/videos/Fittara-ad.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Subtle Gradient Overlay for better text visibility if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
