import { Badge } from "./ui/badge";

type Environment = "UAT" | "LIVE" | "DEV";

interface EnvironmentBadgeProps {
  env: Environment;
  className?: string;
}

export function EnvironmentBadge({ env, className = "" }: EnvironmentBadgeProps) {
  const styles = {
    UAT: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30 hover:bg-[#f59e0b]/20",
    LIVE: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30 hover:bg-[#ef4444]/20",
    DEV: "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30 hover:bg-[#3b82f6]/20",
  };

  return (
    <Badge 
      variant="outline" 
      className={`${styles[env]} ${className} rounded-full px-3 py-0.5 text-xs font-medium`}
    >
      {env}
    </Badge>
  );
}
