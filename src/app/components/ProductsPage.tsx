"use client";

import { useState, useEffect } from "react";
import { FaStar, FaHeart, FaFilter } from "react-icons/fa";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import products from "../data/productsDetails";
import Link from "next/link";
import { useWishlist } from "@/app/context/WishlistContext";
import ProductFilter from "./ProductFilter";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs"; // ✅ Added Clerk imports
import { useRouter } from "next/navigation";

// Product and Filter types
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  size: string;
  fabric: string;
  color: string;
  images: string[];
  videoUrl?: string;
}

interface Filters {
  size: string;
  price: string;
  fabric: string;
  color: string;
}

interface Review {
  productId: number;
  productTitle: string;
  productImage: string;
  rating: number;
  timestamp: number;
}

const FloatingElements = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            className="text-amber-200/20 fill-current"
          >
            <path d="M10 2c-3 0-5 2-5 5 0 2 1 3 2 4 1 1 2 2 2 3s1 2 3 2 3-1 3-2s-1-2-2-3-2-2-2-4c0-3-2-5-3-5z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

// Star Rating Component
const StarRating = ({
  productId,
  productTitle,
  productImage,
  currentRating,
  onRate,
}: {
  productId: number;
  productTitle: string;
  productImage: string;
  currentRating: number;
  onRate: (rating: number) => void;
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(currentRating);

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    onRate(rating);

    // Add to reviews
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    const existingReviewIndex = reviews.findIndex(
      (r: Review) => r.productId === productId
    );

    const newReview: Review = {
      productId,
      productTitle,
      productImage,
      rating,
      timestamp: Date.now(),
    };

    if (existingReviewIndex >= 0) {
      reviews[existingReviewIndex] = newReview;
    } else {
      reviews.push(newReview);
    }

    localStorage.setItem("reviews", JSON.stringify(reviews));
  };

  return (
    <>
      {/* ✅ Only signed-in users can rate */}
      <SignedIn>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="transition-all duration-200 transform hover:scale-110"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => handleStarClick(star)}
            >
              <FaStar
                className={`text-lg ${
                  star <= (hoveredRating || selectedRating)
                    ? "text-[#D2691E]"
                    : "text-gray-300"
                } hover:text-[#D2691E] transition-colors duration-200 cursor-pointer`}
              />
            </button>
          ))}
          {selectedRating > 0 && (
            <span className="text-sm text-[#8B4513] ml-2 font-medium">
              ({selectedRating}/5)
            </span>
          )}
        </div>
      </SignedIn>

      {/* ✅ Signed-out users see disabled stars */}
      <SignedOut>
        <div className="flex items-center gap-1 opacity-60 cursor-not-allowed">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar key={star} className="text-lg text-gray-300" />
          ))}
          <span className="text-xs text-[#8B4513]/70 ml-2">
            Sign in to rate
          </span>
        </div>
      </SignedOut>
    </>
  );
};

