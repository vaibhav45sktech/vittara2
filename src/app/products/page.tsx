"use client";

import { useState, useEffect} from "react";
import { FaStar, FaEye, FaHeart } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { ReviewProvider, useReview } from "@/app/context/ReviewContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import products from "@/app/data/products";
import Navbar from "../components/Navbar";
import ProductFilter from "../components/ProductFilter";

interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  description?: string;
}

interface Review {
  productId: number;
  productTitle: string;
  productImage: string;
  rating: number;
  timestamp: number;
}

// Filter types
interface Filters {
  size: string;
  price: string;
  fabric: string;
  color: string;
}

/* Floating decorative elements */
const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-pulse opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" className="text-amber-200/20 fill-current">
            <path d="M10 2c-3 0-5 2-5 5 0 2 1 3 2 4 1 1 2 2 2 3s1 2 3 2 3-1 3-2s-1-2-2-3-2-2-2-4c0-3-2-5-3-5z" />
          </svg>
        </div>
      ))}

      {[...Array(8)].map((_, i) => (
        <div
          key={`mandala-${i}`}
          className="absolute animate-bounce opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
          }}
        >
          <svg width="30" height="30" viewBox="0 0 30 30" className="text-orange-300/30 fill-current">
            <circle cx="15" cy="15" r="2" />
            <circle cx="15" cy="8" r="1" />
            <circle cx="15" cy="22" r="1" />
            <circle cx="8" cy="15" r="1" />
            <circle cx="22" cy="15" r="1" />
          </svg>
        </div>
      ))}
    </div>
  );
};

