"use client";

import { useState, useEffect, Suspense } from "react";
import { FaStar, FaEye, FaHeart } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { ReviewProvider, useReview } from "@/app/context/ReviewContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Navbar from "./Navbar";
import ProductFilter from "./ProductFilter";
// Interfaces
interface Review {
  productId: number;
  productTitle: string;
  productImage: string;
  rating: number;
  timestamp: number;
}

interface Filters {
  size: string;
  price: string;
  fabric: string;
  color: string;
}

interface Section {
  id: string;
  category: "modern" | "classic" | "shirt";
  title: string;
  description: string;
  details?: string[];
  care?: string[];
}

interface ProductListingProps {
  sections: Section[];
  pageTitle?: string;
  subTitle?: string;
  initialProducts?: any[];
}

const FloatingElements = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
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

const ImageModal = ({
  imageUrl,
  onClose,
}: {
  imageUrl: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative aspect-[3/4] 
          w-auto h-auto
          landscape:h-[70vh] landscape:w-auto
          portrait:w-[90vw] portrait:max-w-md portrait:h-auto
          max-h-[75vh]
          flex items-center justify-center animate-scaleIn cursor-pointer bg-transparent"
      >
        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt="Product detail"
            fill
            className="object-contain drop-shadow-2xl rounded-lg"
            quality={100}
            priority
          />
        </div>
      </div>
    </div>
  );
};

