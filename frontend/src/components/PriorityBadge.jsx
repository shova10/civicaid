import { ArrowUp, ArrowRight, ArrowDown, Minus } from "lucide-react";

const PRIORITY_CONFIG = {
  critical: {
    label: "Critical",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    Icon: ArrowUp,
    iconColor: "text-red-500",
  },
  high: {
    label: "High",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    Icon: ArrowUp,
    iconColor: "text-orange-500",
  },
  medium: {
    label: "Medium",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    Icon: ArrowRight,
    iconColor: "text-yellow-500",
  },
  low: {
    label: "Low",
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    Icon: ArrowDown,
    iconColor: "text-slate-400",
  },
  none: {
    label: "No Priority",
    bg: "bg-gray-50",
    text: "text-gray-400",
    border: "border-gray-200",
    Icon: Minus,
    iconColor: "text-gray-400",
  },
};

const DEFAULT = PRIORITY_CONFIG.none;

/**
 * PriorityBadge
 * @param {string} priority - one of: critical | high | medium | low | none
 * @param {string} size     - "sm" | "md" (default "md")
 */
export default function PriorityBadge({ priority, size = "md" }) {
  const cfg = PRIORITY_CONFIG[priority] ?? DEFAULT;
  const { Icon } = cfg;

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5 gap-1"
      : "text-xs font-medium px-2.5 py-1 gap-1.5";

  const iconSize = size === "sm" ? 10 : 11;

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium tracking-wide
        ${cfg.bg} ${cfg.text} ${cfg.border} ${sizeClasses}`}
    >
      <Icon size={iconSize} className={cfg.iconColor} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}