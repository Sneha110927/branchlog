import { motion } from "framer-motion";
import { FileCode, GitBranch, TrendingUp, Loader2, ShieldCheck } from "lucide-react";
import { StatCard } from "../components/stat-card";
import { RecordCard } from "../components/record-card";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "../components/ui/button";

interface DashboardProps {
  onNavigate: (page: string, recordId?: string) => void;
  selectedEnv?: string | null;
}

export function Dashboard({ onNavigate, selectedEnv }: DashboardProps) {
  const { data: session, status } = useSession();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      setLoading(false);
      return;
    }

    const params = new URLSearchParams({ limit: "5" });
    if (selectedEnv) params.append("environment", selectedEnv);

    fetch(`/api/records?${params.toString()}`)
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRecords(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [status, selectedEnv]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#06b6d4]" /></div>;
  }

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
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track and monitor code changes across all environments
          </p>
        </motion.div>

        {!session ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-card/50 rounded-3xl border border-border/50"
          >
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <ShieldCheck className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Welcome to BranchLog</h2>
            <p className="text-muted-foreground max-w-md">
              Please log in to view team records, track changes, and manage your development workflow securely.
            </p>
            <Button
              size="lg"
              onClick={() => onNavigate("login")}
              className="bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6]"
            >
              Log In to Continue
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <StatCard
                title="Total Records"
                value={records.length.toString()}
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
                {records.length === 0 ? (
                  <p className="text-muted-foreground">No records found. Create one!</p>
                ) : (
                  records.map((record, index) => (
                    <RecordCard
                      key={record._id || record.id}
                      id={record._id || record.id}
                      {...record}
                      delay={0.1 * index}
                      onClick={() => onNavigate("record-details", record._id || record.id)}
                    />
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}