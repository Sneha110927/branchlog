import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-semibold mb-2">{value}</h3>
          {trend && (
            <p className={`text-sm ${trendUp ? "text-[#10b981]" : "text-[#ef4444]"}`}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-gradient-to-br from-[#06b6d4]/10 to-[#8b5cf6]/10 border border-[#06b6d4]/20">
          <Icon className="w-6 h-6 text-[#06b6d4]" />
        </div>
      </div>
    </motion.div>
  );
}
