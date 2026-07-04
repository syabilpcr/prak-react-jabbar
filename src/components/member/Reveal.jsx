import { useEffect, useRef, useState } from "react";

/*
  Reveal — animasi muncul saat elemen masuk viewport (scroll-triggered).
  Pakai IntersectionObserver, ringan tanpa library tambahan.

  props:
  - direction: "up" | "left" | "right" | "scale" (default "up")
  - delay: ms penundaan (untuk efek bertahap/stagger)
  - className: kelas tambahan untuk wrapper
*/
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}) {

  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hidden = {
    up: "opacity-0 translate-y-10",
    left: "opacity-0 -translate-x-10",
    right: "opacity-0 translate-x-10",
    scale: "opacity-0 scale-95",
  }[direction];

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0 translate-x-0 scale-100" : hidden
      } ${className}`}
    >
      {children}
    </div>
  );
}