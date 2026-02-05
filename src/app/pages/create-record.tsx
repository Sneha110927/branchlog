import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Upload, Eye, Plus, X, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

interface CreateRecordProps {
  onNavigate: (page: string) => void;
}

export function CreateRecord({ onNavigate }: CreateRecordProps) {
  const [environment, setEnvironment] = useState("");
  const [branch, setBranch] = useState("");
  const [taskId, setTaskId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [diffContent, setDiffContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    if (!environment || !branch || !taskId || !title || !diffContent) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.success("Record created successfully!");
    setIsSubmitting(false);
    onNavigate("dashboard");
  };

  const sampleDiff = `diff --git a/src/auth/jwt.ts b/src/auth/jwt.ts
index 1234567..abcdefg 100644
--- a/src/auth/jwt.ts
+++ b/src/auth/jwt.ts
@@ -1,10 +1,20 @@
 import jwt from 'jsonwebtoken';
 import bcrypt from 'bcrypt';
 
 export class AuthService {
   private secretKey: string;
+  private refreshSecretKey: string;
 
-  constructor(secretKey: string) {
+  constructor(secretKey: string, refreshSecretKey: string) {
     this.secretKey = secretKey;
+    this.refreshSecretKey = refreshSecretKey;
   }
 }`;

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("dashboard")}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] bg-clip-text text-transparent">
            Create New Record
          </h1>
          <p className="text-muted-foreground">
            Document code changes and track them across environments
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Basic Info Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-lg mb-4">Basic Information</h3>

              {/* Environment */}
              <div>
                <Label htmlFor="environment" className="mb-2 block">
                  Environment <span className="text-[#ef4444]">*</span>
                </Label>
                <Select value={environment} onValueChange={setEnvironment}>
                  <SelectTrigger id="environment">
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DEV">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                        DEV - Development
                      </div>
                    </SelectItem>
                    <SelectItem value="UAT">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                        UAT - User Acceptance Testing
                      </div>
                    </SelectItem>
                    <SelectItem value="LIVE">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                        LIVE - Production
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Branch Name */}
              <div>
                <Label htmlFor="branch" className="mb-2 block">
                  Branch Name <span className="text-[#ef4444]">*</span>
                </Label>
                <Input
                  id="branch"
                  placeholder="feature/user-authentication"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
              </div>

              {/* Task ID */}
              <div>
                <Label htmlFor="taskId" className="mb-2 block">
                  Task ID <span className="text-[#ef4444]">*</span>
                </Label>
                <Input
                  id="taskId"
                  placeholder="TASK-1234"
                  value={taskId}
                  onChange={(e) => setTaskId(e.target.value)}
                />
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title" className="mb-2 block">
                  Title <span className="text-[#ef4444]">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Brief description of changes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-lg mb-4">Details</h3>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="mb-2 block">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the changes made..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags" className="mb-2 block">
                  Tags
                </Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="tags"
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button onClick={handleAddTag} size="icon" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-[#ef4444]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Diff Input */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Diff Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Code Changes</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? "Hide" : "Show"} Preview
                </Button>
              </div>

              <div>
                <Label htmlFor="diff" className="mb-2 block">
                  Unified Diff <span className="text-[#ef4444]">*</span>
                </Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Paste your git diff output or use the sample below
                </p>
                <Textarea
                  id="diff"
                  placeholder="Paste your git diff here..."
                  rows={16}
                  value={diffContent}
                  onChange={(e) => setDiffContent(e.target.value)}
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDiffContent(sampleDiff)}
                  className="mt-2 gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Use Sample Diff
                </Button>
              </div>
            </div>

            {/* Preview Card */}
            {showPreview && diffContent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-6 shadow-sm"
              >
                <h3 className="font-semibold text-lg mb-4">Preview</h3>
                <div className="bg-secondary/30 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  {diffContent.split("\n").map((line, i) => (
                    <div
                      key={i}
                      className={`${
                        line.startsWith("+")
                          ? "text-[#10b981] bg-[var(--diff-add-bg)]"
                          : line.startsWith("-")
                          ? "text-[#ef4444] bg-[var(--diff-remove-bg)]"
                          : line.startsWith("@@")
                          ? "text-[#06b6d4]"
                          : ""
                      } px-2 py-0.5`}
                    >
                      {line || " "}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex justify-end gap-3"
        >
          <Button variant="outline" onClick={() => onNavigate("dashboard")}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] hover:opacity-90 text-white border-0 gap-2 min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Record
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
