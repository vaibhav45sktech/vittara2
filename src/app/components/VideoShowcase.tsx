"use client";

import { motion } from "framer-motion";

const VideoShowcase = () => {
  const reels = [
    "https://www.instagram.com/reel/DThlQD0gbcM/",
    "https://www.instagram.com/p/DTPe3WNCRHt/",
    "https://www.instagram.com/reel/DTNsnTfAQLU/",
    "https://www.instagram.com/reel/DTuGZmJAc7e/",
  ];

  return (
    <section className="relative w-full py-16 md:py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Behind the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Craft</span>
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Discover the artistry and attention to detail that goes into every Fittara piece
          </p>
        </motion.div>

        <div className="flex flex-row gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {reels.map((reelUrl, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
              style={{ width: '280px', height: '500px' }}
            >
              <iframe
                src={`${reelUrl}embed/captioned/`}
                className="w-full h-full"
                frameBorder="0"
                scrolling="no"

                allow="encrypted-media"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
