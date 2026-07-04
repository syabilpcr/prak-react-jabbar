import { useState, useEffect, useRef } from "react";

const AnimatedReportChart = ({
  data,
  type = "line",
  title,
  color = "#8E1616",
}) => {
  const canvasRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    let animationFrameId;
    let startTime = null;
    const duration = 1500;

    const animate = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);

      setAnimationProgress(progress);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Schedule updates after the current render
    animationFrameId = requestAnimationFrame((timestamp) => {
      startTime = timestamp;
      setAnimationProgress(0);
      animationFrameId = requestAnimationFrame(animate);
    });

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [data]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = (canvas.width = canvas.clientWidth);
    const height = (canvas.height = canvas.clientHeight);

    ctx.clearRect(0, 0, width, height);

    if (!data || data.length === 0) return;

    const values = data.map((d) => d.value);
    const maxValue = Math.max(...values, 1);
    const minValue = Math.min(...values, 0);
    const range = maxValue - minValue;
    const padding = { top: 20, right: 30, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const stepX = chartWidth / (data.length - 1);

    // Draw grid lines
    ctx.strokeStyle = "#D84040";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = "#9CA3AF";
      ctx.font = "10px Barlow";
      const value = Math.round(maxValue - (i / 4) * range);
      if (type === "revenue") {
        ctx.fillText(`Rp${(value / 1000000).toFixed(0)}M`, 5, y + 3);
      } else {
        ctx.fillText(value.toString(), 5, y + 3);
      }
    }

    if (type === "line") {
      // Draw line with animation
      const animatedValues = values.map(
        (v) => minValue + (v - minValue) * animationProgress,
      );

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;

      animatedValues.forEach((value, index) => {
        const x = padding.left + index * stepX;
        const y =
          padding.top +
          chartHeight -
          ((value - minValue) / range) * chartHeight;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw area under line
      ctx.lineTo(
        padding.left + (data.length - 1) * stepX,
        padding.top + chartHeight,
      );
      ctx.lineTo(padding.left, padding.top + chartHeight);
      ctx.closePath();
      ctx.fillStyle = `${color}20`;
      ctx.fill();

      // Draw points with animation
      animatedValues.forEach((value, index) => {
        const x = padding.left + index * stepX;
        const y =
          padding.top +
          chartHeight -
          ((value - minValue) / range) * chartHeight;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (type === "bar") {
      const barWidth = stepX * 0.6;
      values.forEach((value, index) => {
        const animatedHeight =
          (value / maxValue) * chartHeight * animationProgress;
        const x = padding.left + index * stepX - barWidth / 2;
        const y = padding.top + chartHeight - animatedHeight;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth, animatedHeight);

        if (animationProgress > 0.9) {
          ctx.fillStyle = color;
          ctx.font = "bold 10px Barlow";
          if (type === "revenue") {
            ctx.fillText(
              `Rp${(value / 1000000).toFixed(0)}M`,
              x + barWidth / 2 - 20,
              y - 5,
            );
          } else {
            ctx.fillText(value.toString(), x + barWidth / 2 - 10, y - 5);
          }
        }
      });
    }

    // Draw X axis labels
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "10px Barlow";
    data.forEach((item, index) => {
      const x = padding.left + index * stepX - 15;
      const y = height - padding.bottom + 15;
      ctx.fillText(item.label, x, y);
    });

    // Draw title
    ctx.fillStyle = "#1D1616";
    ctx.font = "bold 12px Barlow";
    ctx.fillText(title, padding.left, 15);
  }, [data, type, animationProgress, color, title]);

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
      <canvas ref={canvasRef} className="w-full h-80" />
    </div>
  );
};

export default AnimatedReportChart;
