import { useEffect, useRef } from "react";

const ReportChart = ({ data, type = "line", title }) => {
  const canvasRef = useRef(null);

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
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const stepX = chartWidth / (data.length - 1);

    ctx.strokeStyle = "#D84040";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    if (type === "line") {
      ctx.beginPath();
      ctx.strokeStyle = "#8E1616";
      ctx.lineWidth = 2.5;
      values.forEach((value, index) => {
        const x = padding + index * stepX;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      values.forEach((value, index) => {
        const x = padding + index * stepX;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;
        ctx.fillStyle = "#8E1616";
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
        const x = padding + index * stepX - barWidth / 2;
        const barHeight = (value / maxValue) * chartHeight;
        const y = padding + chartHeight - barHeight;
        ctx.fillStyle = "#8E1616";
        ctx.fillRect(x, y, barWidth, barHeight);
      });
    }

    ctx.fillStyle = "#9CA3AF";
    ctx.font = "10px Barlow";
    data.forEach((item, index) => {
      const x = padding + index * stepX - 15;
      const y = height - padding + 15;
      ctx.fillText(item.label, x, y);
    });
    ctx.fillStyle = "#1D1616";
    ctx.font = "bold 12px Barlow";
    ctx.fillText(title, padding, 20);
  }, [data, type]);

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      {title && (
        <h3 className="text-sm font-bold text-[#1D1616] mb-4">{title}</h3>
      )}
      <canvas ref={canvasRef} className="w-full h-64" />
    </div>
  );
};

export default ReportChart;
