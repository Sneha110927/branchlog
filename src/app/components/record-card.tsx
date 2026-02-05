import { motion } from "framer-motion";
import { Clock, FileCode, Plus, Minus } from "lucide-react";
import { EnvironmentBadge } from "./environment-badge";

interface RecordCardProps {
  id: string;
  branch: string;
  environment: "UAT" | "LIVE" | "DEV";
  taskId: string;
  timestamp: string;
  summary: string;
  linesAdded: number;
  linesRemoved: number;
  filesChanged: number;
  delay?: number;
  onClick?: () => void;
}

export function RecordCard({
  branch,
  environment,
  taskId,
  timestamp,
  summary,
  linesAdded,
  linesRemoved,
  filesChanged,
  delay = 0,
  onClick,
}: RecordCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-lg hover:border-[#06b6d4]/30 transition-all cursor-pointer backdrop-blur-sm group"
    >
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-lg sm:text-xl font-semibold group-hover:text-[#06b6d4] transition-colors truncate">
              {branch}
            </h3>
            <EnvironmentBadge env={environment} />
          </div>
          
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2 flex-wrap">
            <span className="bg-secondary px-2 py-0.5 rounded text-xs font-medium">
              {taskId}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timestamp}
            </span>
          </div>
          
          <p className="text-xs sm:text-sm text-foreground/80 line-clamp-2">{summary}</p>
        </div>
        
        <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-[#10b981]">
              <Plus className="w-4 h-4" />
              <span className="font-medium">{linesAdded}</span>
            </div>
            <div className="flex items-center gap-1 text-[#ef4444]">
              <Minus className="w-4 h-4" />
              <span className="font-medium">{linesRemoved}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FileCode className="w-3 h-3" />
            <span>{filesChanged} {filesChanged === 1 ? "file" : "files"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}