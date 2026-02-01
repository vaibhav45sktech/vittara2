import React from 'react';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';

const ComboPage = () => {
  return (
    <div className="min-h-screen bg-black antialiased">
      <Navbar />
      <main className="pt-20">
        <div className="relative w-full h-[70vh]">
          <Image
            src="/s4.jpg"
            alt="Combo Collection"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wide">
              Exclusive
              <span className="block text-white italic font-serif">
                Combo Collection
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 font-light">
              Perfect combinations for the modern connoisseur
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Combo Item 1 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#F3F4F6] hover:border-[#000000]/20 transition-all duration-300 hover:shadow-xl">
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4">
                <Image
                  src="/images/new-collection/Pant 11/pant1.jpg"
                  alt="Pant and Shirt Combo"
                  width={300}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold text-[#000000] mb-2">Classic Pair</h3>
              <p className="text-[#4B5563] mb-3">Perfect combination of premium pants and shirts</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-[#4B5563]">₹15,999</span>
                <button className="px-4 py-2 bg-[#000000] text-white rounded-lg hover:bg-[#4B5563] transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
            
            {/* Combo Item 2 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#F3F4F6] hover:border-[#000000]/20 transition-all duration-300 hover:shadow-xl">
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4">
                <Image
                  src="/images/new-collection/Pant 22/p2.png"
                  alt="Premium Combo"
                  width={300}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold text-[#000000] mb-2">Premium Set</h3>
              <p className="text-[#4B5563] mb-3">Luxury collection with complementary pieces</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-[#4B5563]">₹18,999</span>
                <button className="px-4 py-2 bg-[#000000] text-white rounded-lg hover:bg-[#4B5563] transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
            
            {/* Combo Item 3 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#F3F4F6] hover:border-[#000000]/20 transition-all duration-300 hover:shadow-xl">
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4">
                <Image
                  src="/images/new-collection/Shirts/shirt1.jpg"
                  alt="Style Combo"
                  width={300}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold text-[#000000] mb-2">Style Essential</h3>
              <p className="text-[#4B5563] mb-3">Essential pieces for everyday elegance</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-[#4B5563]">₹12,999</span>
                <button className="px-4 py-2 bg-[#000000] text-white rounded-lg hover:bg-[#4B5563] transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComboPage;