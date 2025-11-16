"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import TarotInput from "@/components/tarot_input";
import VideoCard from "@/components/video_card";

export default function HomePage() {
  const videoRefs = [
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
  ];

  useEffect(() => {
    videoRefs.forEach((ref) => ref.current?.play());
  }, []);

  const fullText = "Your question, the Universe’s answer";
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (indexRef.current < fullText.length) {
        setDisplayedText(fullText.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="relative w-full min-h-screen overflow-y-auto pb-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="relative z-10 flex flex-col items-center mt-16 px-4">
        <motion.h1
          className="text-5xl font-bold tracking-widest mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {displayedText}
          <span className="animate-pulse">|</span>
        </motion.h1>

        <motion.div
          className="w-full max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <TarotInput />
        </motion.div>

        <motion.div
          className="flex gap-12 mt-14 flex-wrap justify-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {videoRefs.map((ref, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
              }}
            >
              <VideoCard
                videoRef={ref}
                src={`main-page-vids/tarot-${i + 1}.mp4`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
