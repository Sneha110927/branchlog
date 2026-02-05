import { motion } from "framer-motion";
import { useState } from "react";
import { Filter, Calendar, User, FolderTree } from "lucide-react";
import { RecordCard } from "../components/record-card";
import { EnvironmentBadge } from "../components/environment-badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

interface RecordsListProps {
  onNavigate: (page: string, recordId?: string) => void;
}

export function RecordsList({ onNavigate }: RecordsListProps) {
  const [selectedEnv, setSelectedEnv] = useState<string | null>(null);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

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
      author: "Sarah Chen",
      files: ["src/auth/jwt.ts", "src/auth/middleware.ts", "src/models/user.ts"],
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
      author: "Marcus Johnson",
      files: ["src/payments/processor.ts", "src/payments/retry.ts"],
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
      author: "Alex Rivera",
      files: ["src/api/search.ts", "package.json"],
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
      author: "Emma Watson",
      files: ["src/components/charts/", "src/pages/analytics.tsx", "src/utils/data.ts"],
    },
    {
      id: "5",
      branch: "feature/email-notifications",
      environment: "UAT" as const,
      taskId: "TASK-1312",
      timestamp: "3 days ago",
      summary: "Implemented email notification system with template engine and queue processing",
      linesAdded: 178,
      linesRemoved: 8,
      filesChanged: 6,
      author: "James Park",
      files: ["src/notifications/email.ts", "src/templates/", "src/queue/worker.ts"],
    },
  ];

  const filteredRecords = selectedEnv
    ? mockRecords.filter(r => r.environment === selectedEnv)
    : mockRecords;

  return (
    <div className="min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex gap-6 sm:gap-8">
          {/* Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-72 shrink-0 space-y-6 hidden lg:block"
          >
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-[#06b6d4]" />
                <h3 className="font-semibold text-lg">Filters</h3>
              </div>

              <div className="space-y-6">
                {/* Environment Filter */}
                <div>
                  <Label className="text-sm mb-3 block">Environment</Label>
                  <div className="space-y-2">
                    {(["UAT", "LIVE", "DEV"] as const).map((env) => (
                      <button
                        key={env}
                        onClick={() => setSelectedEnv(selectedEnv === env ? null : env)}
                        className="w-full"
                      >
                        <EnvironmentBadge
                          env={env}
                          className={`w-full justify-center ${
                            selectedEnv === env ? "ring-2 ring-[#06b6d4]/50" : "opacity-60 hover:opacity-100"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <Label className="text-sm mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date Range
                  </Label>
                  <div className="space-y-2">
                    <Input type="date" className="w-full" />
                    <Input type="date" className="w-full" />
                  </div>
                </div>

                {/* Branch Name */}
                <div>
                  <Label className="text-sm mb-3 flex items-center gap-2">
                    <FolderTree className="w-4 h-4" />
                    Branch
                  </Label>
                  <Input placeholder="Filter by branch..." />
                </div>

                {/* Author */}
                <div>
                  <Label className="text-sm mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Author
                  </Label>
                  <Input placeholder="Filter by author..." />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedEnv(null)}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </motion.aside>

          {/* Records Timeline */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 sm:mb-8"
            >
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] bg-clip-text text-transparent">
                Records History
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {filteredRecords.length} record{filteredRecords.length !== 1 ? "s" : ""} found
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#06b6d4] via-[#8b5cf6] to-transparent hidden md:block" />

              <div className="space-y-6">
                {filteredRecords.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative md:pl-12"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-2.5 top-6 w-3 h-3 bg-[#06b6d4] rounded-full border-4 border-background hidden md:block" />

                    <Accordion
                      type="single"
                      collapsible
                      value={expandedRecord === record.id ? record.id : undefined}
                      onValueChange={(value) => setExpandedRecord(value || null)}
                    >
                      <AccordionItem value={record.id} className="border-none">
                        <AccordionTrigger className="hover:no-underline p-0">
                          <RecordCard
                            {...record}
                            onClick={() => {}}
                          />
                        </AccordionTrigger>
                        <AccordionContent>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 ml-4 p-4 bg-secondary/30 rounded-lg border border-border/50"
                          >
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <User className="w-4 h-4 text-[#06b6d4]" />
                              Author: {record.author}
                            </h4>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-muted-foreground">Changed Files:</p>
                              {record.files.map((file, i) => (
                                <div
                                  key={i}
                                  className="text-sm bg-card p-2 rounded border border-border/50 font-mono hover:border-[#06b6d4]/30 transition-colors cursor-pointer"
                                  onClick={() => onNavigate("record-details", record.id)}
                                >
                                  {file}
                                </div>
                              ))}
                            </div>
                            <Button
                              className="mt-4 w-full bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] hover:opacity-90 text-white border-0"
                              onClick={() => onNavigate("record-details", record.id)}
                            >
                              View Full Diff
                            </Button>
                          </motion.div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}