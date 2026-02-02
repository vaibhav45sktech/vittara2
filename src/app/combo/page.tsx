import React from 'react';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';
import { getAllCombos } from '@/app/actions/comboActions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ComboPage() {
  const combos = await getAllCombos();

  return (
    <div className="min-h-screen bg-black antialiased">
      <Navbar />
      <main>
        {/* Mobile Banner - Natural Aspect Ratio */}
        <div className="relative w-full md:hidden">
          <img
            src="/s4.jpg"
            alt="Combo Collection"
            className="w-full h-auto display-block"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end justify-center pb-6">
            <h1 className="text-3xl font-bold text-white tracking-widest text-center drop-shadow-2xl">
              <span className="block mb-1 font-serif italic text-amber-400 text-lg">The Perfect</span>
              MATCH
            </h1>
          </div>
        </div>

        {/* Desktop Banner - Fixed Height */}
        <div className="hidden md:block relative w-full h-[70vh]">
          <Image
            src="/s4.jpg"
            alt="Combo Collection"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end justify-center pb-20">
            <h1 className="text-7xl font-bold text-white tracking-widest text-center drop-shadow-2xl">
              <span className="block mb-2 font-serif italic text-amber-400">The Perfect</span>
              MATCH
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-wide">
              Exclusive
              <span className="text-amber-500 font-serif italic ml-3">
                Combos
              </span>
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Curated combinations for the modern connoisseur. Experience the perfect harmony of style and comfort.
            </p>
          </div>

          {combos.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-2xl">No combos available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {combos.map((combo) => (
                <div
                  key={combo.id}
                  className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/10 flex flex-col"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {combo.image ? (
                      <Image
                        src={combo.image}
                        alt={combo.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">
                        No Image
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-amber-200 text-sm font-medium mb-1 tracking-wider uppercase">Included</p>
                      <ul className="text-white text-sm space-y-1">
                        {combo.ComboItem.map(item => (
                          <li key={item.id} className="flex justify-between">
                            <span>{item.itemName}</span>
                            {/* <span className="opacity-70">₹{item.itemPrice}</span> */}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                      {combo.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                      {combo.description || "A perfect match."}
                    </p>

                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-800">
                      <div>
                        <span className="text-xs text-gray-500 block">Total Price</span>
                        <span className="text-2xl font-bold text-white">₹{combo.price.toLocaleString('en-IN')}</span>
                      </div>
                      <Link
                        href={`/combo/${combo.id}`}
                        className="px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95 text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};