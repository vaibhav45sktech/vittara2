"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { FiHeart, FiShoppingBag, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { Product } from "@/app/data/products";
import { getAllProducts } from "@/app/actions/productActions";
import Tooltip from "./Tooltip";
import { useUser } from "@clerk/nextjs";
import { HiOutlineSparkles } from "react-icons/hi2";
import { useRouter } from "next/navigation";

// Helper function to get the correct product URL based on category
// Helper function to get the correct product URL based on category
const getProductUrl = (product: Product): string => {
  // Use the originalId if available (cast to any to access the property since it's added at runtime)
  const p = product as any;
  if (p.originalId && typeof p.originalId === 'string' && p.originalId.trim() !== '') {
    return `/products/${p.originalId}`;
  }
  return `/products/${product.id}`;
};

const navLinks = [
  { name: "PANT", href: "/pant" },
  { name: "SHIRT", href: "/shirt" },
  { name: "COMBOS", href: "/combo" },
  { name: "FEEDBACKS", href: "/review" },
  { name: "PRODUCTS", href: "/products" },
];

const announcements = [
  "Free shipping on every order — delivered across India!",
  "Enjoy hassle-free returns and exchanges",
  "Premium quality. Unmatched craftsmanship.",
];

const Navbar = () => {
  const { user, isSignedIn } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const router = useRouter();

  const handleSearch = () => {
    console.log(`[Navbar] Search submitted for query: "${searchQuery}"`);
    if (searchQuery.trim()) {
      const url = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      console.log(`[Navbar] Redirecting to search results: ${url}`);
      router.push(url);
      setFilteredProducts([]);
      setIsMobileMenuOpen(false);
    } else {
      console.log("[Navbar] Search query empty, ignoring.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };




  const handleProductClick = (product: Product) => {
    try {
      console.log(`[Navbar] Clicking product: ${product.title} (ID: ${product.id})`);
      const url = getProductUrl(product);
      console.log(`[Navbar] Redirecting to: ${url}`);

      setFilteredProducts([]);
      setSearchQuery("");
      setIsMobileMenuOpen(false);

      router.push(url);
    } catch (error) {
      console.error("[Navbar] Error handling product click:", error);
    }
  };

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const menuSearchRef = useRef<HTMLDivElement>(null);

  const typingState = useRef({
    currentTextIndex: 0,
    currentCharIndex: 0,
    isDeleting: false,
  });

  const searchTexts = useMemo(
    () => [
      "Formal Pants",
      "Casual Pants",
      "Tailored Trousers",
      "Classic Shirts",
      "Slim Fit Shirts",
      "Casual Shirts",
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

  // Debounce search query to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch all products once on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const products = await getAllProducts();
        setAllProducts(products);
      } catch (error) {
        console.error('Error fetching all products:', error);
      }
    };

    fetchAllProducts();
  }, []);

  // Filter products with debounced query using cached products
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setFilteredProducts([]);
      return;
    }

    const results = allProducts.filter((p: any) =>
      p.title && p.title.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
    setFilteredProducts(results as Product[]);
  }, [debouncedQuery, allProducts]);

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

      // Check if click is outside of ALL search containers
      const isOutsideDesktop = !desktopSearchRef.current || !desktopSearchRef.current.contains(target);
      const isOutsideMobile = !mobileSearchRef.current || !mobileSearchRef.current.contains(target);
      const isOutsideMenu = !menuSearchRef.current || !menuSearchRef.current.contains(target);

      if (isOutsideDesktop && isOutsideMobile && isOutsideMenu) {
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
    <>
      {/* Spacer to prevent content overlap - equivalent to pt-40 */}
      <div className="h-[130px] lg:h-[220px]"></div>

      <header className="fixed top-0 left-0 w-full z-[999]">
        {/* Announcement Bar */}
        <div
          className={`overflow-hidden bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black text-sm font-semibold hidden lg:flex items-center justify-center transition-all duration-300 ${scrolled ? "opacity-0 h-0" : "opacity-100 h-8"
            }`}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {announcements.map((msg, idx) => (
              <div
                key={idx}
                className="h-8 flex items-center justify-center px-4 min-w-full text-center tracking-wide"
              >
                {msg}
              </div>
            ))}
          </div>
        </div>

        {/* Main Navbar Container */}
        <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 shadow-2xl border-b border-gray-700/50 transition-all duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Row: Logo + Nav + Icons */}
            <div
              className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20"
                }`}
            >
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="hamburger-btn lg:hidden text-white hover:text-amber-400 transition-colors duration-200 p-1 cursor-pointer"
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
                <Link href="/" aria-label="Home" className="flex items-center gap-3 group">
                  <Image
                    src="/images/bird-logo2.png"
                    alt="Fittara Bird Logo"
                    width={120}
                    height={120}
                    className={`transition-all duration-300 object-contain ${scrolled ? "h-10 w-auto lg:h-12" : "h-12 w-auto lg:h-16"
                      }`}
                    priority
                  />
                  <div className={`flex flex-col justify-center transition-all duration-300 text-white ${scrolled ? "scale-90 origin-left" : "scale-100"}`}>
                    <span className="font-serif leading-none tracking-wide text-xl lg:text-2xl">
                      Fittara
                    </span>
                    <span className="text-[0.45rem] lg:text-[0.5rem] tracking-[0.15em] font-medium text-gray-400 mt-0.5 whitespace-nowrap">
                      YOUR VISION. YOUR FIT. YOUR Fittara
                    </span>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation (centered) */}
              <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 absolute left-1/2 transform -translate-x-1/2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 tracking-wide px-3 py-2 group"
                  >
                    {link.name}
                    <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-0 h-[2px] bg-amber-400 transition-all duration-300 group-hover:w-3/4"></span>
                  </Link>
                ))}
              </nav>

              {/* Right-side Icons */}
              <div className="flex items-center space-x-4 lg:space-x-5">
                <div className="relative group">
                  <Tooltip content="Profile">
                    <Link
                      href="/account"
                      className="text-gray-300 hover:text-white flex items-center justify-center transition-colors duration-200"
                    >
                      {isSignedIn && user?.imageUrl ? (
                        <Image
                          src={user.imageUrl}
                          alt="Profile"
                          width={26}
                          height={26}
                          className="rounded-full object-cover border-2 border-gray-600 hover:border-amber-400 transition-colors"
                        />
                      ) : (
                        <FiUser className="text-xl" />
                      )}
                    </Link>
                  </Tooltip>
                </div>

                <div className="relative group">
                  <Tooltip content="Wishlist">
                    <Link
                      href="/wishlist"
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      <FiHeart className="text-xl" />
                      {mounted && wishlistCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
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
                      className="relative text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      <FiShoppingBag className="text-xl" />
                      {mounted && cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div className={`hidden lg:block text-center transition-all duration-300 ${scrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100 py-2"}`}>
              <p className="text-amber-400/90 italic text-sm tracking-[0.3em] font-light">
                THE UNMATCHED CRAFTSMANSHIP. YOUR STYLE.
              </p>
            </div>

            {/* Desktop Search Bar */}
            <div className={`hidden lg:block transition-all duration-300 ${scrolled ? "pb-2" : "pb-4"}`}>
              <div className="flex justify-center">
                <div className="relative w-full max-w-2xl" ref={desktopSearchRef}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Search for ${searchText}...`}
                      aria-label="Search products"
                      className="py-3 pl-5 pr-24 border-2 border-gray-600 text-sm focus:outline-none focus:border-amber-400 w-full bg-gray-800/50 text-white placeholder-gray-500 rounded-lg transition-all duration-300 hover:border-gray-500"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <HiOutlineSparkles className="text-amber-400 text-lg" />
                      <button
                        onClick={handleSearch}
                        className="bg-gray-700 hover:bg-gray-600 p-2 rounded-md transition-colors duration-200"
                      >
                        <FaSearch className="text-gray-300 text-sm" />
                      </button>
                    </div>
                  </div>
                  {filteredProducts.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-2xl mt-2 z-[60] max-h-72 overflow-y-auto">
                      {filteredProducts.map((p: Product) => (
                        <div
                          key={p.id}
                          role="button"
                          onClick={() => handleProductClick(p)}
                          className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-200 border-b border-gray-700/50 last:border-b-0 cursor-pointer"
                        >
                          <Image
                            src={p.image}
                            alt={p.title}
                            width={48}
                            height={48}
                            className="rounded-md mr-4 object-cover"
                          />
                          <div>
                            <span className="text-white text-sm font-medium">{p.title}</span>
                            <span className="block text-amber-400 text-xs">₹{p.price.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="block lg:hidden pb-3">
              <div className="flex justify-center px-2">
                <div className="relative w-full max-w-sm" ref={mobileSearchRef}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Search for ${searchText}...`}
                    aria-label="Search products mobile"
                    className="py-2.5 pl-4 pr-12 border border-gray-600 text-sm focus:outline-none focus:border-amber-400 w-full bg-gray-800/50 text-white placeholder-gray-500 rounded-lg"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                  >
                    <FaSearch />
                  </button>
                  {filteredProducts.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg mt-1 z-[60] max-h-64 overflow-y-auto">
                      {filteredProducts.map((p: Product) => (
                        <div
                          key={p.id}
                          role="button"
                          onClick={() => handleProductClick(p)}
                          className="flex items-center px-4 py-2 hover:bg-gray-700 transition cursor-pointer"
                        >
                          <Image
                            src={p.image}
                            alt={p.title}
                            width={40}
                            height={40}
                            className="rounded mr-3"
                          />
                          <span className="text-white text-sm">{p.title}</span>
                        </div>
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
            className={`mobile-menu fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-[200] lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900 shadow-sm">
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/bird-logo2.png"
                    alt="Fittara Bird Logo"
                    width={80}
                    height={80}
                    className="h-10 w-auto"
                  />
                  <div className="flex flex-col text-white">
                    <span className="font-serif text-xl leading-none tracking-wide">
                      Fittara
                    </span>
                    <span className="text-[0.4rem] tracking-[0.15em] font-medium opacity-80 whitespace-nowrap">
                      YOUR VISION. YOUR FIT. YOUR Fittara
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="text-white hover:text-amber-400 transition-colors duration-200 p-2 rounded-full hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Search inside menu */}
              <div className="p-4 border-b border-gray-800 bg-gray-900">
                <div className="relative" ref={menuSearchRef}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Search for ${searchText}...`}
                    aria-label="Search products mobile"
                    className="py-3 pl-4 pr-10 border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg shadow-sm"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                  >
                    <FaSearch />
                  </button>
                  {filteredProducts.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg mt-1 z-[250] max-h-64 overflow-y-auto">
                      {filteredProducts.map((p: Product) => (
                        <div
                          key={p.id}
                          role="button"
                          onClick={() => handleProductClick(p)}
                          className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-200 border-b border-gray-700/50 last:border-b-0 cursor-pointer"
                        >
                          <Image
                            src={p.image}
                            alt={p.title}
                            width={40}
                            height={40}
                            className="rounded mr-3 object-cover"
                          />
                          <span className="text-sm text-white">{p.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto bg-gray-900">
                <nav className="p-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block px-4 py-4 text-base font-medium text-gray-300 hover:text-white hover:bg-amber-500/10 rounded-lg transition-all duration-200 border-b border-gray-800"
                      onClick={closeMobileMenu}
                    >
                      {link.name}
                    </Link>
                  ))}

                  <div className="border-t border-gray-800 my-4 mx-2"></div>

                  {/* Account Links */}
                  <Link
                    href="/account"
                    className="flex items-center px-4 py-4 text-sm font-medium text-gray-300 hover:text-white hover:bg-amber-500/10 rounded-lg transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    {isSignedIn && user?.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt="Profile"
                        width={24}
                        height={24}
                        className="rounded-full object-cover border border-gray-600 mr-3"
                      />
                    ) : (
                      <FiUser className="text-lg mr-3" />
                    )}
                    <span>My Account</span>
                  </Link>
                  <Link
                    href="/wishlist"
                    className="flex items-center justify-between px-4 py-4 text-sm font-medium text-gray-300 hover:text-white hover:bg-amber-500/10 rounded-lg transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    <div className="flex items-center">
                      <FiHeart className="text-lg mr-3" />
                      <span>My Wishlist</span>
                    </div>
                    {mounted && wishlistCount > 0 && (
                      <span className="bg-amber-500 text-black text-xs font-bold rounded-full px-2.5 py-1 shadow-sm">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/store"
                    className="flex items-center justify-between px-4 py-4 text-sm font-medium text-gray-300 hover:text-white hover:bg-amber-500/10 rounded-lg transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    <div className="flex items-center">
                      <FiShoppingBag className="text-lg mr-3" />
                      <span>My Cart</span>
                    </div>
                    {mounted && cartCount > 0 && (
                      <span className="bg-amber-500 text-black text-xs font-bold rounded-full px-2.5 py-1 shadow-sm">
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
    </>
  );
};

export default Navbar;