function ProductListingInner({ sections, pageTitle, subTitle, initialProducts }: ProductListingProps) {
  const { addToCart } = useCart();
  const { addReview } = useReview();
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoaded: wishlistLoaded, wishlistCount } = useWishlist();

  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState<Record<number, number | null>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [highlightedProduct, setHighlightedProduct] = useState<number | null>(null);
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [showThankYou, setShowThankYou] = useState<Record<number, boolean>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>(initialProducts || []);

  const [filters, setFilters] = useState<Filters>({
    size: "",
    price: "",
    fabric: "",
    color: "",
  });

  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    } else {
      setSearchQuery("");
    }
  }, [searchParams]);

  const filterProducts = (productsToFilter: any[]): any[] => {
    return productsToFilter.filter((product) => {
      if (filters.price) {
        if (filters.price.includes("-")) {
          const [min, max] = filters.price.split("-").map(Number);
          if (max && (product.price < min || product.price > max)) return false;
          if (!max && product.price < min) return false;
        }
      }
      if (filters.size && filters.size !== "") {
        // Filter by size if applicable
        if (product.size && !product.size.toLowerCase().includes(filters.size.toLowerCase())) return false;
      }
      if (filters.fabric && filters.fabric !== "") {
        // Filter by fabric if applicable
        if (product.fabric && !product.fabric.toLowerCase().includes(filters.fabric.toLowerCase())) return false;
      }
      if (filters.color && filters.color !== "") {
        // Filter by color if applicable
        if (product.color && !product.color.toLowerCase().includes(filters.color.toLowerCase())) return false;
      }

      if (searchQuery) {
        if (!product.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  };

  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    setLocalReviews(storedReviews);
    setIsLoaded(true);

    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      const element = document.querySelector(hash);
      if (element) {
        const productId = parseInt(hash.replace("#product-", ""), 10);
        setHighlightedProduct(productId);
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => setHighlightedProduct(null), 5000);
        }, 100);
      }
    }
  }, []);

  const getProductRating = (productId: number): number => {
    const review = localReviews.find(r => r.productId === productId);
    return review ? review.rating : 0;
  };

  const allSectionProducts = products.filter(p => sections.some(s => s.category === p.category));

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 font-sans">
      <Navbar />
      <FloatingElements />

      {/* Decorative gradient orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {/* Hero Header */}
      <section className="relative z-10 text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
            <HiSparkles className="text-amber-400" />
            <span className="text-amber-400 text-sm font-medium tracking-wide">Exquisite</span>
          </div>

          {pageTitle ? (
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wide">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent italic font-serif">
                Premium Collection
              </span>
            </h1>
          ) : (
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wide">
              The <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent italic font-serif">Fittara</span> Collection
            </h1>
          )}

          <p className="text-lg text-gray-400 mb-4 font-light">
            {subTitle || "Tailored perfection, designed for the modern connoisseur"}
          </p>

          {/* Rating Stars */}
          <div className="flex items-center justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-amber-400 text-lg" />
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="relative max-w-7xl mx-auto px-4 mb-12">
        <ProductFilter
          filters={filters}
          onFiltersChange={setFilters}
          resultsCount={filterProducts(allSectionProducts).length}
        />
      </div>

      {/* SECTIONS */}
      {sections.map((section) => {
        const sectionProducts = products.filter(p => p.category === section.category);
        const displayedProducts = filterProducts(sectionProducts);

        if (displayedProducts.length === 0) return null;

        return (
          <section key={section.id} className="relative z-10 px-4 pb-20 mb-12">
            <div className="max-w-7xl mx-auto">

              {/* Section Header */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-start">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif leading-tight">
                    {section.title}
                  </h2>
                  <p className="text-base text-gray-400 leading-relaxed mb-8">
                    {section.description}
                  </p>

                  {/* Details & Care Grid */}
                  {(section.details || section.care) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {section.details && (
                        <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border border-gray-700/50">
                          <h3 className="font-semibold text-amber-400 mb-3 uppercase tracking-wider text-xs">Details</h3>
                          <ul className="space-y-2">
                            {section.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start text-gray-300 text-sm">
                                <span className="mr-2 text-amber-500">•</span>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {section.care && (
                        <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border border-gray-700/50">
                          <h3 className="font-semibold text-amber-400 mb-3 uppercase tracking-wider text-xs">Care Instructions</h3>
                          <ul className="space-y-2">
                            {section.care.map((item, idx) => (
                              <li key={idx} className="flex items-start text-gray-300 text-sm">
                                <span className="mr-2 text-amber-500">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="hidden lg:block relative h-full min-h-[350px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-3xl p-8 flex items-center justify-center border border-amber-500/10">
                    <div className="text-center">
                      <div className="text-7xl font-serif text-amber-500/20 mb-4 uppercase">
                        {section.id.split("-").pop()}
                      </div>
                      <span className="text-gray-500 uppercase tracking-[0.5em] text-xs">Series</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedProducts.map((product: any, index: number) => {
                  const isHighlighted = highlightedProduct === product.id;
                  const productRating = getProductRating(product.id);
                  const currentHoveredStar = hoveredStar[product.id];
                  const hasThankYou = showThankYou[product.id];
                  const inWishlist = wishlistLoaded ? isInWishlist(product.id) : false;

                  return (
                    <div
                      key={product.id}
                      id={`product-${product.id}`}
                      className={`group relative transform transition-all duration-500 hover:scale-[1.02] ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                        } ${isHighlighted ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-gray-900" : ""}`}
                      style={{ transitionDelay: `${index * 50}ms` }}
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      <div className="relative bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-amber-500/30 transition-all duration-500 h-full flex flex-col shadow-xl hover:shadow-2xl hover:shadow-amber-500/5">

                        {/* Product Image - Now links to product page */}
                        <Link
                          href={`/products/${product.originalId || product.id}`}
                          className="relative h-80 w-full overflow-hidden bg-gray-800 cursor-pointer block"
                        >
                          <Image
                            src={product.images && product.images.length > 0 ? product.images[0] : product.image}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Product Link Indicator */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-amber-500/20 backdrop-blur-sm p-3 rounded-full border border-amber-500/30">
                              <FaEye className="text-amber-400 text-lg" />
                            </div>
                          </div>

                          {hasThankYou && (
                            <div className="absolute inset-0 bg-amber-500/90 flex items-center justify-center transition-all duration-500 z-30">
                              <div className="text-center text-white">
                                <FaStar className="text-4xl mx-auto mb-2 animate-bounce" />
                                <p className="text-lg font-semibold">Thank you for rating!</p>
                              </div>
                            </div>
                          )}
                        </Link>

                        {/* Product Info */}
                        <div className="p-5 flex-grow flex flex-col">
                          <h3 className="font-semibold text-white line-clamp-2 group-hover:text-amber-400 transition-colors duration-300 leading-snug mb-2 text-base">
                            <Link href={`/products/${product.originalId || product.id}`} className="hover:text-amber-400 transition-colors duration-300">
                              {product.title}
                            </Link>
                          </h3>

                          <div className="flex items-center justify-between mb-4">
                            <p className="text-xl font-bold text-amber-400">₹{product.price.toLocaleString("en-IN")}</p>

                            {productRating > 0 && (
                              <div className="flex items-center gap-1 text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                                <FaStar className="text-amber-400 w-3 h-3" />
                                <span className="font-medium">{productRating}</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-auto space-y-3 pt-4 border-t border-gray-700/50">
                            <div className="flex flex-col gap-2">
                              <SignedIn>
                                <button
                                  onClick={() => addToCart({ ...product, color: "", size: 0, fit: "" })}
                                  className="w-full py-2.5 cursor-pointer bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 text-sm font-semibold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-lg shadow-amber-500/20 transform hover:-translate-y-0.5"
                                >
                                  Add to Cart
                                </button>
                                <button
                                  onClick={() => {
                                    addToCart({ ...product, color: "", size: 0, fit: "" });
                                    window.location.href = "/account";
                                  }}
                                  className="w-full py-2.5 cursor-pointer bg-white text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 border border-gray-200"
                                >
                                  Buy Now
                                </button>
                                <button
                                  onClick={() =>
                                    inWishlist
                                      ? removeFromWishlist(product.id)
                                      : addToWishlist({
                                        id: product.id,
                                        title: product.title,
                                        image: product.images && product.images.length > 0 ? product.images[0] : product.image,
                                        price: product.price,
                                        color: "",
                                        size: 0
                                      })
                                  }
                                  className={`w-full py-2.5 cursor-pointer text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5 ${inWishlist
                                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                    : "bg-gray-800 text-gray-300 border border-gray-600 hover:border-amber-500/50 hover:text-amber-400"
                                    }`}
                                >
                                  <FaHeart className={inWishlist ? "text-red-400" : ""} />
                                  {inWishlist ? "In Wishlist" : "Add to Wishlist"}
                                </button>
                                <button
                                  onClick={() => {
                                    window.open("https://docs.google.com/forms/d/e/1FAIpQLSdXkEPO-4NSrIbXnjF_p2iKBHBYua4EIzYAW-EK3xb1x8lOUg/viewform", "_blank");
                                  }}
                                  className="w-full py-2.5 cursor-pointer bg-transparent text-amber-400 border border-amber-500/50 hover:bg-amber-500/10 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5"
                                >
                                  Need Customization
                                </button>
                              </SignedIn>
                              <SignedOut>
                                <button className="w-full py-2.5 bg-gray-800 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed border border-gray-700">
                                  Sign in to Add to Cart
                                </button>
                              </SignedOut>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* Activity Section */}
      {(wishlistLoaded && (wishlistCount > 0 || localReviews.length > 0)) && (
        <section className="relative z-10 px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center">
              <h2 className="text-2xl font-bold text-white mb-6">
                Your Activity
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {wishlistCount > 0 && (
                  <Link
                    href="/wishlist"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gray-700/50 border border-gray-600 text-white font-semibold rounded-xl hover:bg-amber-500/20 hover:border-amber-500/50 hover:text-amber-400 transition-all duration-300"
                  >
                    <FaHeart className="text-red-400" />
                    View Wishlist ({wishlistCount})
                  </Link>
                )}
                {localReviews.length > 0 && (
                  <Link
                    href="/reviews"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-semibold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-lg"
                  >
                    <FaEye />
                    Your Reviews ({localReviews.length})
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
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

export default function ProductListing(props: ProductListingProps) {
  return (
    <ReviewProvider>
      <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-amber-400">Loading...</div>}>
        <ProductListingInner {...props} />
      </Suspense>
    </ReviewProvider>
  );
}
