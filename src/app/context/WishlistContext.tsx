"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "@clerk/nextjs";

type WishlistItem = {
  category?: string;
  size: string | number;
  color: string;
  price: number;
  id: number;
  title: string;
  image: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  wishlistCount: number;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  isLoaded: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn } = useAuth();

  // 🔹 Lazy init to prevent hydration mismatch
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const storedWishlist = localStorage.getItem("wishlist");
      return storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch {
      return [];
    }
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // 🔹 Mark loaded after first client render
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 🔹 Persist wishlist changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
      } catch (error) {
        console.error("Error saving wishlist to localStorage:", error);
      }
    }
  }, [wishlist, isLoaded]);

  // 🔹 Clear wishlist automatically on sign-out
  useEffect(() => {
    if (isSignedIn === false) {
      setWishlist([]);
      localStorage.removeItem("wishlist");
    }
  }, [isSignedIn]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      if (
        prev.some(
          (i) =>
            i.id === item.id && i.size === item.size && i.color === item.color
        )
      ) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: number) => {
    return wishlist.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isLoaded,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
