const errorDefaults = {
  400: {
    title: "Permintaan Tidak Valid",
    description:
      "Permintaan yang kamu kirim tidak valid atau tidak dapat diproses.",
    color: "orange",
  },
  401: {
    title: "Tidak Memiliki Akses",
    description:
      "Kamu tidak memiliki izin untuk mengakses halaman ini. Silakan login terlebih dahulu.",
    color: "yellow",
  },
  403: {
    title: "Akses Dilarang",
    description:
      "Akses ke halaman ini dilarang. Kamu tidak memiliki hak akses yang diperlukan.",
    color: "red",
  },
  404: {
    title: "Halaman Tidak Ditemukan",
    description:
      "Halaman yang kamu cari tidak ditemukan. Mungkin sudah dipindahkan atau dihapus.",
    color: "blue",
  },
};

const ErrorPage = ({ errorCode = 404, description, image }) => {
  const defaults = errorDefaults[errorCode] || errorDefaults[404];
  const errorDescription = description || defaults.description;
  const errorTitle = defaults.title;

  const colorMap = {
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-200",
      badge: "bg-orange-100 text-orange-700",
    },
    yellow: {
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      border: "border-yellow-200",
      badge: "bg-yellow-100 text-yellow-700",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
      badge: "bg-red-100 text-red-700",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
      badge: "bg-blue-100 text-blue-700",
    },
  };

  const colors = colorMap[defaults.color] || colorMap.blue;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div
        className={`${colors.bg} ${colors.border} border-2 rounded-3xl p-12 max-w-lg w-full shadow-sm`}
      >
        {image ? (
          <img
            src={image}
            alt={`Error ${errorCode}`}
            className="w-40 h-40 mx-auto mb-6 object-contain"
          />
        ) : (
          <div
            className={`text-8xl font-black ${colors.text} mb-4 leading-none`}
          >
            {errorCode}
          </div>
        )}
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.badge} mb-4`}
        >
          ERROR {errorCode}
        </span>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{errorTitle}</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          {errorDescription}
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-[#8E1616] hover:bg-[#8E1616]/80 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
        >
          ← Kembali ke Beranda
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
