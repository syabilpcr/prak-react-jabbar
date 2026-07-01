import { useEffect, useRef, useState } from "react";

/*
  CountUp — angka yang menghitung naik saat masuk viewport.
  props:
  - end: angka tujuan
  - suffix / prefix: teks tambahan (mis. "K+", "+")
  - duration: durasi animasi (ms)
*/
export default function CountUp({
  end = 0,
  suffix = "",
  prefix = "",
  duration = 1800,
  className = "",
}) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}