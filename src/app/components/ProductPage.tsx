"use client";

import { useState, useEffect } from "react";
import { FaStar, FaHeart, FaShoppingCart, FaEye, FaRulerCombined, FaTag, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Navbar from "./Navbar";
// Import the product type from data
import type { Product as DataProduct } from "@/app/data/products";
import type { Product as CartProduct } from "@/types";
import { addProductReview, getProductReviews } from "@/app/actions/productActions";

// Use the data product type
type Product = DataProduct;

interface ProductPageProps {
  product: Product;
  relatedProducts?: Product[];
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

  useEffect(() => {
    setSelectedImage(mainImage);
  }, [mainImage]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gray-800 cursor-pointer group"
        onClick={() => onImageClick(selectedImage)}
      >
        <Image
          src={selectedImage}
          alt="Product main view"
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
              className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                selectedImage === image 
                  ? 'border-amber-500 shadow-lg shadow-amber-500/30' 
                  : 'border-gray-700 hover:border-amber-500/50'
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`Product view ${index + 1}`}
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

const SizeSelector = ({ sizes, selectedSize, onSelect }: { 
  sizes: string[]; 
  selectedSize: string; 
  onSelect: (size: string) => void;
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <FaRulerCombined className="text-amber-400" />
        Select Size
      </h3>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 border-2 ${
              selectedSize === size
                ? 'bg-amber-500 text-gray-900 border-amber-500 shadow-lg shadow-amber-500/30'
                : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-amber-500/50 hover:text-amber-400'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

const ColorSwatches = ({ colors, selectedColor, onSelect }: { 
  colors: string[]; 
  selectedColor: string; 
  onSelect: (color: string) => void;
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">Colors</h3>
      <div className="flex flex-wrap gap-3">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => onSelect(color)}
            className={`w-10 h-10 rounded-full border-2 transition-all duration-300 relative ${
              selectedColor === color
                ? 'border-amber-400 shadow-lg shadow-amber-500/50 scale-110'
                : 'border-gray-600 hover:border-amber-500/50'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Color ${color}`}
          >
            {selectedColor === color && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const ProductDetails = ({ product }: { product: Product }) => {
  return (
    <div className="space-y-6">
      <div>
        <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-sm font-medium rounded-full border border-amber-500/30 mb-4">
          {product.tag}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          {product.title}
        </h1>
        <div className="flex items-center gap-4 mb-6">
          <div className="text-3xl font-bold text-amber-400">
            ₹{product.price.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-amber-400 text-lg" />
            ))}
            <span className="text-gray-400 ml-2">(4.8)</span>
          </div>
        </div>
      </div>

      {/* Product Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border border-gray-700/50">
          <h3 className="font-semibold text-amber-400 mb-3 uppercase tracking-wider text-xs">Fabric</h3>
          <p className="text-gray-300 capitalize">{product.fabric}</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border border-gray-700/50">
          <h3 className="font-semibold text-amber-400 mb-3 uppercase tracking-wider text-xs">Color</h3>
          <p className="text-gray-300 capitalize">{product.color}</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border border-gray-700/50">
          <h3 className="font-semibold text-amber-400 mb-3 uppercase tracking-wider text-xs">Category</h3>
          <p className="text-gray-300 capitalize">{product.category}</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border border-gray-700/50">
          <h3 className="font-semibold text-amber-400 mb-3 uppercase tracking-wider text-xs">Size</h3>
          <p className="text-gray-300">{product.size}</p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
        <h3 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
          <HiSparkles className="text-amber-400" />
          Product Details
        </h3>
        <p className="text-gray-300 leading-relaxed">
          Experience unparalleled craftsmanship with this exquisite piece. 
          Designed for the discerning individual who appreciates quality and style. 
          Perfect for both casual and formal occasions, this garment combines 
          comfort with sophistication.
        </p>
      </div>
    </div>
  );
};

const ActionButtons = ({ 
  product, 
  selectedSize, 
  selectedColor,
  inWishlist,
  onAddToCart,
  onAddToWishlist,
  onBuyNow
}: { 
  product: Product;
  selectedSize: string;
  selectedColor: string;
  inWishlist: boolean;
  onAddToCart: () => void;
  onAddToWishlist: () => void;
  onBuyNow: () => void;
}) => {
  return (
    <div className="space-y-4">
      <SignedIn>
        <button
          onClick={onAddToCart}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-bold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-lg shadow-amber-500/30 transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
        >
          <FaShoppingCart />
          Add to Cart
        </button>
        
        <button
          onClick={onBuyNow}
          className="w-full py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:-translate-y-1 border border-gray-200 text-lg"
        >
          Buy Now
        </button>
        
        <button
          onClick={onAddToWishlist}
          className={`w-full py-4 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg transform hover:-translate-y-1 ${
            inWishlist
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
          className="w-full py-4 bg-transparent text-amber-400 border border-amber-500/50 hover:bg-amber-500/10 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg transform hover:-translate-y-1"
        >
          <FaTag />
          Need Customization
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

const RelatedProducts = ({ products }: { products: Product[] }) => {
  if (products.length === 0) return null;

  return (
    <section className="relative z-10 px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.originalId || product.id}`}
              className="group relative bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-amber-500/30 transition-all duration-500 h-full flex flex-col shadow-xl hover:shadow-2xl hover:shadow-amber-500/5"
            >
              <div className="relative h-64 w-full overflow-hidden bg-gray-800">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors duration-300 mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <div className="mt-auto">
                  <p className="text-xl font-bold text-amber-400">₹{product.price.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const CustomerReviews = ({ productId }: { productId: number }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await getProductReviews(productId.toString());
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [productId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setSubmitting(true);
    try {
      const newReview = await addProductReview(productId.toString(), rating, comment);
      setReviews([newReview, ...reviews]);
      setComment("");
      setRating(5);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const renderStars = (rate: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rate) {
        stars.push(<FaStar key={i} className="text-amber-400" />);
      } else if (i - 0.5 <= rate) {
        stars.push(<FaStarHalfAlt key={i} className="text-amber-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-amber-400" />);
      }
    }
    return stars;
  };
  
  if (loading) {
    return (
      <section className="relative z-10 px-4 py-16 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Customer Reviews</h2>
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="h-32 bg-gray-700 rounded"></div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="relative z-10 px-4 py-16 bg-gray-900/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Customer Reviews</h2>
        
        {/* Add Review Form */}
        <div className="mb-12 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Your Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    {star <= rating ? (
                      <FaStar className="text-amber-400 text-xl" />
                    ) : (
                      <FaRegStar className="text-amber-400 text-xl" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-gray-300 mb-2">Your Review</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full p-3 bg-gray-700/50 text-white rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none resize-none"
                placeholder="Share your experience with this product..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-bold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all duration-300 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            {submitSuccess && (
              <div className="mt-3 text-green-400 font-medium">
                Review submitted successfully!
              </div>
            )}
          </form>
        </div>
        
        {/* Reviews List */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4">Reviews ({reviews.length})</h3>
          
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No reviews yet. Be the first to review this product!
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-gray-400 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default function ProductPage({ product, relatedProducts = [] }: ProductPageProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [selectedSize, setSelectedSize] = useState(product.size || "M");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "#000000");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState(product.image);
  
  // Use images array if available, otherwise fallback to single image
  const productImages = (product as any).images && (product as any).images.length > 0 
    ? (product as any).images 
    : [product.image];

  const handleAddToCart = () => {
    addToCart({
      ...product,
      color: selectedColor,
      size: selectedSize,
      fit: ""
    });
  };

  const handleAddToWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        color: selectedColor,
        size: selectedSize
      });
    }
  };

  const handleBuyNow = () => {
    addToCart({
      ...product,
      color: selectedColor,
      size: selectedSize,
      fit: ""
    });
    window.location.href = "/account";
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
                alt="Product detail"
                fill
                className="object-contain drop-shadow-2xl rounded-lg"
                quality={100}
                priority
              />
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Images */}
          <div>
            <ImageGallery
              images={productImages}
              mainImage={mainImage}
              onImageClick={setSelectedImage}
            />
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-8">
            <ProductDetails product={product} />
            
            {/* Size Selector */}
            {(product.size || (product.variants && product.variants?.length > 0)) && (
              <SizeSelector
                sizes={product.variants && product.variants?.length > 0 
                  ? Array.from(new Set(product.variants.map(v => v.size)))
                  : [product.size]
                }
                selectedSize={selectedSize}
                onSelect={setSelectedSize}
              />
            )}

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <ColorSwatches
                colors={product.colors}
                selectedColor={selectedColor}
                onSelect={setSelectedColor}
              />
            )}

            {/* Action Buttons */}
            <ActionButtons
              product={product}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              inWishlist={isInWishlist(product.id)}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />
      </div>

      {/* Customer Reviews */}
      <CustomerReviews productId={product.id} />

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