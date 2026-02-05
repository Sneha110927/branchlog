import { motion } from "framer-motion";
import { FileCode, GitBranch, TrendingUp } from "lucide-react";
import { StatCard } from "../components/stat-card";
import { RecordCard } from "../components/record-card";

interface DashboardProps {
  onNavigate: (page: string, recordId?: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const mockRecords = [
    {
      id: "1",
      branch: "feature/user-authentication",
      environment: "DEV" as const,
      taskId: "TASK-1234",
      timestamp: "2 hours ago",
      summary: "Implemented JWT authentication with refresh token support and password hashing using bcrypt",
      linesAdded: 234,
      linesRemoved: 45,
      filesChanged: 8,
    },
    {
      id: "2",
      branch: "bugfix/payment-gateway",
      environment: "UAT" as const,
      taskId: "TASK-1256",
      timestamp: "5 hours ago",
      summary: "Fixed payment processing timeout issues and added retry logic for failed transactions",
      linesAdded: 89,
      linesRemoved: 112,
      filesChanged: 4,
    },
    {
      id: "3",
      branch: "hotfix/critical-security",
      environment: "LIVE" as const,
      taskId: "TASK-1289",
      timestamp: "1 day ago",
      summary: "Patched SQL injection vulnerability in user search endpoint and updated dependencies",
      linesAdded: 23,
      linesRemoved: 67,
      filesChanged: 2,
    },
    {
      id: "4",
      branch: "feature/dashboard-analytics",
      environment: "DEV" as const,
      taskId: "TASK-1301",
      timestamp: "2 days ago",
      summary: "Added real-time analytics dashboard with chart components and data visualization",
      linesAdded: 456,
      linesRemoved: 12,
      filesChanged: 12,
    },
  ];

  return (
    <div className="min-h-screen pb-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track and monitor code changes across all environments
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <StatCard
            title="Total Records"
            value="1,247"
            icon={FileCode}
            trend="+12.5% from last month"
            trendUp={true}
            delay={0}
          />
          <StatCard
            title="Changes This Week"
            value="89"
            icon={TrendingUp}
            trend="+8.2% from last week"
            trendUp={true}
            delay={0.1}
          />
          <StatCard
            title="Most Changed File"
            value="api/auth.ts"
            icon={GitBranch}
            trend="34 changes"
            trendUp={true}
            delay={0.2}
          />
        </div>

        {/* Recent Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Recent Records</h2>
            <button
              onClick={() => onNavigate("records")}
              className="text-[#06b6d4] hover:text-[#8b5cf6] transition-colors text-sm font-medium"
            >
              View all →
            </button>
          </div>

          <div className="space-y-4">
            {mockRecords.map((record, index) => (
              <RecordCard
                key={record.id}
                {...record}
                delay={0.1 * index}
                onClick={() => onNavigate("record-details", record.id)}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}