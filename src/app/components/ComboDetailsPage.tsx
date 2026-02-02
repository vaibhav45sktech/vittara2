"use client";

import { useState } from "react";
import { FaShoppingCart, FaStar, FaEye, FaTag, FaHeart } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

// Define simpler types for the visual component since we aren't fully integrating with Cart/Wishlist yet
interface ComboItem {
    itemName: string;
    itemImage?: string | null;
    itemPrice: number;
    productId?: string | null;
}

interface ComboProduct {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    image?: string | null;
    ComboItem: ComboItem[];
}

const FloatingElements = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(15)].map((_, i) => (
                <div
                    key={i}
                    className="absolute animate-pulse"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${3 + Math.random() * 4}s`,
                    }}
                >
                    <div
                        className="w-1 h-1 rounded-full bg-amber-400/20"
                        style={{
                            boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)',
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

const ImageGallery = ({
    images,
    mainImage,
    onImageClick
}: {
    images: string[];
    mainImage: string;
    onImageClick: (image: string) => void;
}) => {
    const [selectedImage, setSelectedImage] = useState(mainImage);

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div
                className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gray-800 cursor-pointer group"
                onClick={() => onImageClick(selectedImage)}
            >
                <Image
                    src={selectedImage}
                    alt="Combo main view"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/20">
                        <FaEye className="text-white text-xl" />
                    </div>
                </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                    {images.slice(0, 4).map((image, index) => (
                        <div
                            key={index}
                            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${selectedImage === image
                                ? 'border-amber-500 shadow-lg shadow-amber-500/30'
                                : 'border-gray-700 hover:border-amber-500/50'
                                }`}
                            onClick={() => setSelectedImage(image)}
                        >
                            <Image
                                src={image}
                                alt={`View ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ActionButtons = ({
    onBuyNow
}: {
    onBuyNow: () => void;
}) => {
    return (
        <div className="space-y-4">
            <SignedIn>
                <button
                    onClick={onBuyNow}
                    className="w-full py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:-translate-y-1 border border-gray-200 text-lg"
                >
                    Buy Combo Now
                </button>

                <button
                    onClick={() => {
                        window.open("https://docs.google.com/forms/d/e/1FAIpQLSdXkEPO-4NSrIbXnjF_p2iKBHBYua4EIzYAW-EK3xb1x8lOUg/viewform", "_blank");
                    }}
                    className="w-full py-4 bg-transparent text-amber-400 border border-amber-500/50 hover:bg-amber-500/10 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg transform hover:-translate-y-1"
                >
                    <FaTag />
                    Request Customization
                </button>
            </SignedIn>

            <SignedOut>
                <Link
                    href="/sign-in"
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-bold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-lg shadow-amber-500/30 transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg text-center"
                >
                    Sign In to Purchase
                </Link>
            </SignedOut>
        </div>
    );
};

export default function ComboDetailsPage({ combo }: { combo: ComboProduct }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Collect all images: main combo image + item images
    const images = [
        combo.image,
        ...combo.ComboItem.map(item => item.itemImage).filter(Boolean)
    ].filter(Boolean) as string[];

    const { addToCart } = useCart();
    const router = useRouter();

    const handleBuyNow = () => {
        combo.ComboItem.forEach(item => {
            // We adding each item individually
            // Note: Since we don't have the full product details (id as number), 
            // we will use a hash or parse int if possible, or fallback.
            // But wait, the cart expects `id` as number.
            // Our Schema for Product has String ID (CUID).
            // Our Cart uses numeric ID? 
            // In productActions.ts: `id: index + 1` (numeric). `originalId: product.id` (string).
            // `CartItem` uses `id: number`.
            // So we need to map string ID to number or generic number.
            // Since we don't have the mapping here easily without fetching all products,
            // we will generate a random numeric ID for the cart session or hash it.
            // A simple hash function for now to keep it working without refactoring everything.

            // Simple hash from string to number
            const numericId = item.productId ?
                parseInt(item.productId.substring(0, 8), 16) :
                Math.floor(Math.random() * 100000);

            addToCart({
                id: numericId,
                title: item.itemName,
                price: item.itemPrice,
                image: item.itemImage || "/images/logo2.png",
                category: "Combo Item", // Special category to avoid strict validation if needed
                size: "Standard",
                color: "Standard",
                fabric: "Standard",
                fit: "Standard",
            });
        });

        // Redirect to store/checkout
        router.push("/store");
    };

    return (
        <main className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 font-sans">
            <Navbar />
            <FloatingElements />

            {/* Decorative gradient orbs */}
            <div className="fixed top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative aspect-[3/4] w-auto h-auto max-h-[80vh] flex items-center justify-center animate-scaleIn cursor-pointer bg-transparent">
                        <div className="relative w-full h-full">
                            <Image
                                src={selectedImage}
                                alt="Combo detail"
                                fill
                                className="object-contain drop-shadow-2xl rounded-lg"
                                quality={100}
                                priority
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Left Column - Images */}
                    <div>
                        <ImageGallery
                            images={images}
                            mainImage={images[0]}
                            onImageClick={setSelectedImage}
                        />
                    </div>

                    {/* Right Column - Product Details */}
                    <div className="space-y-8">
                        <div>
                            <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-sm font-medium rounded-full border border-amber-500/30 mb-4">
                                EXCLUSIVE COMBO
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                                {combo.name}
                            </h1>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="text-3xl font-bold text-amber-400">
                                    ₹{combo.price.toLocaleString("en-IN")}
                                </div>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className="text-amber-400 text-lg" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Included Items */}
                        <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
                            <h3 className="font-semibold text-amber-400 mb-4 flex items-center gap-2">
                                <HiSparkles className="text-amber-400" />
                                This Combo Includes:
                            </h3>
                            <div className="space-y-4">
                                {combo.ComboItem.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                                        {item.itemImage && (
                                            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                                <Image src={item.itemImage} alt={item.itemName} fill className="object-cover" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-white font-medium">{item.itemName}</p>
                                            {/* <p className="text-sm text-gray-400">Value: ₹{item.itemPrice.toLocaleString()}</p> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
                            <h3 className="font-semibold text-amber-400 mb-3 uppercase tracking-wider text-xs">Description</h3>
                            <p className="text-gray-300 leading-relaxed">
                                {combo.description || "A perfectly curated set for your wardrobe."}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <ActionButtons
                            onBuyNow={handleBuyNow}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
