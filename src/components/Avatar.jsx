const sizeStyles = {
  xs:  "w-6 h-6 text-[9px]  rounded-md",
  sm:  "w-8 h-8 text-[10px] rounded-lg",
  md:  "w-10 h-10 text-xs   rounded-xl",
  lg:  "w-12 h-12 text-sm   rounded-xl",
  xl:  "w-16 h-16 text-base rounded-2xl",
};

const colorPool = [
  "bg-[#8E1616] text-[#F8EEDF]",
  "bg-amber-600 text-white",
  "bg-green-700 text-white",
  "bg-blue-700 text-white",
  "bg-purple-700 text-white",
  "bg-[#000000] text-[#F8EEDF]",
];

function getColor(name) {
  const idx = name.charCodeAt(0) % colorPool.length;
  return colorPool[idx];
}

export default function Avatar({ name = "?", image, size = "md" }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

  return (
    <div
      className={`
        flex items-center justify-center font-bold flex-shrink-0
        ${sizeStyles[size] || sizeStyles.md}
        ${image ? "" : getColor(name)}
      `}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-inherit"
          style={{ borderRadius: "inherit" }}
        />
      ) : (
        initials
      )}
    </div>
  );
}