"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingBag,
  FaTrash,
  FaCreditCard,
  FaArrowRight,
  FaBox,
  FaUser,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

// Floating particles background - using fixed positions to avoid hydration errors
const particlePositions = [
  { left: 10, top: 20, xMove: 15, duration: 3.5, delay: 0.5 },
  { left: 25, top: 45, xMove: -10, duration: 4, delay: 1 },
  { left: 40, top: 15, xMove: 20, duration: 3, delay: 2 },
  { left: 55, top: 70, xMove: -15, duration: 4.5, delay: 0 },
  { left: 70, top: 30, xMove: 10, duration: 3.2, delay: 1.5 },
  { left: 85, top: 55, xMove: -20, duration: 4.2, delay: 2.5 },
  { left: 15, top: 80, xMove: 12, duration: 3.8, delay: 3 },
  { left: 60, top: 10, xMove: -8, duration: 4.8, delay: 0.8 },
  { left: 90, top: 40, xMove: 18, duration: 3.6, delay: 1.8 },
  { left: 35, top: 90, xMove: -12, duration: 4.4, delay: 2.2 },
];

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {particlePositions.map((particle, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full opacity-20"
        style={{
          left: `${particle.left}%`,
          top: `${particle.top}%`,
        }}
        animate={{
          y: [-20, -100],
          x: [0, particle.xMove],
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: particle.duration,
          delay: particle.delay,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    ))}
  </div>
);

// Import CartItem type
import { CartItem } from "@/app/context/CartContext";

// Declare global Razorpay type
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Checkout Dashboard Component
const CheckoutDashboard = () => {
  const { user } = useUser();
  const { cart, removeFromCart, clearCart } = useCart();

  const firstName = user?.firstName || user?.username || "there";

  // Calculate cart total
  const getCartTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Redirect to store page for full checkout with address collection
  const handleCheckout = () => {
    if (cart.length === 0) return;
    // Redirect to the store page which has the complete checkout flow
    window.location.href = "/store";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-6xl mx-auto"
    >
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-12"
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6"
          whileHover={{ scale: 1.05 }}
        >
          <HiSparkles className="text-amber-400" />
          <span className="text-amber-400 text-sm font-medium">Welcome Back</span>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="text-white">Hi, </span>
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent italic font-serif">
            {firstName}!
          </span>
        </motion.h1>

        <motion.p
          className="text-gray-400 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {cart.length > 0
            ? "Ready to complete your purchase? Review your items below."
            : "Your cart is empty. Start shopping to add items!"}
        </motion.p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
            {/* Section Header */}
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <FaShoppingBag className="text-amber-400 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Your Cart</h2>
                    <p className="text-gray-400 text-sm">{cart.length} item(s)</p>
                  </div>
                </div>
                {cart.length > 0 && (
                  <motion.button
                    onClick={() => clearCart()}
                    className="text-red-400 text-sm hover:text-red-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear All
                  </motion.button>
                )}
              </div>
            </div>

            {/* Cart Items */}
            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <FaBox className="text-6xl text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg mb-4">Your cart is empty</p>
                    <Link href="/products">
                      <motion.button
                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-semibold rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Start Shopping
                      </motion.button>
                    </Link>
                  </motion.div>
                ) : (
                  cart.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/30 hover:border-amber-500/30 transition-all duration-300"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow min-w-0">
                        <h3 className="font-semibold text-white truncate">{item.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.size && (
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                              {item.color}
                            </span>
                          )}
                        </div>
                        <p className="text-amber-400 font-bold mt-2">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        onClick={() => removeFromCart(item.id, item.size, item.color, item.fabric, item.fit)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaTrash />
                      </motion.button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Checkout Summary Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="lg:col-span-1"
        >
          <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden sticky top-24">
            {/* Summary Header */}
            <div className="p-6 border-b border-gray-700/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaCreditCard className="text-amber-400" />
                Order Summary
              </h2>
            </div>

            {/* Summary Content */}
            <div className="p-6 space-y-4">
              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>₹{getCartTotal().toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-700/50 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-2xl font-bold text-amber-400">
                    ₹{getCartTotal().toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <motion.button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${cart.length === 0
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20"
                  }`}
                whileHover={cart.length > 0 ? { scale: 1.02 } : {}}
                whileTap={cart.length > 0 ? { scale: 0.98 } : {}}
              >
                Proceed to Pay
                <FaArrowRight />
              </motion.button>

              {/* Security Note */}
              <p className="text-center text-gray-500 text-xs mt-4">
                🔒 Secure checkout powered by Razorpay
              </p>

              {/* Continue Shopping */}
              <Link href="/products" className="block">
                <motion.button
                  className="w-full py-3 border border-amber-500/30 text-amber-400 rounded-xl font-medium hover:bg-amber-500/10 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue Shopping
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Sign Out Button */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <SignOutButton>
              <motion.button
                className="w-full py-3 bg-gray-800/50 border border-gray-700/50 text-gray-400 rounded-xl font-medium hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign Out
              </motion.button>
            </SignOutButton>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Login Prompt Component
const LoginPrompt = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 md:p-12 text-center max-w-lg mx-auto"
    >
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6"
        whileHover={{ scale: 1.1, rotate: 10 }}
      >
        <FaUser className="text-3xl text-gray-900" />
      </motion.div>

      <h2 className="text-3xl font-bold text-white mb-4">
        Welcome to <span className="text-amber-400 italic font-serif">Fittara</span>
      </h2>
      <p className="text-gray-400 mb-8">
        Sign in to access your cart, wishlist, and complete your purchase
      </p>

      <SignInButton mode="modal" forceRedirectUrl="/account">
        <motion.button
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 rounded-xl font-bold text-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Sign In to Continue
        </motion.button>
      </SignInButton>

      <p className="text-gray-500 text-sm mt-6">
        Don&apos;t have an account? Sign in to create one
      </p>
    </motion.div>
  );
};

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      <FloatingParticles />

      {/* Decorative gradient orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <div className="relative z-40">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-4 py-8">
        <SignedIn>
          <CheckoutDashboard />
        </SignedIn>

        <SignedOut>
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoginPrompt />
          </div>
        </SignedOut>
      </main>
    </div>
  );
}
