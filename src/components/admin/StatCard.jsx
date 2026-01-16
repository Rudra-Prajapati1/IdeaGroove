import { FileText, Eye, Ban } from "lucide-react";

const iconMap = {
  total: FileText,
  pending: Eye,
  blocked: Ban,
};

const themeMap = {
  green: {
    border: "border-green-300",
    iconBg: "bg-green-100",
    iconText: "text-green-600",
    accent: "text-green-600",
    info: "text-green-500",
  },
  yellow: {
    border: "border-yellow-300",
    iconBg: "bg-yellow-100",
    iconText: "text-yellow-600",
    accent: "text-yellow-600",
    info: "text-yellow-500",
  },
  red: {
    border: "border-red-300",
    iconBg: "bg-red-100",
    iconText: "text-red-600",
    accent: "text-red-600",
    info: "text-red-500",
  },
};

const StatCard = ({
  title,
  value,
  infoText,
  color = "green",
  type = "total",
}) => {
  const Icon = iconMap[type];
  const theme = themeMap[color];

  return (
    <div
      className={`
        bg-white border ${theme.border}
        rounded-2xl p-6
        flex items-center justify-between
        transition-all duration-300
        hover:shadow-md
      `}
    >
      {/* LEFT CONTENT */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
          {title}
        </span>

        <span className="text-4xl font-bold text-gray-900">{value}</span>

        {infoText && (
          <span className={`text-sm font-medium ${theme.info}`}>
            {infoText}
          </span>
        )}
      </div>

      {/* ICON */}
      <div
        className={`
          w-12 h-12 rounded-full
          flex items-center justify-center
          ${theme.iconBg} ${theme.iconText}
        `}
      >
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default StatCard;