/* Inner page that uses hooks (must be inside ReviewProvider) */
function ProductsPageInner() {
  const { addToCart } = useCart();
  const { addReview } = useReview(); // Removed 'reviews' to fix the unused variable warning
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoaded: wishlistLoaded, wishlistCount } = useWishlist();

  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState<Record<number, number | null>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [highlightedProduct, setHighlightedProduct] = useState<number | null>(null);
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [showThankYou, setShowThankYou] = useState<Record<number, boolean>>({});
  
  // Filter state
  const [filters, setFilters] = useState<Filters>({
    size: "",
    price: "",
    fabric: "",
    color: "",
  });

  // Filter products based on filters
  const filterProducts = (products: Product[]): Product[] => {
    return products.filter((product) => {
      // Price filter
      if (filters.price) {
        if (filters.price.includes("-")) {
          const [min, max] = filters.price.split("-").map(Number);
          if (max && (product.price < min || product.price > max)) return false;
          if (!max && product.price < min) return false;
        }
      }
      if (filters.size && filters.size !== "") {
        return true;
      }
      if (filters.fabric && filters.fabric !== "") {
        return true;
      }
      if (filters.color && filters.color !== "") {
        return true;
      }

      return true;
    });
  };

  const filteredProducts = filterProducts(products);

  // Load reviews from localStorage
  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    setLocalReviews(storedReviews);
  }, []);

  useEffect(() => {
    setIsLoaded(true);

    // Scroll to hash if exists
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      const element = document.querySelector(hash);
      if (element) {
        const productId = parseInt(hash.replace("#product-", ""), 10);
        setHighlightedProduct(productId);

        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });

          // Remove highlight after 5 seconds
          setTimeout(() => setHighlightedProduct(null), 5000);
        }, 100);
      }
    }
  }, []);

  // Handle star rating
  const handleStarRating = (product: Product, rating: number) => {
    const newReview: Review = {
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      rating: rating,
      timestamp: Date.now()
    };

    // Update localStorage
    const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const existingIndex = existingReviews.findIndex((r: Review) => r.productId === product.id);
    
    if (existingIndex >= 0) {
      existingReviews[existingIndex] = newReview;
    } else {
      existingReviews.push(newReview);
    }
    
    localStorage.setItem('reviews', JSON.stringify(existingReviews));
    setLocalReviews(existingReviews);

    // Add to context if available
    if (addReview) {
      addReview({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        rating: rating,
      });
    }

    // Show thank you message
    setShowThankYou(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setShowThankYou(prev => ({ ...prev, [product.id]: false }));
    }, 3000);
  };

  // Get product rating from localStorage
  const getProductRating = (productId: number): number => {
    const review = localReviews.find(r => r.productId === productId);
    return review ? review.rating : 0;
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#F5F1EA] via-[#E9DCCF] to-[#DDD0BF] pt-24">
      <Navbar />
      <FloatingElements />

      {/* Hero */}
      <section className="relative z-10 text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-[#2C1810] mb-4 tracking-wide">
            Explore Our
            <span className="block text-[#D2691E] italic font-serif">Traditional Collection</span>
          </h1>
          <p className="text-xl text-[#8B4513] mb-8 font-light">
            Handcrafted elegance, perfect for weddings, festivals, and celebrations
          </p>
          <div className="flex justify-center space-x-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-[#D2691E] text-2xl animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>

          {/* Reviews Link */}
          {localReviews.length > 0 && (
            <div className="mt-8">
              <Link
                href="/review"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#8B4513] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaEye className="text-white" />
                View Your Reviews ({localReviews.length})
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Filters + Products */}
      <div className="relative max-w-7xl mx-auto px-4">
        <ProductFilter
          filters={filters}
          onFiltersChange={setFilters}
          resultsCount={filteredProducts.length}
        />
      </div>

      {/* Products Section */}
      <section className="relative z-10 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product: Product, index: number) => {
              const isHighlighted = highlightedProduct === product.id;
              const productRating = getProductRating(product.id);
              const currentHoveredStar = hoveredStar[product.id];
              const displayRating = currentHoveredStar ?? productRating;
              const hasThankYou = showThankYou[product.id];
              const inWishlist = wishlistLoaded ? isInWishlist(product.id) : false;

              return (
                <div
                  key={product.id}
                  id={`product-${product.id}`}
                  className={`group relative transform transition-all duration-700 hover:scale-105 ${
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                  } ${isHighlighted ? "ring-4 ring-[#D2691E] ring-offset-2 animate-pulse" : ""}`}
                  style={{
                    transitionDelay: `${index * 50}ms`,
                    animation: isLoaded ? `slideUp 0.8s ease-out ${index * 0.05}s both` : "none",
                  }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Card */}
                  <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-[#E9DCCF] hover:border-[#D2691E]/30">
                    <div className="relative h-80 w-full overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Thank you overlay */}
                      {hasThankYou && (
                        <div className="absolute inset-0 bg-[#D2691E]/90 flex items-center justify-center transition-all duration-500">
                          <div className="text-center text-white">
                            <FaStar className="text-4xl mx-auto mb-2 animate-bounce" />
                            <p className="text-lg font-semibold">Thank you for rating!</p>
                            <p className="text-sm opacity-90">Your review has been saved</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-4 bg-gradient-to-b from-white to-[#F5F1EA]/50">
                      <h3 className="font-semibold text-[#2C1810] line-clamp-2 group-hover:text-[#D2691E] transition-colors duration-300 leading-snug">
                        {product.title}
                      </h3>

                      {/* Price + Rating Display */}
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-[#D2691E]">₹{product.price.toLocaleString("en-IN")}</p>
                        
                        {productRating > 0 && (
                          <div className="flex items-center gap-1 text-sm text-[#8B4513]">
                            <FaStar className="text-[#D2691E]" />
                            <span className="font-medium">({productRating}/5)</span>
                          </div>
                        )}
                      </div>

                      {/* Interactive Star Rating */}
                      <SignedIn>
                        <div className="space-y-2">
                          <p className="text-sm text-[#8B4513] font-medium">Rate this product:</p>
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => {
                              const starValue = i + 1;
                              const isActive = displayRating >= starValue;

                              return (
                                <button
                                  key={i}
                                  className="transition-all duration-200 transform hover:scale-110 focus:outline-none"
                                  onClick={() => handleStarRating(product, starValue)}
                                  onMouseEnter={() => setHoveredStar((prev) => ({ ...prev, [product.id]: starValue }))}
                                  onMouseLeave={() => setHoveredStar((prev) => ({ ...prev, [product.id]: null }))}
                                >
                                  <FaStar
                                    className={`text-lg ${
                                      isActive ? "text-[#D2691E]" : "text-gray-300"
                                    } hover:text-[#D2691E] transition-colors duration-200 cursor-pointer`}
                                  />
                                </button>
                              );
                            })}
                          </div>
                          
                          {productRating > 0 && (
                            <p className="text-xs text-[#8B4513]/70">
                              You rated this product {productRating} star{productRating > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </SignedIn>

                      {/* Signed-out users see disabled stars */}
                      <SignedOut>
                        <div className="space-y-2">
                          <p className="text-sm text-[#8B4513] font-medium">Rate this product:</p>
                          <div className="flex items-center gap-1 opacity-60 cursor-not-allowed">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar key={star} className="text-lg text-gray-300" />
                            ))}
                            <span className="text-xs text-[#8B4513]/70 ml-2">
                              Sign in to rate
                            </span>
                          </div>
                        </div>
                      </SignedOut>

                      {/* Add to Cart Button */}
                      <SignedIn>
                        <button
                          onClick={() => addToCart({ ...product, color: "", size: 0 })}
                          className="w-full py-3 bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#8B4513] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-[#8B4513]/20 cursor-pointer"
                        >
                          Add to Cart
                        </button>
                      </SignedIn>
                      <SignedOut>
                        <button
                          disabled
                          className="w-full py-3 bg-gray-400 text-white font-semibold rounded-xl cursor-not-allowed"
                        >
                          Sign in to Add to Cart
                        </button>
                      </SignedOut>

                      {/* Add to Wishlist Button */}
                      <SignedIn>
                        <button
                          onClick={() =>
                            inWishlist
                              ? removeFromWishlist(product.id)
                              : addToWishlist({
                                  id: product.id,
                                  title: product.title,
                                  image: product.image,
                                  price: product.price,
                                  color: "",
                                  size: 0
                                })
                          }
                          className="w-full py-3 bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#8B4513] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
                        >
                          <FaHeart className="text-white" />
                          {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                        </button>
                      </SignedIn>
                      <SignedOut>
                        <button
                          disabled
                          className="w-full py-3 bg-gray-400 text-white font-semibold rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <FaHeart className="text-white" />
                          Sign in to use Wishlist
                        </button>
                      </SignedOut>
                    </div>

                    {/* Sparkle hover effect */}
                    {hoveredProduct === product.id && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-12 right-12 animate-ping">
                          <div className="w-2 h-2 bg-[#D2691E] rounded-full"></div>
                        </div>
                        <div className="absolute bottom-12 left-12 animate-ping" style={{ animationDelay: "0.5s" }}>
                          <div className="w-1 h-1 bg-[#8B4513] rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Wishlist Summary Section */}
      {wishlistLoaded && (
        <section className="relative z-10 px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#E9DCCF] text-center">
              <h2 className="text-2xl font-bold text-[#2C1810] mb-4">
                Your Wishlist Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-[#D2691E]">
                    {wishlistCount}
                  </div>
                  <div className="text-sm text-[#8B4513] font-medium">
                    Items in Wishlist
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-[#D2691E]">
                    {localReviews.length}
                  </div>
                  <div className="text-sm text-[#8B4513] font-medium">
                    Products Reviewed
                  </div>
                </div>
              </div>
              {wishlistCount > 0 && (
                <Link
                  href="/wishlist"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#8B4513] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl mr-4"
                >
                  <FaHeart className="text-white" />
                  View Wishlist ({wishlistCount})
                </Link>
              )}
              {localReviews.length > 0 && (
                <Link
                  href="/reviews"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#8B4513] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FaEye className="text-white" />
                  View All Reviews ({localReviews.length})
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Review Summary Section */}
      {localReviews.length > 0 && (
        <section className="relative z-10 px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#E9DCCF] text-center">
              <h2 className="text-2xl font-bold text-[#2C1810] mb-4">
                Your Review Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-[#D2691E]">
                    {localReviews.length}
                  </div>
                  <div className="text-sm text-[#8B4513] font-medium">
                    Products Reviewed
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-[#D2691E]">
                    {(localReviews.reduce((sum, review) => sum + review.rating, 0) / localReviews.length).toFixed(1)} ★
                  </div>
                  <div className="text-sm text-[#8B4513] font-medium">
                    Average Rating
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-[#D2691E]">
                    {localReviews.filter(r => r.rating === 5).length}
                  </div>
                  <div className="text-sm text-[#8B4513] font-medium">
                    5-Star Reviews
                  </div>
                </div>
              </div>
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#8B4513] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaEye className="text-white" />
                View All Reviews ({localReviews.length})
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Animations */}
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
      `}</style>
    </main>
  );
}

/* Export default — wrapped with ReviewProvider so useReview works safely */
export default function ProductsPage() {
  return (
    <ReviewProvider>
      <ProductsPageInner />
    </ReviewProvider>
  );
}