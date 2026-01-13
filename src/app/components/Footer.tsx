"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const pantShirtCategories = [
  "Formal Pants",
  "Casual Pants",
  "Tailored Trousers",
  "Formal Shirts",
  "Casual Shirts",
];

const supportLinks = ["Track Order", "Contact Us", "My Account"];

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
      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 z-10 relative text-sm">
        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-400">PRODUCT CATEGORIES</h3>
          <ul className="space-y-2">
            {pantShirtCategories.map((item) => (
              <li key={item}>
                <Link href="#" className="hover:text-gray-300 transition text-white">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-400">SUPPORT</h3>
          <ul className="space-y-2">
            {supportLinks.map((item) => (
              <li key={item}>
                <Link href="#" className="hover:text-gray-300 transition text-white">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-400">CONTACT</h3>
          <ul className="space-y-2 text-white">
            <li>
              <a
                href="mailto:fittaraofficial@gmail.com"
                className="hover:text-gray-300 transition"
              >
                fittaraofficial@gmail.com
              </a>
            </li>
            <li>+91 70467 89748</li>
            <li>10 am - 7 pm, Monday - Saturday</li>
            <li>
              <Link href="/admin/orders" className="hover:text-gray-300 transition text-xs opacity-50">
                Admin Access
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black py-6 border-t border-gray-800 text-sm relative z-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-white">KEEP IN TOUCH</span>
            <div className="flex space-x-4 text-white text-lg">
              <Link href="https://www.facebook.com/share/1BZn1bHdS9/" className="hover:text-gray-400 transition">
                <FaFacebookF />
              </Link>
              <Link href="https://www.instagram.com/fittara.shop?utm_source=qr&igsh=MWtuMjFiaXhuZGJiNg%3D%3D" className="hover:text-gray-400 transition">
                <FaInstagram />
              </Link>
              <Link href="https://youtube.com/@fittaraofficial?si=vVwYX7w_gjhXUyje" className="hover:text-gray-400 transition">
                <FaYoutube />
              </Link>
            </div>
          </div>

          <Link
            href="/"
            className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold hover:bg-gray-200 transition"
          >
            Back to Home
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 mt-4 text-xs">
          © 2025 Fittara Fashions Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
