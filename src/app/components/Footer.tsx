"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const pantShirtCategories = [
  { label: "Formal Pants", href: "/pant#pant-22" },
  { label: "Casual Pants", href: "/pant#pant-11" },
  { label: "Tailored Trousers", href: "/pant" },
  { label: "Formal Shirts", href: "/shirt" },
  { label: "Casual Shirts", href: "/shirt" },
];

const supportLinks = [
  { label: "Track Order", href: "/account" },
  { label: "Contact Us", href: "/#contact" },
  { label: "My Account", href: "/account" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white relative overflow-hidden border-t border-gray-800">
      {/* Background SVG */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
        <Image
          src="/images/footer-ornate-bg.svg"
          alt="Elegant Footer Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Newsletter Section */}
      <div className="max-w-5xl mx-auto px-6 py-8 z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h2 className="text-lg font-semibold">
            Subscribe to Our Pants & Shirts Lookbook
          </h2>
          <form className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Email Address"
              className="px-4 py-2 w-full md:w-72 rounded-l-md text-white bg-gray-900 border border-gray-800 placeholder:text-gray-500 focus:outline-none focus:border-white transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-white text-black px-6 py-2 rounded-r-md hover:bg-gray-200 transition font-medium"
            >
              →
            </button>
          </form>
        </div>
      </div>

      {/* Links Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 z-10 relative text-xs sm:text-sm">
        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-3 sm:mb-4 text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider">PRODUCT CATEGORIES</h3>
          <ul className="space-y-1.5 sm:space-y-2">
            {pantShirtCategories.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-gray-300 transition text-white text-xs sm:text-sm">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-3 sm:mb-4 text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider">SUPPORT</h3>
          <ul className="space-y-1.5 sm:space-y-2">
            {supportLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-gray-300 transition text-white text-xs sm:text-sm">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-2 sm:col-span-2 md:col-span-1">
          <h3 className="font-semibold mb-3 sm:mb-4 text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider">CONTACT</h3>
          <ul className="space-y-1.5 sm:space-y-2 text-white text-xs sm:text-sm">
            <li>
              <a
                href="mailto:Fittaraofficial@gmail.com"
                className="hover:text-gray-300 transition break-all sm:break-normal"
              >
                Fittaraofficial@gmail.com
              </a>
            </li>
            <li>+91 70467 89748</li>
            <li>10 am - 7 pm, Mon - Sat</li>
            <li>
              <Link href="/admin/orders" className="hover:text-gray-300 transition text-[10px] sm:text-xs opacity-50">
                Admin Access
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black py-4 sm:py-6 border-t border-gray-800 text-xs sm:text-sm relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          {/* Social Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="font-semibold text-white text-xs sm:text-sm">KEEP IN TOUCH</span>
            <div className="flex space-x-3 sm:space-x-4 text-white text-base sm:text-lg">
              <Link href="https://www.facebook.com/share/1BZn1bHdS9/" className="hover:text-gray-400 transition">
                <FaFacebookF />
              </Link>
              <Link href="https://www.instagram.com/Fittara.shop?utm_source=qr&igsh=MWtuMjFiaXhuZGJiNg%3D%3D" className="hover:text-gray-400 transition">
                <FaInstagram />
              </Link>
              <Link href="https://youtube.com/@Fittaraofficial?si=vVwYX7w_gjhXUyje" className="hover:text-gray-400 transition">
                <FaYoutube />
              </Link>
            </div>
          </div>

          <Link
            href="/"
            className="bg-white text-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold hover:bg-gray-200 transition"
          >
            Back to Home
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 mt-3 sm:mt-4 text-[10px] sm:text-xs px-4">
          © 2025 Fittara Fashions Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
