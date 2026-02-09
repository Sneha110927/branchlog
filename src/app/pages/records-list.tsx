import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Filter, Calendar, User, FolderTree, Loader2 } from "lucide-react";
import { RecordCard } from "../components/record-card";
import { EnvironmentBadge } from "../components/environment-badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

interface RecordsListProps {
  onNavigate: (page: string, recordId?: string) => void;
  selectedEnv: string | null;
  onEnvChange?: (env: string | null) => void;
}

export function RecordsList({ onNavigate, selectedEnv, onEnvChange }: RecordsListProps) {
  // const [selectedEnv, setSelectedEnv] = useState<string | null>(null); // Lifted to App
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Filter States
  const [branchFilter, setBranchFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedEnv) params.append("environment", selectedEnv);
    if (branchFilter) params.append("branch", branchFilter);
    if (authorFilter) params.append("author", authorFilter);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    fetch(`/api/records?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRecords(data);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [selectedEnv, branchFilter, authorFilter, startDate, endDate]);

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
                        onClick={() => onEnvChange?.(selectedEnv === env ? null : env)}
                        className="w-full"
                      >
                        <EnvironmentBadge
                          env={env}
                          className={`w-full justify-center ${selectedEnv === env ? "ring-2 ring-[#06b6d4]/50" : "opacity-60 hover:opacity-100"
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
                    <Input type="date" className="w-full" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <Input type="date" className="w-full" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>

                {/* Branch Name */}
                <div>
                  <Label className="text-sm mb-3 flex items-center gap-2">
                    <FolderTree className="w-4 h-4" />
                    Branch
                  </Label>
                  <Input placeholder="Filter by branch..." value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} />
                </div>

                {/* Author */}
                <div>
                  <Label className="text-sm mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Author
                  </Label>
                  <Input placeholder="Filter by author..." value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    onEnvChange?.(null);
                    setBranchFilter("");
                    setAuthorFilter("");
                    setStartDate("");
                    setEndDate("");
                  }}
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
                {records.length} record{records.length !== 1 ? "s" : ""} found
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#06b6d4] via-[#8b5cf6] to-transparent hidden md:block" />

              <div className="space-y-6">
                {loading ? (
                  <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                ) : records.map((record, index) => (
                  <motion.div
                    key={record._id || record.id}
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
                      value={expandedRecord === (record._id || record.id) ? (record._id || record.id) : undefined}
                      onValueChange={(value) => setExpandedRecord(value || null)}
                    >
                      <AccordionItem value={record._id || record.id} className="border-none">
                        <AccordionTrigger className="hover:no-underline p-0">
                          <RecordCard
                            {...record}
                            // Pass ID explicitly as string if needed
                            id={record._id || record.id}
                            onClick={() => { }}
                            // Adapt createAt to timestamp prop if RecordCard needs it
                            timestamp={new Date(record.createdAt).toLocaleString()}
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
                              {/* If no files info in DB, hide changed files or show something else */}
                              {record.files && (
                                <>
                                  <p className="text-sm font-medium text-muted-foreground">Changed Files:</p>
                                  {record.files.map((file: string, i: number) => (
                                    <div
                                      key={i}
                                      className="text-sm bg-card p-2 rounded border border-border/50 font-mono hover:border-[#06b6d4]/30 transition-colors cursor-pointer"
                                      onClick={() => onNavigate("record-details", record._id || record.id)}
                                    >
                                      {file}
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                            <Button
                              className="mt-4 w-full bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] hover:opacity-90 text-white border-0"
                              onClick={() => onNavigate("record-details", record._id || record.id)}
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