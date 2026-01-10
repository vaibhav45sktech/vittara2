"use client";

import { useState, useEffect } from "react";
import { FaStar, FaEye, FaHeart } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { ReviewProvider, useReview } from "@/app/context/ReviewContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import products from "@/app/data/products";
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
}

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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
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
            className="object-contain drop-shadow-2xl"
            quality={100}
            priority
          />
        </div>
      </div>
    </div>
  );
};

function ProductListingInner({ sections, pageTitle, subTitle }: ProductListingProps) {
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
  
  const [filters, setFilters] = useState<Filters>({
    size: "",
    price: "",
    fabric: "",
    color: "",
  });

  const filterProducts = (productsToFilter: any[]): any[] => {
    return productsToFilter.filter((product) => {
      if (filters.price) {
        if (filters.price.includes("-")) {
          const [min, max] = filters.price.split("-").map(Number);
          if (max && (product.price < min || product.price > max)) return false;
          if (!max && product.price < min) return false;
        }
      }
      if (filters.size && filters.size !== "") return true;
      if (filters.fabric && filters.fabric !== "") return true;
      if (filters.color && filters.color !== "") return true;

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

  // Determine total products to show for filters count
  const allSectionProducts = products.filter(p => sections.some(s => s.category === p.category));

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#FFFFFF] via-[#F3F4F6] to-[#E5E7EB] pt-24 font-sans">
      <Navbar />
      <FloatingElements />
      {selectedImage && (
        <ImageModal 
          imageUrl={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}

      {/* Hero Header */}
      <section className="relative z-10 text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {pageTitle ? (
             <h1 className="text-4xl md:text-6xl font-bold text-[#000000] mb-4 tracking-wide">
                {pageTitle}
             </h1>
          ) : (
             <h1 className="text-4xl md:text-6xl font-bold text-[#000000] mb-4 tracking-wide">
                The <span className="text-[#000000] italic font-serif">FITTARA</span> Collection
             </h1>
          )}
          
          <p className="text-xl text-[#4B5563] mb-8 font-light">
            {subTitle || "Discover the perfect blend of comfort, style, and tradition."}
          </p>
        </div>
      </section>

      {/* Filters (Global) */}
      <div className="relative max-w-7xl mx-auto px-4 mb-16">
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
          <section key={section.id} className="relative z-10 px-4 pb-24 border-b border-[#000000]/20 last:border-0 mb-16">
            <div className="max-w-7xl mx-auto">
              
              {/* Section Header */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-start">
                <div>
                  <h2 className="text-3xl md:text-5xl font-bold text-[#000000] mb-6 font-serif leading-tight">
                    {section.title}
                  </h2>
                  <p className="text-lg text-[#5A4033] leading-relaxed mb-8">
                    {section.description}
                  </p>
                  
                  {/* Details & Care Grid - Only show if details exist */}
                  {(section.details || section.care) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {section.details && (
                        <div className="bg-white/60 p-6 rounded-xl border border-[#F3F4F6]">
                          <h3 className="font-semibold text-[#000000] mb-3 uppercase tracking-wider text-sm">Details</h3>
                          <ul className="space-y-2">
                            {section.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start text-[#5A4033] text-sm">
                                <span className="mr-2 text-[#000000]">•</span>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {section.care && (
                        <div className="bg-white/60 p-6 rounded-xl border border-[#F3F4F6]">
                          <h3 className="font-semibold text-[#000000] mb-3 uppercase tracking-wider text-sm">Care Instructions</h3>
                          <ul className="space-y-2">
                            {section.care.map((item, idx) => (
                              <li key={idx} className="flex items-start text-[#5A4033] text-sm">
                                <span className="mr-2 text-[#000000]">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                 <div className="hidden lg:block relative h-full min-h-[400px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#000000]/10 to-transparent rounded-3xl p-8 flex items-center justify-center border border-[#000000]/20">
                         <div className="text-center">
                            <div className="text-6xl font-serif text-[#000000]/20 mb-4 uppercase">
                                {section.id.split("-").pop()}
                            </div>
                            <span className="text-[#4B5563]/60 uppercase tracking-[0.5em] text-sm">Series</span>
                         </div>
                    </div>
                 </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                      className={`group relative transform transition-all duration-700 hover:scale-[1.02] ${
                        isLoaded ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                      } ${isHighlighted ? "ring-4 ring-[#000000] ring-offset-2 animate-pulse" : ""}`}
                      style={{ transitionDelay: `${index * 50}ms` }}
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      <div className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[#F3F4F6] hover:border-[#000000]/30 h-full flex flex-col">
                        
                        <div 
                            className="relative h-96 w-full overflow-hidden bg-gray-100 cursor-pointer"
                            onClick={() => setSelectedImage(product.image)}
                        >
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          
                          {hasThankYou && (
                            <div className="absolute inset-0 bg-[#000000]/90 flex items-center justify-center transition-all duration-500 z-30">
                              <div className="text-center text-white">
                                <FaStar className="text-4xl mx-auto mb-2 animate-bounce" />
                                <p className="text-lg font-semibold">Thank you for rating!</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-5 flex-grow flex flex-col bg-white">
                            <h3 className="font-semibold text-[#000000] line-clamp-2 group-hover:text-[#000000] transition-colors duration-300 leading-snug mb-2 text-lg">
                              {product.title}
                            </h3>

                            <div className="flex items-center justify-between mb-4">
                              <p className="text-xl font-bold text-[#000000]">₹{product.price.toLocaleString("en-IN")}</p>
                              
                              {productRating > 0 && (
                                <div className="flex items-center gap-1 text-sm text-[#4B5563] bg-[#FFFFFF] px-2 py-1 rounded-full">
                                  <FaStar className="text-[#000000] w-3 h-3" />
                                  <span className="font-medium">{productRating}</span>
                                </div>
                              )}
                            </div>

                            <div className="mt-auto space-y-4 pt-4 border-t border-gray-100">
                                <div className="flex flex-col gap-2">
                                    <SignedIn>
                                        <button
                                        onClick={() => addToCart({ ...product, color: "", size: 0 })}
                                        className="w-full py-2.5 cursor-pointer bg-[#000000] text-white text-sm font-semibold rounded-lg hover:bg-[#000000] transition-all duration-300 shadow-md transform hover:-translate-y-0.5"
                                        >
                                        Add to Cart
                                        </button>
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
                                        className={`w-full py-2.5 cursor-pointer text-sm font-semibold rounded-lg transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5 ${
                                            inWishlist ? "bg-red-50 text-red-500 border border-red-200" : "bg-white text-[#4B5563] border border-[#4B5563]/20 hover:border-[#000000]"
                                        }`}
                                        >
                                        <FaHeart className={inWishlist ? "text-red-500" : ""} />
                                        {inWishlist ? "In Wishlist" : "Add to Wishlist"}
                                        </button>
                                        <button
                                          onClick={() => {
                                              window.open("https://docs.google.com/forms/d/e/1FAIpQLSdXkEPO-4NSrIbXnjF_p2iKBHBYua4EIzYAW-EK3xb1x8lOUg/viewform", "_blank");
                                          }}
                                          className="w-full py-2.5 cursor-pointer bg-white text-[#000000] border border-[#000000] hover:bg-[#000000] hover:text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5"
                                        >
                                          Need Customization
                                        </button>
                                    </SignedIn>
                                    <SignedOut>
                                        <button disabled className="w-full py-2 bg-gray-200 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed">
                                            Sign in to Shop
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

      {(wishlistLoaded && (wishlistCount > 0 || localReviews.length > 0)) && (
        <section className="relative z-10 px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#F3F4F6] text-center shadow-xl">
              <h2 className="text-2xl font-bold text-[#000000] mb-6">
                Your Activity
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                  {wishlistCount > 0 && (
                    <Link
                    href="/wishlist"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-[#000000] text-[#000000] font-semibold rounded-xl hover:bg-[#000000] hover:text-white transition-all duration-300 shadow-lg"
                    >
                    <FaHeart />
                    View Wishlist ({wishlistCount})
                    </Link>
                  )}
                  {localReviews.length > 0 && (
                    <Link
                    href="/reviews"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#000000] text-white font-semibold rounded-xl hover:bg-[#3E2319] transition-all duration-300 shadow-lg"
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
      <ProductListingInner {...props} />
    </ReviewProvider>
  );
}
