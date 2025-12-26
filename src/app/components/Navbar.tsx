"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { FiHeart, FiShoppingBag, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import products, { Product } from "@/app/data/products";
import Tooltip from "./Tooltip";
import { useUser } from "@clerk/nextjs";

const mainLinks = [
  { name: "WOMEN", href: "#" },
  { name: "KIDS", href: "#" },
  { name: "BLOGS", href: "#" },
];

const extraLinks = [
  { name: "WEDDING CLOSET", href: "/" },
  { name: "FEEDBACKS", href: "/review" },
  { name: "PRODUCTS", href: "/products" },
];

const announcements = [
  "Shop your way - Get the best one!",
  "Free shipping on every order — delivered across India!",
  "Enjoy hassle-free returns and exchanges",
];

const Navbar = () => {
  const { user, isSignedIn } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const searchRef = useRef<HTMLDivElement>(null);
  const typingState = useRef({
    currentTextIndex: 0,
    currentCharIndex: 0,
    isDeleting: false,
  });

  const searchTexts = useMemo(
    () => [
      "Sherwani",
      "Bridal Lehenga",
      "Kurta",
      "Saree",
      "Short Kurta",
      "Lehenga",
    ],
    []
  );

  // Announcement rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect for placeholder
  useEffect(() => {
    const typewriter = () => {
      const { currentTextIndex, isDeleting } = typingState.current;
      const currentFullText = searchTexts[currentTextIndex];

      if (isDeleting) {
        typingState.current.currentCharIndex--;
        setSearchText(
          currentFullText.substring(0, typingState.current.currentCharIndex)
        );
        if (typingState.current.currentCharIndex === 0) {
          typingState.current.isDeleting = false;
          typingState.current.currentTextIndex =
            (currentTextIndex + 1) % searchTexts.length;
        }
      } else {
        typingState.current.currentCharIndex++;
        setSearchText(
          currentFullText.substring(0, typingState.current.currentCharIndex)
        );
        if (typingState.current.currentCharIndex === currentFullText.length) {
          setTimeout(() => {
            typingState.current.isDeleting = true;
          }, 1500);
        }
      }
    };

    const interval = setInterval(
      typewriter,
      typingState.current.isDeleting ? 60 : 100
    );
    return () => clearInterval(interval);
  }, [searchTexts]);

  // Filter products
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      return;
    }
    const results = products.filter((p: Product) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchQuery]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Outside click detection for both search + mobile menu
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setFilteredProducts([]);
      }
      if (
        isMobileMenuOpen &&
        !target.closest(".mobile-menu") &&
        !target.closest(".hamburger-btn")
      ) {
        setIsMobileMenuOpen(false);
      }
    },
    [isMobileMenuOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // Lock body scroll on mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="fixed top-0 w-full z-[100] transition-all duration-300">
      {/* Announcement Bar */}
      <div
        className={`overflow-hidden bg-[rgb(75,32,8)] text-white text-sm font-medium flex items-center justify-center transition-all duration-300 ${
          scrolled ? "opacity-0 h-0" : "opacity-100 h-8"
        }`}
      >
        <div
          className="flex transition-transform duration-2000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {announcements.map((msg, idx) => (
            <div
              key={idx}
              className="h-8 flex items-center justify-center px-4 min-w-full text-center"
            >
              {msg}
            </div>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-[#E9DCCF] shadow-sm border-b border-[#d2c4b5] transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              scrolled ? "h-12 lg:h-14" : "h-16 lg:h-18"
            }`}
          >
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hamburger-btn lg:hidden text-[#2C1810] hover:text-[#D2691E] transition-colors duration-200 p-1 cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="text-xl" />
              ) : (
                <FiMenu className="text-xl" />
              )}
            </button>

            {/* Logo */}
            <div className="flex-1 flex justify-center lg:justify-start">
              <Link href="/" aria-label="Home">
                <Image
                  src="/images/logo2.png"
                  alt="Manyavar Mohey Logo"
                  width={200}
                  height={50}
                  className={`transition-all duration-300 ${
                    scrolled ? "h-8 w-auto lg:h-10" : "h-12 w-auto lg:h-16"
                  }`}
                  priority
                />
              </Link>
            </div>

            {/* Right-side Icons & Links */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-6 mr-6">
                {mainLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative text-sm font-bold text-[#2C1810] hover:text-[#D2691E] transition-colors duration-200 tracking-wide px-2 py-1 group"
                  >
                    {link.name}
                    <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-[#D2691E] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
                <div className="w-px h-6 bg-[#2C1810] opacity-20 mx-2"></div>
                {extraLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm text-[#2C1810] hover:text-[#D2691E] transition-colors duration-200 tracking-tighter px-2 py-1"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Icons */}
              <div className="relative group">
                <Tooltip content="Profile">
                  <Link
                    href="/account"
                    className="text-[#2C1810] hover:text-[#D2691E] flex items-center justify-center"
                  >
                    {isSignedIn && user?.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt="Profile"
                        width={24}
                        height={24}
                        className="rounded-full object-cover border border-[#d2c4b5]"
                      />
                    ) : (
                      <FiUser className="text-lg" />
                    )}
                  </Link>
                </Tooltip>
              </div>

              <div className="relative group">
                <Tooltip content="Wishlist">
                  <Link
                    href="/wishlist"
                    className="text-[#2C1810] hover:text-[#D2691E]"
                  >
                    <FiHeart className="text-lg" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#D2691E] text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </Tooltip>
              </div>

              <div className="relative group">
                <Tooltip content="Cart">
                  <Link
                    href="/store"
                    className="relative text-[#2C1810] hover:text-[#D2691E]"
                  >
                    <FiShoppingBag className="text-lg" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#D2691E] text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:block pb-4">
            <div className="flex justify-center">
              <div className="relative w-full max-w-md" ref={searchRef}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search for ${searchText}`}
                  aria-label="Search products"
                  className="py-2 pl-4 pr-10 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2691E] w-full bg-white placeholder-gray-500 rounded-md"
                />
                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                {filteredProducts.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-[60] max-h-64 overflow-y-auto">
                    {filteredProducts.map((p: Product) => (
                      <Link
                        key={p.id}
                        href={`/products#product-${p.id}`}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
                        onClick={() => {
                          setFilteredProducts([]);
                          setSearchQuery("");
                        }}
                      >
                        <Image
                          src={p.image}
                          alt={p.title}
                          width={40}
                          height={40}
                          className="rounded mr-3"
                        />
                        <span>{p.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ✅ Mobile Search Bar (always visible under navbar) */}
          <div className="block lg:hidden pb-3">
            <div className="flex justify-center px-2">
              <div className="relative w-full max-w-sm" ref={searchRef}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search for ${searchText}`}
                  aria-label="Search products mobile"
                  className="py-2 pl-4 pr-10 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2691E] w-full bg-white placeholder-gray-500 rounded-md"
                />
                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                {filteredProducts.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-[60] max-h-64 overflow-y-auto">
                    {filteredProducts.map((p: Product) => (
                      <Link
                        key={p.id}
                        href={`/products#product-${p.id}`}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
                        onClick={() => {
                          setFilteredProducts([]);
                          setSearchQuery("");
                        }}
                      >
                        <Image
                          src={p.image}
                          alt={p.title}
                          width={40}
                          height={40}
                          className="rounded mr-3"
                        />
                        <span>{p.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-[150] lg:hidden"
            onClick={closeMobileMenu}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`mobile-menu fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-[#E9DCCF] shadow-2xl transform transition-transform duration-300 ease-in-out z-[200] lg:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#d2c4b5] bg-gradient-to-r from-[#E9DCCF] to-[#F0E5D8] shadow-sm">
              <Image
                src="/images/logo2.png"
                alt="Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
              <button
                onClick={closeMobileMenu}
                className="text-[#2C1810] hover:text-[#D2691E] transition-colors duration-200 p-2 rounded-full hover:bg-white/20"
                aria-label="Close menu"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Search inside menu (unchanged) */}
            <div className="p-4 border-b border-[#d2c4b5] bg-gradient-to-r from-[#F0E5D8] to-[#E9DCCF]">
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search for ${searchText}`}
                  aria-label="Search products mobile"
                  className="py-3 pl-4 pr-10 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2691E] focus:border-[#D2691E] w-full bg-white rounded-lg shadow-sm"
                />
                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                {filteredProducts.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-[250] max-h-64 overflow-y-auto">
                    {filteredProducts.map((p: Product) => (
                      <Link
                        key={p.id}
                        href={`/products#product-${p.id}`}
                        className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setFilteredProducts([]);
                          setSearchQuery("");
                          closeMobileMenu();
                        }}
                      >
                        <Image
                          src={p.image}
                          alt={p.title}
                          width={40}
                          height={40}
                          className="rounded mr-3 object-cover"
                        />
                        <span className="text-sm text-gray-800">{p.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#F0E5D8] to-[#E9DCCF]">
              <nav className="p-4 space-y-1">
                {mainLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block px-4 py-4 text-base font-bold text-[#2C1810] hover:text-[#D2691E] hover:bg-white/40 rounded-lg transition-all duration-200 border-b border-[#d2c4b5]/30"
                    onClick={closeMobileMenu}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="border-t border-[#d2c4b5] my-4 mx-2"></div>

                {extraLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block px-4 py-3 text-sm font-medium text-[#2C1810] hover:text-[#D2691E] hover:bg-white/30 rounded-lg transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="border-t border-[#d2c4b5] my-4 mx-2"></div>

                {/* Account Links */}
                <Link
                  href="/account"
                  className="flex items-center px-4 py-4 text-sm font-medium text-[#2C1810] hover:text-[#D2691E] hover:bg-white/40 rounded-lg transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  {isSignedIn && user?.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt="Profile"
                      width={24}
                      height={24}
                      className="rounded-full object-cover border border-[#d2c4b5] mr-3"
                    />
                  ) : (
                    <FiUser className="text-lg mr-3" />
                  )}
                  <span>My Account</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center justify-between px-4 py-4 text-sm font-medium text-[#2C1810] hover:text-[#D2691E] hover:bg-white/40 rounded-lg transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  <div className="flex items-center">
                    <FiHeart className="text-lg mr-3" />
                    <span>My Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="bg-[#D2691E] text-white text-xs font-bold rounded-full px-2.5 py-1 shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/store"
                  className="flex items-center justify-between px-4 py-4 text-sm font-medium text-[#2C1810] hover:text-[#D2691E] hover:bg-white/40 rounded-lg transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  <div className="flex items-center">
                    <FiShoppingBag className="text-lg mr-3" />
                    <span>My Cart</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="bg-[#D2691E] text-white text-xs font-bold rounded-full px-2.5 py-1 shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
