import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ScrollExpandMedia = ({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand = "Gulir untuk Masuk",
  textBlend = false,
  children,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobileState, setIsMobileState] = useState(false);

  const sectionRef = useRef(null);

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.003; // Increase sensitivity a bit
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.015 : 0.01;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = () => {
      setTouchStartY(0);
    };

    const handleScroll = () => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const mediaWidth = 280 + scrollProgress * (isMobileState ? 600 : 1250);
  const mediaHeight = 360 + scrollProgress * (isMobileState ? 250 : 450);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <div
      ref={sectionRef}
      className="transition-colors duration-700 ease-in-out overflow-x-hidden min-h-screen w-full"
    >
      <section className="relative flex flex-col items-center justify-start min-h-screen w-full">
        <div className="relative w-full flex flex-col items-center min-h-screen">
          {/* Background Image */}
          <motion.div
            className="absolute inset-0 z-0 h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <img
              src={bgImageSrc}
              alt="Background"
              className="w-full h-full object-cover"
              priority="true"
            />
            <div className="absolute inset-0 bg-[#070708]/90" />
          </motion.div>

          <div className="container mx-auto flex flex-col items-center justify-start relative z-10 w-full">
            <div className="flex flex-col items-center justify-center w-full h-screen relative">
              
              {/* Central Expanding Frame */}
              <div
                className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-3xl overflow-hidden"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: "100vw",
                  maxHeight: "100vh",
                  boxShadow: "0px 0px 80px rgba(0, 0, 0, 0.6)",
                  borderRadius: scrollProgress >= 0.95 ? "0px" : "24px",
                }}
              >
                {mediaType === "video" ? (
                  <div className="relative w-full h-full pointer-events-none">
                    <video
                      src={mediaSrc}
                      poster={posterSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover"
                      controls={false}
                    />
                    <motion.div
                      className="absolute inset-0 bg-black"
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 0.5 - scrollProgress * 0.5 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={mediaSrc}
                      alt={title || "Media content"}
                      className="w-full h-full object-cover"
                    />
                    <motion.div
                      className="absolute inset-0 bg-black"
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 0.5 - scrollProgress * 0.5 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}

                {/* Subtitle helper */}
                <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center text-center z-20">
                  {scrollToExpand && (
                    <motion.p
                      className="text-white/60 text-[10px] uppercase font-bold tracking-[0.25em]"
                      style={{ opacity: 1 - scrollProgress }}
                    >
                      {scrollToExpand}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Title Text */}
              <div
                className={`flex items-center justify-center text-center gap-2 w-full relative z-10 transition-none flex-col ${
                  textBlend ? "mix-blend-difference" : "mix-blend-normal"
                }`}
                style={{ opacity: 1 - scrollProgress }}
              >
                <motion.h2
                  className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight"
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mt-1"
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>
            </div>

            {/* Child content reveal when expanded */}
            {showContent && (
              <motion.section
                className="flex flex-col w-full min-h-screen items-center justify-center relative z-20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {children}
              </motion.section>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
