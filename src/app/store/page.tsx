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
  Share2,
} from "lucide-react";
import Link from "next/link";

// Declare global Razorpay type
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

import Modal from "@/app/components/Modal";
import toast from "react-hot-toast";

export default function StorePage() {
  const { cart, decrementQuantity, removeFromCart, clearCart, addToCart, updateCartItem } =
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
  const shipping = 0;
  const total = subtotal + shipping - discount;

  // Handle quantity change - FULLY FUNCTIONAL
  const handleQuantityChange = (item: CartItem, change: number) => {
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      showModal(
        "confirm",
        "Remove Item?",
        `Are you sure you want to remove "${item.title}" from your cart?`,
        () => removeFromCart(item.id, item.size, item.color, item.fabric, item.fit)
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
      decrementQuantity(item.id, item.size, item.color, item.fabric, item.fit);
    }
  };

  // Save for Later - Add to Wishlist
  const handleSaveForLater = (item: CartItem) => {
    addToWishlist(item);
    removeFromCart(item.id, item.size, item.color, item.fabric, item.fit);
    toast.success("Saved to Wishlist!");
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
        toast.success("Cart Cleared");
      }
    );
  };

  // Apply promo code
  const applyPromoCode = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "WELCOME10") {
      setDiscount(subtotal * 0.1);
      setAppliedPromo(code);
      toast.success("Promo WELCOME10 Applied!");
    } else if (code === "FESTIVE20") {
      setDiscount(subtotal * 0.2);
      setAppliedPromo(code);
      toast.success("Promo FESTIVE20 Applied!");
    } else {
      toast.error("Invalid Promo Code");
    }
  };

  // Remove promo code
  const removePromoCode = () => {
    setPromoCode("");
    setAppliedPromo("");
    setDiscount(0);
    toast.success("Promo Code Removed");
  };

  // Remove item with confirmation
  const handleRemoveItem = (item: CartItem) => {
    showModal(
      "confirm",
      "Remove Item?",
      `Are you sure you want to remove "${item.title}" from your cart?`,
      () => {
        removeFromCart(item.id, item.size, item.color, item.fabric, item.fit);
        toast.success("Item removed from cart");
      }
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
    // Validate Cart Items
    const incompleteItems = cart.filter(item => !item.size || !item.fit || !item.fabric);
    if (incompleteItems.length > 0) {
      showModal("error", "Incomplete Options", "Please select Size, Fabric, and Fit for all items in your cart before checking out.");
      return;
    }

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
          color: "#000000",
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
    const incompleteItems = cart.filter(item => !item.size || !item.fit || !item.fabric);
    if (incompleteItems.length > 0) {
      showModal("error", "Incomplete Options", "Please select Size, Fabric, and Fit for all items in your cart before checking out.");
      return;
    }
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

  const handleShare = async (item: CartItem) => {
    const shareData = {
      title: item.title,
      text: `Check out ${item.title} on Fittara!`,
      url: window.location.origin + "/products", // Ideally link to specific product
    };

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(
          `${shareData.text} ${shareData.url}`
        );
        showModal(
          "success",
          "Link Copied",
          "Product link copied to clipboard!"
        );
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // If user cancelled, do nothing. For other errors, fallback.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((err as any).name !== "AbortError") {
          console.error("Error sharing, falling back to clipboard:", err);
          await copyToClipboard();
        }
      }
    } else {
      await copyToClipboard();
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
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
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FFFFFF]">
              <h3 className="text-2xl font-bold text-[#000000] flex items-center gap-2">
                <Truck className="w-6 h-6 text-[#000000]" />
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
                    <label className="block text-sm font-semibold text-[#000000] mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#000000] focus:ring-4 focus:ring-[#000000]/10 transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#000000] mb-2">Address</label>
                    <input
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#000000] focus:ring-4 focus:ring-[#000000]/10 transition-all"
                      placeholder="Street address, House No., Apartment"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#000000] mb-2">ZIP Code</label>
                      <input
                        type="text"
                        required
                        value={address.zip}
                        maxLength={6}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setAddress({ ...address, zip: val });
                          if (val.length === 6) lookupPincode(val);
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#000000] focus:ring-4 focus:ring-[#000000]/10 transition-all"
                        placeholder="ZIP Code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#000000] mb-2">City</label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#000000] focus:ring-4 focus:ring-[#000000]/10 transition-all"
                        placeholder="City"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#000000] mb-2">State</label>
                      <input
                        type="text"
                        required
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#000000] focus:ring-4 focus:ring-[#000000]/10 transition-all"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#000000] mb-2">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#000000] focus:ring-4 focus:ring-[#000000]/10 transition-all"
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
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                form="address-form"
                type="submit"
                className="px-8 py-3 bg-[#000000] text-white rounded-lg font-semibold hover:bg-[#333333] transition shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 cursor-pointer"
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
            <Link href="/" className="hover:text-[#000000] transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#000000] font-medium">Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16 lg:py-24">
            <div className="inline-flex items-center justify-center w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-[#F3F4F6] border-4 border-[#E5E7EB] mb-6">
              <ShoppingBag className="w-12 h-12 lg:w-16 lg:h-16 text-[#000000]" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#000000] mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Looks like you haven&apos;t added any items to your cart yet.
              Start shopping now!
            </p>
            <a
              href="/products"
              className="inline-flex items-center gap-3 bg-[#000000] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#333333] transition-all shadow-md hover:shadow-lg"
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
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#000000] flex items-center gap-3">
                    <ShoppingBag className="w-7 h-7 text-[#000000]" />
                    Shopping Cart
                  </h2>
                  <span className="px-4 py-2 bg-[#F3F4F6] text-[#000000] rounded-full font-bold">
                    {cart.length} {cart.length === 1 ? "Item" : "Items"}
                  </span>
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-200 hover:border-[#000000] transition-all"
                  >
                    <div className="flex gap-4 lg:gap-6">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title || "Product Image"}
                            fill
                            sizes="(max-width: 768px) 96px, 128px"
                            className="object-cover"
                            priority={cart.indexOf(item) < 3}
                            quality={85}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 pr-4">
                            <h3 className="font-bold text-[#000000] text-lg lg:text-xl mb-2 line-clamp-2">
                              {item.title}
                            </h3>
                            <div className="flex flex-col gap-2 mb-2">
                              {/* Size Selector */}
                              <div className="flex items-center gap-2">
                                <span className={`text-sm ${!item.size ? "text-red-500 font-bold" : "text-gray-600"}`}>Size:</span>
                                <select
                                  value={item.size}
                                  onChange={(e) => updateCartItem(item, e.target.value, item.color, item.fabric || "", item.fit || "")}
                                  className={`text-sm border rounded px-2 py-1 ${!item.size ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                                >
                                  <option value="">Select Size</option>
                                  {["XS", "S", "M", "L", "XL", "XXL"].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Fabric Selector */}
                              <div className="flex items-center gap-2">
                                <span className={`text-sm ${!item.fabric ? "text-red-500 font-bold" : "text-gray-600"}`}>Fabric:</span>
                                <select
                                  value={item.fabric || ""}
                                  onChange={(e) => updateCartItem(item, item.size as string, item.color, e.target.value, item.fit || "")}
                                  className={`text-sm border rounded px-2 py-1 ${!item.fabric ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                                >
                                  <option value="">Select Fabric</option>
                                  {["Cotton", "Linen", "Silk", "Wool", "Blend"].map(f => (
                                    <option key={f} value={f}>{f}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Fit Selector - Replaces Color Selector */}
                              <div className="flex items-center gap-2">
                                <span className={`text-sm ${!item.fit ? "text-red-500 font-bold" : "text-gray-600"}`}>Fit:</span>
                                <select
                                  value={item.fit || ""}
                                  onChange={(e) => updateCartItem(item, item.size as string, item.color, item.fabric || "", e.target.value)}
                                  className={`text-sm border rounded px-2 py-1 ${!item.fit ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                                >
                                  <option value="">Select Fit</option>
                                  {/* Showing all fits as we don't know category easily here without prop, or we assume all are valid options. 
                                      Alternatively could check item.category if available, but CartItem might not have it unless we added it.
                                      We added category to Product, not strictly CartItem? 
                                      Wait, we added 'category' to CartItem type in Plan? Yes. 
                                      Let's check if item.category is available.
                                  */}
                                  {(item.category === 'shirt'
                                    ? ["Tailored fit", "Classic Regular fit", "Slim fit"]
                                    : ["Tailored fit", "Tapered fit", "Straight fit", "Relaxed Tapered fit", "Regular fit"]
                                  ).map(f => (
                                    <option key={f} value={f}>{f}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

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
                                className="w-10 h-10 flex items-center justify-center hover:bg-[#F3F4F6] text-[#000000] font-bold transition active:scale-95"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="w-12 h-10 flex items-center justify-center font-bold text-[#000000] border-x-2 border-gray-300 bg-gray-50">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item, 1)}
                                className="w-10 h-10 flex items-center justify-center hover:bg-[#F3F4F6] text-[#000000] font-bold transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
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
                            <p className="text-2xl lg:text-3xl font-bold text-[#000000]">
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
                        {/* Save for Later & Share */}
                        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => handleSaveForLater(item)}
                            className="text-sm text-[#000000] hover:text-[#000000] font-medium flex items-center gap-2 transition group"
                          >
                            <Heart className="w-4 h-4 group-hover:fill-[#000000]" />
                            Save for Later
                          </button>
                          <div className="w-px h-4 bg-gray-300 self-center"></div>
                          <button
                            onClick={() => handleShare(item)}
                            className="text-sm text-[#000000] hover:text-[#000000] font-medium flex items-center gap-2 transition group"
                          >
                            <Share2 className="w-4 h-4" />
                            Share
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
                  className="block w-full text-center bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#000000] py-3 px-6 rounded-lg font-semibold transition active:scale-[0.98]"
                >
                  Continue Shopping
                </a>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 lg:sticky lg:top-28">
                <h2 className="text-2xl font-bold text-[#000000] mb-6 pb-4 border-b-2 border-gray-200">
                  Order Summary
                </h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-[#000000] mb-2 block">
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
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#000000] text-sm font-medium"
                      />
                      <button
                        onClick={applyPromoCode}
                        disabled={!promoCode.trim()}
                        className="px-6 py-3 bg-[#000000] text-white rounded-lg font-semibold hover:bg-[#1a0f08] transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
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
                  <div className="flex justify-between items-center bg-[#F3F4F6] -mx-6 px-6 py-4 rounded-lg">
                    <span className="text-xl font-bold text-[#000000]">
                      Total Amount
                    </span>
                    <span className="text-3xl font-bold text-[#000000]">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>

                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-gradient-to-r from-[#000000] to-[#333333] hover:from-[#333333] hover:to-[#1F2937] text-white py-4 px-6 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group mb-4 active:scale-[0.98] cursor-pointer"
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
