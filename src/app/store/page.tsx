"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { useCart, CartItem } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Package,
  Truck,
  Tag,
  Heart,
  Shield,
  CreditCard,
  X,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import Link from "next/link";

// Declare global Razorpay type
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error" | "warning" | "info" | "confirm";
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const Modal = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ModalProps) => {
  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle className="w-16 h-16 text-green-500" />,
    error: <AlertCircle className="w-16 h-16 text-red-500" />,
    warning: <AlertCircle className="w-16 h-16 text-amber-500" />,
    info: <Info className="w-16 h-16 text-blue-500" />,
    confirm: <AlertCircle className="w-16 h-16 text-[#D2691E]" />,
  };

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
    confirm: "bg-[#D2691E]",
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scale-in">
        {/* Header Strip */}
        <div className={`h-2 ${colors[type]}`}></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="mb-6 flex justify-center">{icons[type]}</div>

          <h3 className="text-2xl font-bold text-[#2C1810] mb-3">{title}</h3>

          <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            {type === "confirm" ? (
              <>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm?.();
                    onClose();
                  }}
                  className="px-6 py-3 bg-[#D2691E] text-white rounded-lg font-semibold hover:bg-[#B8541A] transition"
                >
                  {confirmText}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className={`px-8 py-3 ${colors[type]} text-white rounded-lg font-semibold hover:opacity-90 transition`}
              >
                Got it
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default function StorePage() {
  const { cart, decrementQuantity, removeFromCart, clearCart, addToCart } =
    useCart();
  const { addToWishlist } = useWishlist();

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [discount, setDiscount] = useState(0);

  // Address State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    street: "",
    zip: "",
    city: "",
    state: "",
    phone: "",
  });

  // Modal State
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "warning" | "info" | "confirm";
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // Show Modal Helper
  const showModal = (
    type: "success" | "error" | "warning" | "info" | "confirm",
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    setModal({ isOpen: true, type, title, message, onConfirm });
  };

  // Calculate totals
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18;
  const shipping = 0;
  const total = subtotal + tax + shipping - discount;

  // Handle quantity change - FULLY FUNCTIONAL
  const handleQuantityChange = (item: CartItem, change: number) => {
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      showModal(
        "confirm",
        "Remove Item?",
        `Are you sure you want to remove "${item.title}" from your cart?`,
        () => removeFromCart(item.id)
      );
      return;
    }

    if (newQuantity > 10) {
      showModal(
        "warning",
        "Maximum Quantity Reached",
        "You can only add up to 10 items of the same product."
      );
      return;
    }

    // Add or remove based on change
    if (change > 0) {
      addToCart(item);
    } else {
      decrementQuantity(item.id);
    }
  };

  // Save for Later - Add to Wishlist
  const handleSaveForLater = (item: CartItem) => {
    addToWishlist(item);
    removeFromCart(item.id);
    showModal(
      "success",
      "Saved to Wishlist!",
      `"${item.title}" has been moved to your wishlist. You can find it anytime in your wishlist page.`
    );
  };

  // Clear cart with confirmation
  const handleClearCart = () => {
    showModal(
      "confirm",
      "Clear Entire Cart?",
      "This will remove all items from your cart. This action cannot be undone.",
      () => {
        clearCart();
        setAppliedPromo("");
        setDiscount(0);
        setPromoCode("");
        showModal(
          "success",
          "Cart Cleared",
          "All items have been removed from your cart."
        );
      }
    );
  };

  // Apply promo code
  const applyPromoCode = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "WELCOME10") {
      setDiscount(subtotal * 0.1);
      setAppliedPromo(code);
      showModal(
        "success",
        "Promo Applied!",
        "You saved 10% on your order with code WELCOME10"
      );
    } else if (code === "FESTIVE20") {
      setDiscount(subtotal * 0.2);
      setAppliedPromo(code);
      showModal(
        "success",
        "Promo Applied!",
        "You saved 20% on your order with code FESTIVE20"
      );
    } else {
      showModal(
        "error",
        "Invalid Code",
        "The promo code you entered is not valid. Try WELCOME10 or FESTIVE20"
      );
    }
  };

  // Remove promo code
  const removePromoCode = () => {
    setPromoCode("");
    setAppliedPromo("");
    setDiscount(0);
    showModal(
      "info",
      "Promo Removed",
      "The promo code has been removed from your order."
    );
  };

  // Remove item with confirmation
  const handleRemoveItem = (item: CartItem) => {
    showModal(
      "confirm",
      "Remove Item?",
      `Are you sure you want to remove "${item.title}" from your cart?`,
      () => removeFromCart(item.id)
    );
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const processPayment = async () => {
    // Validate address
    if (!address.name || !address.street || !address.city || !address.state || !address.zip || !address.phone) {
       showModal("error", "Missing Details", "Please fill in all address fields.");
       return;
    }

    setShowAddressForm(false); // Close form
    const res = await loadRazorpayScript();

    if (!res) {
      showModal(
        "error",
        "SDK Load Failed",
        "Razorpay SDK failed to load. Are you online?"
      );
      return;
    }

    try {
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            amount: total, 
            currency: "INR",
            customerDetails: {
                name: address.name,
                address: address
            },
            items: cart
        }),
      });

      if (!orderRes.ok) {
        showModal(
          "error",
          "Order Creation Failed",
          "Could not create Razorpay order."
        );
        return;
      }

      const orderData = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1234567890", // Enter the Key ID generated from the Dashboard
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Manyavar Mohey",
        description: "Transaction for your order",
        image: "/images/logo2.png",
        order_id: orderData.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          // Validate payment at server - using valid payment for now
          /*
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature);
          */
          showModal(
            "success",
            "Payment Successful",
            `Order successfully placed! Payment ID: ${response.razorpay_payment_id}`,
            () => {
              clearCart();
              setAddress({ name: "", street: "", city: "", state: "", zip: "", phone: "" });
            }
          );
        },
        prefill: {
          name: address.name,
          email: "user@example.com", // You might want to collect email too
          contact: address.phone,
        },
        notes: {
          address: `${address.street}, ${address.city}, ${address.state} - ${address.zip}`,
        },
        theme: {
          color: "#D2691E",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      showModal("error", "Payment Error", "Something went wrong during payment.");
    }
  };

  const handleCheckoutClick = () => {
    setShowAddressForm(true);
  };

  const lookupPincode = async (pincode: string) => {
    if (pincode.length !== 6) return;
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();
      if (data && data[0] && data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setAddress((prev) => ({
          ...prev,
          city: postOffice.District,
          state: postOffice.State,
        }));
      }
    } catch (error) {
      console.error("Error fetching pincode details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Navbar />

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
      />

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setShowAddressForm(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#F5F0E8]">
              <h3 className="text-2xl font-bold text-[#2C1810] flex items-center gap-2">
                 <Truck className="w-6 h-6 text-[#D2691E]" />
                 Shipping Details
              </h3>
              <button 
                onClick={() => setShowAddressForm(false)} 
                className="p-2 rounded-full hover:bg-gray-200 transition text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto">
                <form id="address-form" onSubmit={(e) => { e.preventDefault(); processPayment(); }}>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-[#2C1810] mb-2">Full Name</label>
                            <input 
                                type="text" 
                                required
                                value={address.name}
                                onChange={(e) => setAddress({...address, name: e.target.value})}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#D2691E] focus:ring-4 focus:ring-[#D2691E]/10 transition-all"
                                placeholder="Enter your full name"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-[#2C1810] mb-2">Address</label>
                            <input 
                                type="text" 
                                required
                                value={address.street}
                                onChange={(e) => setAddress({...address, street: e.target.value})}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#D2691E] focus:ring-4 focus:ring-[#D2691E]/10 transition-all"
                                placeholder="Street address, House No., Apartment"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#2C1810] mb-2">ZIP Code</label>
                                <input 
                                    type="text" 
                                    required
                                    value={address.zip}
                                    maxLength={6}
                                    onChange={(e) => {
                                      const val = e.target.value.replace(/\D/g, "");
                                      setAddress({...address, zip: val});
                                      if (val.length === 6) lookupPincode(val);
                                    }}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#D2691E] focus:ring-4 focus:ring-[#D2691E]/10 transition-all"
                                    placeholder="ZIP Code"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#2C1810] mb-2">City</label>
                                <input 
                                    type="text" 
                                    required
                                    value={address.city}
                                    onChange={(e) => setAddress({...address, city: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#D2691E] focus:ring-4 focus:ring-[#D2691E]/10 transition-all"
                                    placeholder="City"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#2C1810] mb-2">State</label>
                                <input 
                                    type="text" 
                                    required
                                    value={address.state}
                                    onChange={(e) => setAddress({...address, state: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#D2691E] focus:ring-4 focus:ring-[#D2691E]/10 transition-all"
                                    placeholder="State"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#2C1810] mb-2">Phone Number</label>
                                <input 
                                    type="tel" 
                                    required
                                    value={address.phone}
                                    onChange={(e) => setAddress({...address, phone: e.target.value})}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#D2691E] focus:ring-4 focus:ring-[#D2691E]/10 transition-all"
                                    placeholder="Phone"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 justify-end">
                <button 
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                    Cancel
                </button>
                <button 
                    form="address-form"
                    type="submit" 
                    className="px-8 py-3 bg-[#D2691E] text-white rounded-lg font-semibold hover:bg-[#B8541A] transition shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
                >
                    Confirm & Pay
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 mt-20 lg:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#D2691E] transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#2C1810] font-medium">Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16 lg:py-24">
            <div className="inline-flex items-center justify-center w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-[#E9DCCF] border-4 border-[#d2c4b5] mb-6">
              <ShoppingBag className="w-12 h-12 lg:w-16 lg:h-16 text-[#2C1810]" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#2C1810] mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Looks like you haven&apos;t added any items to your cart yet.
              Start shopping now!
            </p>
            <a
              href="/products"
              className="inline-flex items-center gap-3 bg-[#D2691E] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#B8541A] transition-all shadow-md hover:shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#2C1810] flex items-center gap-3">
                    <ShoppingBag className="w-7 h-7 text-[#D2691E]" />
                    Shopping Cart
                  </h2>
                  <span className="px-4 py-2 bg-[#E9DCCF] text-[#2C1810] rounded-full font-bold">
                    {cart.length} {cart.length === 1 ? "Item" : "Items"}
                  </span>
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-200 hover:border-[#D2691E] transition-all"
                  >
                    <div className="flex gap-4 lg:gap-6">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 96px, 128px"
                          className="object-cover"
                          priority={cart.indexOf(item) < 3}
                          quality={85}
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=="
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 pr-4">
                            <h3 className="font-bold text-[#2C1810] text-lg lg:text-xl mb-2 line-clamp-2">
                              {item.title}
                            </h3>
                            {(item.size || item.color) && (
                              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                                {item.size && (
                                  <span>
                                    Size:{" "}
                                    <span className="font-semibold text-[#2C1810]">
                                      {item.size}
                                    </span>
                                  </span>
                                )}
                                {item.color && (
                                  <span>
                                    Color:{" "}
                                    <span className="font-semibold text-[#2C1810]">
                                      {item.color}
                                    </span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition flex-shrink-0"
                            title="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Quantity Controls - FULLY FUNCTIONAL */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 font-medium">
                              Qty:
                            </span>
                            <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                              <button
                                onClick={() => handleQuantityChange(item, -1)}
                                className="w-10 h-10 flex items-center justify-center hover:bg-[#E9DCCF] text-[#2C1810] font-bold transition active:scale-95"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="w-12 h-10 flex items-center justify-center font-bold text-[#2C1810] border-x-2 border-gray-300 bg-gray-50">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item, 1)}
                                className="w-10 h-10 flex items-center justify-center hover:bg-[#E9DCCF] text-[#2C1810] font-bold transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                                disabled={item.quantity >= 10}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            {item.quantity >= 10 && (
                              <span className="text-xs text-amber-600 font-medium">
                                Max reached
                              </span>
                            )}
                          </div>

                          {/* Price */}
                          <div className="text-left sm:text-right">
                            <p className="text-2xl lg:text-3xl font-bold text-[#D2691E]">
                              ₹
                              {(item.price * item.quantity).toLocaleString(
                                "en-IN"
                              )}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-gray-500">
                                ₹{item.price.toLocaleString("en-IN")} each
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Save for Later - Adds to Wishlist */}
                        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => handleSaveForLater(item)}
                            className="text-sm text-[#2C1810] hover:text-[#D2691E] font-medium flex items-center gap-2 transition group"
                          >
                            <Heart className="w-4 h-4 group-hover:fill-[#D2691E]" />
                            Save for Later
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleClearCart}
                  className="w-full bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-300 text-red-600 py-3 px-6 rounded-lg font-semibold transition flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Trash2 className="w-5 h-5" />
                  Clear Cart
                </button>

                <a
                  href="/products"
                  className="block w-full text-center bg-[#E9DCCF] hover:bg-[#d2c4b5] text-[#2C1810] py-3 px-6 rounded-lg font-semibold transition active:scale-[0.98]"
                >
                  Continue Shopping
                </a>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 lg:sticky lg:top-28">
                <h2 className="text-2xl font-bold text-[#2C1810] mb-6 pb-4 border-b-2 border-gray-200">
                  Order Summary
                </h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-[#2C1810] mb-2 block">
                    Have a Promo Code?
                  </label>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-green-50 border-2 border-green-300 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <Tag className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-green-700 block">
                            {appliedPromo}
                          </span>
                          <span className="text-xs text-green-600">
                            Applied successfully
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="text-red-600 hover:text-red-700 text-sm font-semibold px-3 py-1 rounded hover:bg-red-50 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) =>
                          setPromoCode(e.target.value.toUpperCase())
                        }
                        onKeyPress={(e) =>
                          e.key === "Enter" && applyPromoCode()
                        }
                        placeholder="Enter code"
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#D2691E] text-sm font-medium"
                      />
                      <button
                        onClick={applyPromoCode}
                        disabled={!promoCode.trim()}
                        className="px-6 py-3 bg-[#2C1810] text-white rounded-lg font-semibold hover:bg-[#1a0f08] transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Try: <span className="font-semibold">
                      WELCOME10
                    </span> or <span className="font-semibold">FESTIVE20</span>
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">
                      Subtotal ({cart.length} items)
                    </span>
                    <span className="font-bold">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 bg-green-50 -mx-2 px-2 py-2 rounded">
                      <span className="font-medium">Discount</span>
                      <span className="font-bold">−₹{discount.toFixed(0)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">GST (18%)</span>
                    <span className="font-bold">₹{tax.toFixed(0)}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span className="flex items-center gap-1 font-medium">
                      <Truck className="w-4 h-4" />
                      Shipping
                    </span>
                    {shipping === 0 ? (
                      <span className="font-bold text-green-600">FREE</span>
                    ) : (
                      <span className="font-bold">₹{shipping}</span>
                    )}
                  </div>


                </div>

                {/* Total */}
                <div className="mb-6">
                  <div className="flex justify-between items-center bg-[#E9DCCF] -mx-6 px-6 py-4 rounded-lg">
                    <span className="text-xl font-bold text-[#2C1810]">
                      Total Amount
                    </span>
                    <span className="text-3xl font-bold text-[#D2691E]">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Inclusive of all taxes
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-gradient-to-r from-[#D2691E] to-[#B8541A] hover:from-[#B8541A] hover:to-[#A04815] text-white py-4 px-6 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group mb-4 active:scale-[0.98]"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Trust Badges */}
                <div className="space-y-3 pt-4 border-t-2 border-gray-200">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium">100% Secure Payments</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium">7-Day Easy Returns</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-medium">
                      Free Delivery on All Orders
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