const ProductRow = ({
  product,
  index,
}: {
  product: Product;
  index: number;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const { addToCart } = useCart();
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isLoaded: wishlistLoaded,
  } = useWishlist();

  const { isSignedIn } = useUser();
  const router = useRouter();

  const inWishlist = wishlistLoaded ? isInWishlist(product.id) : false;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [product.images.length]);

  // Load existing rating
  useEffect(() => {
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    const existingReview = reviews.find(
      (r: Review) => r.productId === product.id
    );
    if (existingReview) {
      setUserRating(existingReview.rating);
    }
  }, [product.id]);

  const handleRating = (rating: number) => {
    setUserRating(rating);
  };

  return (
    <div
      className={`transform transition-all duration-1000 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-[#E9DCCF] hover:border-[#D2691E]/30 overflow-hidden transition-all duration-500 hover:shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Image Gallery Section */}
          <div className="relative bg-gradient-to-br from-[#F5F1EA] to-[#E9DCCF] p-6">
            <div className="grid grid-cols-2 grid-rows-2 gap-3 h-80">
              {product.images.slice(0, 4).map((image: string, idx: number) => (
                <div
                  key={idx}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
                    currentImageIndex === idx ? "ring-4 ring-[#D2691E]" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <Image
                    src={image}
                    alt={`${product.title} pose ${idx + 1}`}
                    fill
                    className="object-contain transition-transform duration-300"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              {/* Add to Cart Button - Redirects if not signed in */}
              <button
                onClick={() => {
                  if (!isSignedIn) {
                    router.push("/sign-in");
                    return;
                  }
                  addToCart({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.images[0],
                    color: "",
                    size: 0
                  });
                }}
                className="w-full py-3 bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#8B4513] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
              >
                {isSignedIn
                  ? `Add to Cart - ₹${product.price.toLocaleString("en-IN")}`
                  : "Sign in to Add to Cart"}
              </button>

              <button
                onClick={() => {
                  if (!isSignedIn) {
                    router.push("/sign-in");
                    return;
                  }
                  if (inWishlist) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist({
                      id: product.id,
                      title: product.title,
                      image: product.images[0],
                      price: 0,
                      size: 0,
                      color: ""
                    });
                  }
                }}
                className="w-full py-3 bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#8B4513] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
              >
                <FaHeart className="text-white" />
                {isSignedIn
                  ? inWishlist
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"
                  : "Sign in to use Wishlist"}
              </button>
            </div>
          </div>

          {/* Video Section - Only render if videoUrl exists */}
          {product.videoUrl && (
            <div className="relative bg-black/5 p-6 flex items-center justify-center">
              <div className="relative w-full h-[450px] rounded-2xl overflow-hidden bg-black shadow-2xl">
                <video
                  src={product.videoUrl}
                  className="w-full h-full object-cover"
                  poster={product.images[0]}
                  muted
                  autoPlay
                  loop
                />
              </div>
            </div>
          )}

          {/* Description Section */}
          <div className="p-8 flex flex-col justify-between bg-gradient-to-br from-white to-[#F5F1EA]/30">
            <div>
              <h3 className="text-2xl font-bold text-[#2C1810] mb-4 leading-tight">
                {product.title}
              </h3>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-[#D2691E]">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Interactive Star Rating */}
              <div className="mb-4">
                <p className="text-sm text-[#8B4513] mb-2 font-medium">
                  Rate this product:
                </p>
                <StarRating
                  productId={product.id}
                  productTitle={product.title}
                  productImage={product.images[0]}
                  currentRating={userRating}
                  onRate={handleRating}
                />
                {userRating > 0 && (
                  <p className="text-xs text-[#8B4513]/70 mt-1">
                    Thank you for your rating!
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-[#E9DCCF] rounded-lg p-2 text-center">
                  <div className="text-xs text-[#8B4513] font-medium">Size</div>
                  <div className="text-sm font-bold text-[#2C1810]">
                    {product.size}
                  </div>
                </div>
                <div className="bg-[#E9DCCF] rounded-lg p-2 text-center">
                  <div className="text-xs text-[#8B4513] font-medium">
                    Fabric
                  </div>
                  <div className="text-sm font-bold text-[#2C1810] capitalize">
                    {product.fabric}
                  </div>
                </div>
                <div className="bg-[#E9DCCF] rounded-lg p-2 text-center">
                  <div className="text-xs text-[#8B4513] font-medium">
                    Color
                  </div>
                  <div className="text-sm font-bold text-[#2C1810] capitalize">
                    {product.color}
                  </div>
                </div>
              </div>

              <p className="text-[#8B4513] leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E9DCCF]">
              <div className="flex items-center justify-between text-xs text-[#8B4513]">
                <span>Handcrafted with Care</span>
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductsPage() {
  const { wishlistCount, isLoaded: wishlistLoaded } = useWishlist();

  const [filters, setFilters] = useState<Filters>({
    size: "",
    price: "",
    fabric: "",
    color: "",
  });

  // Filter logic
  const filteredProducts = products.filter((product: Product) => {
    const matchesSize = filters.size ? product.size === filters.size : true;
    const matchesPrice = filters.price
      ? (() => {
          const [min, max] = filters.price.split("-").map(Number);
          return product.price >= min && product.price <= (max || Infinity);
        })()
      : true;
    const matchesFabric = filters.fabric
      ? product.fabric === filters.fabric
      : true;
    const matchesColor = filters.color ? product.color === filters.color : true;

    return matchesSize && matchesPrice && matchesFabric && matchesColor;
  });

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#F5F1EA] via-[#E9DCCF] to-[#DDD0BF] pt-20 overflow-x-hidden">
      <FloatingElements />

      {/* Hero Section */}
      <div className="relative z-10 text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-[#2C1810] mb-4 tracking-wide">
            Exquisite
            <span className="block text-[#D2691E] italic font-serif">
               Premium Collection
            </span>
          </h1>
          <p className="text-xl text-[#8B4513] mb-8 font-light">
            Tailored perfection, designed for the modern connoisseur
          </p>

          <div className="flex justify-center space-x-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className="text-[#D2691E] text-2xl animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Filters + Products */}
      <div className="relative max-w-7xl mx-auto px-4">
        <ProductFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          resultsCount={filteredProducts.length}
        />
      </div>
      <div className="relative z-auto px-4 pb-16 max-w-7xl mx-auto">
        <div className="flex gap-6">
          {/* Products */}
          <div className="flex-1 space-y-8">
            {filteredProducts.map((product, index) => (
              <ProductRow key={product.id} product={product} index={index} />
            ))}

            {/* No Products Found */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-[#E9DCCF]">
                <FaFilter className="text-4xl text-[#D2691E] mx-auto mb-4" />
                <p className="text-xl text-[#8B4513] font-medium mb-2">
                  No products found matching your filters.
                </p>
                <p className="text-sm text-[#8B4513]/70">
                  Try adjusting your filters or clear all filters to see all
                  products.
                </p>
                <button
                  onClick={() =>
                    setFilters({ size: "", price: "", fabric: "", color: "" })
                  }
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white font-semibold rounded-lg hover:from-[#D2691E] hover:to-[#8B4513] transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Wishlist Summary */}
            <div className="mt-12 text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#E9DCCF] relative z-10">
              <div className="mb-4">
                {!wishlistLoaded ? (
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded mx-auto w-48 mb-4"></div>
                  </div>
                ) : (
                  <p className="text-[#8B4513] text-lg font-medium">
                    {wishlistCount === 0
                      ? "Your wishlist is empty"
                      : `You have ${wishlistCount} item${
                          wishlistCount === 1 ? "" : "s"
                        } in your wishlist`}
                  </p>
                )}
              </div>

              {wishlistLoaded && wishlistCount > 0 && (
                <Link
                  href="/wishlist"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#8B4513] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FaHeart className="text-white" />
                  View Wishlist ({wishlistCount})
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-6 {
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}
