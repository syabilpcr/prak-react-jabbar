import React from "react";
import { motion } from "framer-motion";

export const TestimonialsColumn = (props) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ comment, name, avatar, tag, gradient }, i) => (
                <div 
                  className="p-8 rounded-2xl bg-[#2A1A1A] border border-white/[0.06] hover:border-[#D84040]/30 shadow-lg transition-all duration-300 max-w-xs w-full" 
                  key={i}
                >
                  <div className="text-[13px] text-white/50 leading-relaxed">"{comment}"</div>
                  <div className="flex items-center gap-3 mt-5">
                    <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${gradient || "from-[#8E1616] to-[#D84040]"} flex items-center justify-center text-white text-xs font-black`}>
                      {avatar}
                    </div>
                    <div className="flex flex-col">
                      <div className="text-xs font-semibold tracking-tight text-white">{name}</div>
                      <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold mt-0.5">{tag}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
