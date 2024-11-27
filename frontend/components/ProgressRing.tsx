import { cn } from "@/lib/utils"

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({ progress, size = 16, strokeWidth = 2 }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      {/* 背景圆环 */}
      <circle
        className="text-muted/20"
        stroke="currentColor"
        fill="none"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* 进度圆环 */}
      <circle
        className={cn(
          "transition-all duration-300",
          progress >= 75 ? "text-green-500" :
          progress >= 50 ? "text-blue-500" :
          progress >= 25 ? "text-yellow-500" :
          "text-gray-500"
        )}
        stroke="currentColor"
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  )
} 