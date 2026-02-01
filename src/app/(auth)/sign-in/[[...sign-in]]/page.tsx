"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const SignInPage = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-[#FFFFFF] via-[#F3F4F6] to-[#E5E7EB] overflow-hidden">
      
      {/* Decorative Ornaments - keeping it subtle */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#000000]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#000000]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md px-4 flex flex-col items-center">
        
        {/* Logo */}
        <div className="mb-8 text-center animate-fade-in flex flex-col items-center">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-16 h-16 transition-transform duration-500 group-hover:scale-110">
                <Image
                  src="/images/Fittara-symbol-white.png"
                  alt="Fittara Symbol"
                  fill
                  className="object-contain invert"
                  priority
                />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-serif text-black tracking-wide leading-none">
                  Fittara
                </h1>
                <p className="text-[0.6rem] text-black/80 tracking-[0.2em] mt-1 font-medium">
                  YOUR VISION. YOUR FIT. YOUR Fittara
                </p>
              </div>
            </Link>
        </div>

        {/* Card */}
        <div className="w-full bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col items-center animate-scale-in transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            
            <h2 className="text-3xl font-bold text-[#000000] mb-2 font-serif text-center">Welcome Back</h2>
            <p className="text-[#4B5563]/80 text-center mb-8 text-sm max-w-xs">
              Sign in to continue your journey through our exclusive collection.
            </p>

            <SignIn 
                appearance={{
                    elements: {
                        rootBox: "w-full",
                        card: "bg-transparent shadow-none w-full border-none p-0",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "bg-white border-2 border-[#F3F4F6] hover:bg-[#FFFFFF] hover:border-[#000000]/30 text-[#000000] transition-all duration-200 rounded-xl py-2.5",
                        socialButtonsBlockButtonText: "font-semibold",
                        dividerLine: "bg-[#F3F4F6]",
                        dividerText: "text-[#4B5563]/60 bg-transparent",
                        formFieldLabel: "text-[#000000] font-semibold",
                        formFieldInput: "bg-white border-2 border-[#F3F4F6] focus:border-[#000000] text-[#000000] rounded-xl py-2.5 transition-all duration-200",
                        formButtonPrimary: "bg-gradient-to-r from-[#000000] to-[#333333] hover:bg-[#1F2937] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 rounded-xl py-3 font-bold tracking-wide normal-case",
                        footerActionLink: "text-[#000000] hover:text-[#333333] font-semibold underline decoration-2 decoration-transparent hover:decoration-[#000000] transition-all",
                        identityPreviewText: "text-[#000000]",
                        formFieldInputShowPasswordButton: "text-[#000000] hover:text-[#333333]",
                    },
                    layout: {
                        socialButtonsPlacement: "top",
                        logoPlacement: "none"
                    }
                }}
            />
        </div>

        {/* Back Link */}
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-[#4B5563] hover:text-[#000000] font-medium transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </div>

       <style jsx global>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.98);
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1);
            transform: translateY(0);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default SignInPage;
