import { motion } from "framer-motion";
import { ArrowLeft, Clock, Save, Edit2, Trash2, GitBranch, AlertCircle, FileCode, Plus, Minus, User, Calendar, Tag, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { EnvironmentBadge } from "../components/environment-badge";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface RecordDetailsProps {
  recordId: string;
  onNavigate: (page: string, recordId?: string) => void;
}

export function RecordDetails({ recordId, onNavigate }: RecordDetailsProps) {
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!recordId) return;
    fetch(`/api/records/${recordId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.message) {
          setRecord(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [recordId]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this record? This action cannot be undone.")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/records/${recordId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Record deleted");
        onNavigate("records");
      } else {
        toast.error("Failed to delete record");
      }
    } catch (error) {
      toast.error("Error deleting record");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!record) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl">Record not found</p>
        <Button onClick={() => onNavigate("dashboard")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("records")}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold">{record.taskId}</h1>
                <EnvironmentBadge env={record.environment} />
              </div>
              <h2 className="text-lg text-muted-foreground">{record.title}</h2>
            </div>

            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => onNavigate("create", recordId)}
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete Record"}
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description Card */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-[#06b6d4]" />
                  Summary & Changes
                </h3>
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {record.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Code Diff Viewer */}
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border bg-secondary/20 flex items-center justify-between">
                  <h3 className="font-medium font-mono text-sm">Unified Diff</h3>
                  <div className="text-xs text-muted-foreground font-mono">
                    {record.linesAdded} additions, {record.linesRemoved} deletions
                  </div>
                </div>
                <div className="p-4 overflow-x-auto bg-[#0d1117]">
                  <pre className="font-mono text-xs sm:text-sm leading-relaxed">
                    {record.diff.split("\n").map((line: string, i: number) => (
                      <div
                        key={i}
                        className={`${line.startsWith("+")
                          ? "text-[#10b981] bg-[rgba(16,185,129,0.1)] -mx-4 px-4"
                          : line.startsWith("-")
                            ? "text-[#ef4444] bg-[rgba(239,68,68,0.1)] -mx-4 px-4"
                            : line.startsWith("@@")
                              ? "text-[#06b6d4] py-1"
                              : "text-gray-300"
                          }`}
                      >
                        {line || " "}
                      </div>
                    ))}
                  </pre>
                </div>
              </div>
            </div>

            {/* Sidebar Meta */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                    Details
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-4 h-4 text-[#8b5cf6]" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Author</p>
                        <p className="font-medium text-sm">{record.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <GitBranch className="w-4 h-4 text-[#ec4899]" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Branch</p>
                        <p className="font-medium text-sm font-mono">{record.branch}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-[#06b6d4]" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Created At</p>
                        <p className="font-medium text-sm">
                          {new Date(record.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Tag className="w-3 h-3" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {record.tags && record.tags.length > 0 ? (
                      record.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No tags</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                  Status
                </h4>
                <div className="flex items-center gap-2 text-green-500 bg-green-500/10 p-2 rounded text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Record Saved
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}