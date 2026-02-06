import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowLeft, Upload, Eye, Plus, X, Loader2, Sparkles, Trash2, Save, Github, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { useSession, signIn, signOut } from "next-auth/react";
import { createTwoFilesPatch } from "diff";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { fetchUserRepos, fetchBranches, fetchCommits, fetchCommitDiff, GitHubRepo, GitHubBranch, GitHubCommit } from "../../lib/github-api";

interface CreateRecordProps {
  onNavigate: (page: string, recordId?: string) => void;
  recordId?: string;
}

export function CreateRecord({ onNavigate, recordId }: CreateRecordProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [environment, setEnvironment] = useState<"UAT" | "LIVE" | "DEV">("UAT");
  const [branch, setBranch] = useState("");
  const [taskId, setTaskId] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [diffContent, setDiffContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(!!recordId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [diffMode, setDiffMode] = useState("visual"); // visual | manual

  interface FileEntry {
    id: string;
    name: string;
    original: string;
    modified: string;
  }

  const [files, setFiles] = useState<FileEntry[]>([
    { id: "1", name: "filename.ts", original: "", modified: "" }
  ]);

  // GitHub Integration State
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [repoBranches, setRepoBranches] = useState<GitHubBranch[]>([]);
  const [selectedGithubBranch, setSelectedGithubBranch] = useState<string>("");
  const [repoCommits, setRepoCommits] = useState<GitHubCommit[]>([]);
  const [isFetchingGitHub, setIsFetchingGitHub] = useState(false);

  const fetchRepos = async () => {
    if (!session?.user || !(session.user as any).accessToken) {
      toast.error("Please sign in with GitHub to access detailed repos");
      return;
    }
    setIsFetchingGitHub(true);
    try {
      const repos = await fetchUserRepos((session.user as any).accessToken);
      setGithubRepos(repos);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch repositories");
    } finally {
      setIsFetchingGitHub(false);
    }
  };

  const handleRepoChange = async (repoFullName: string) => {
    setSelectedRepo(repoFullName);
    setSelectedGithubBranch("");
    setRepoBranches([]);
    setRepoCommits([]);

    if (!repoFullName) return;

    const [owner, repo] = repoFullName.split("/");
    setIsFetchingGitHub(true);
    try {
      const branches = await fetchBranches((session?.user as any).accessToken, owner, repo);
      setRepoBranches(branches);
      // Auto-select default or first
      if (branches.length > 0) {
        const defaultBranch = branches.find(b => b.name === "main" || b.name === "master") || branches[0];
        handleBranchChange(defaultBranch.name, owner, repo);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch branches");
    } finally {
      setIsFetchingGitHub(false);
    }
  };

  const handleBranchChange = async (branchName: string, owner?: string, repo?: string) => {
    setSelectedGithubBranch(branchName);
    const [currentOwner, currentRepo] = selectedRepo.split("/");
    const targetOwner = owner || currentOwner;
    const targetRepo = repo || currentRepo;

    setIsFetchingGitHub(true);
    try {
      const commits = await fetchCommits((session?.user as any).accessToken, targetOwner, targetRepo, branchName);
      setRepoCommits(commits);
      setBranch(branchName); // Auto-fill the branch field
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch commits");
    } finally {
      setIsFetchingGitHub(false);
    }
  };

  const handleCommitSelect = async (commitSha: string, commitMsg: string) => {
    const [owner, repo] = selectedRepo.split("/");
    setIsFetchingGitHub(true);
    try {
      const diff = await fetchCommitDiff((session?.user as any).accessToken, owner, repo, commitSha);
      setDiffContent(diff);
      setTitle(commitMsg.split("\n")[0].substring(0, 100)); // Use first line of commit msg
      setDescription(commitMsg);
      setDiffMode("manual"); // Switch to manual to show the diff result
      toast.success("Diff loaded from GitHub!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch commit diff");
    } finally {
      setIsFetchingGitHub(false);
    }
  };

  // Fetch record data if editing
  useEffect(() => {
    if (recordId) {
      const fetchRecord = async () => {
        try {
          const res = await fetch(`/api/records/${recordId}`);
          if (res.ok) {
            const data = await res.json();
            setTitle(data.title);
            setDescription(data.description);
            setEnvironment(data.environment);
            setBranch(data.branch);
            setTaskId(data.taskId);
            setTags(data.tags || []);
            setDiffContent(data.diff);
            // Note: We can't easily populate the "Visual" builder files from raw diff string perfectly 
            // without a complex parser, so we defaults to Manual mode or just showing the diff.
            // For now, let's keep files empty or maybe try to parse simple cases if needed.
            setDiffMode("manual");
          } else {
            toast.error("Failed to load record");
          }
        } catch (error) {
          toast.error("Error loading record");
        } finally {
          setIsLoading(false);
        }
      };

      fetchRecord();
    }
  }, [recordId]);

  const { data: session } = useSession();

  const handleAddFile = () => {
    setFiles([
      ...files,
      { id: Math.random().toString(36).substr(2, 9), name: "", original: "", modified: "" }
    ]);
  };

  const handleRemoveFile = (id: string) => {
    if (files.length > 1) {
      setFiles(files.filter(f => f.id !== id));
    }
  };

  const handleFileChange = (id: string, field: keyof FileEntry, value: string) => {
    setFiles(files.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleGenerateAI = async () => {
    if (!diffContent) {
      toast.error("Please add diff content first");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff: diffContent })
      });
      const data = await res.json();
      if (data.summary) {
        setDescription(data.summary);
        if (data.tags) {
          setTags([...new Set([...tags, ...data.tags])]);
        }
        toast.success("AI Summary Generated!");
      } else {
        toast.error("Failed to generate summary");
      }
    } catch (err) {
      toast.error("AI Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateDiff = () => {
    const validFiles = files.filter(f => f.original.trim() || f.modified.trim());

    if (validFiles.length === 0) {
      toast.error("Please enter code for at least one file");
      return;
    }

    try {
      let combinedDiff = "";

      validFiles.forEach((file) => {
        const fileName = file.name.trim() || "untitled";
        const patch = createTwoFilesPatch(
          `a/${fileName}`,
          `b/${fileName}`,
          file.original,
          file.modified
        );
        combinedDiff += patch + "\n";
      });

      setDiffContent(combinedDiff.trim());
      toast.success("Diff generated successfully");
    } catch (e) {
      toast.error("Error generating diff");
      console.error(e);
    }
  };

  const handleSubmit = async () => {
    if (!environment || !branch || !taskId || !title || !diffContent) {
      toast.error("Please fill in all required fields");
      return;
    }

    const recordData = {
      environment,
      branch,
      taskId,
      title,
      description,
      diff: diffContent,
      tags,
      author: session?.user?.name || "Anonymous"
    };

    setIsSubmitting(true);

    try {
      const method = recordId ? "PUT" : "POST";
      const url = recordId ? `/api/records/${recordId}` : "/api/records";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recordData),
      });

      if (!res.ok) throw new Error("Failed to save record");

      toast.success(recordId ? "Record updated successfully!" : "Record created successfully!");

      // Delay navigation slightly for feedback
      setTimeout(() => {
        onNavigate("dashboard");
      }, 500);

    } catch (error) {
      toast.error(recordId ? "Failed to update record" : "Failed to create record");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
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
            {recordId ? "Edit Record" : "Create New Record"}
          </h1>
          <p className="text-muted-foreground">
            {recordId ? "Update existing deployment details" : "Document code changes and track them across environments"}
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
                <Select value={environment} onValueChange={(val) => setEnvironment(val as "UAT" | "LIVE" | "DEV")}>
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Details</h3>
                <Button variant="secondary" size="sm" onClick={handleGenerateAI} disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Sparkles className="w-3 h-3 mr-2 text-primary" />}
                  Generate with AI
                </Button>
              </div>

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
                <div className="flex items-center gap-2">
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
              </div>

              <Tabs value={diffMode} onValueChange={setDiffMode} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="visual">Visual Builder</TabsTrigger>
                  <TabsTrigger value="manual">Manual Diff input</TabsTrigger>
                  <TabsTrigger value="github">Fetch from GitHub</TabsTrigger>
                </TabsList>

                <TabsContent value="visual" className="space-y-6">
                  {files.map((file, index) => (
                    <div key={file.id} className="p-4 border border-border rounded-lg bg-secondary/10 relative">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-sm">File #{index + 1}</h4>
                        {files.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(file.id)}
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8 px-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="mb-4">
                        <Label className="mb-2 block text-xs">Filename</Label>
                        <Input
                          placeholder="e.g., src/components/Button.tsx"
                          value={file.name}
                          onChange={(e) => handleFileChange(file.id, "name", e.target.value)}
                          className="h-8 text-sm font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="mb-2 block text-xs text-muted-foreground">Original Code</Label>
                          <Textarea
                            placeholder="Paste original code here..."
                            className="font-mono text-xs min-h-[150px]"
                            value={file.original}
                            onChange={(e) => handleFileChange(file.id, "original", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="mb-2 block text-xs text-muted-foreground">Modified Code</Label>
                          <Textarea
                            placeholder="Paste modified code here..."
                            className="font-mono text-xs min-h-[150px]"
                            value={file.modified}
                            onChange={(e) => handleFileChange(file.id, "modified", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-3">
                    <Button onClick={handleAddFile} variant="outline" className="flex-1 gap-2 border-dashed">
                      <Plus className="w-4 h-4" />
                      Add Another File
                    </Button>
                    <Button onClick={handleGenerateDiff} className="flex-1" variant="secondary">
                      Generate Master Diff
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="manual" className="space-y-4">
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
                </TabsContent>

                <TabsContent value="github" className="space-y-6">
                  {status === "loading" ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : !session?.user ? (
                    <div className="text-center py-12 bg-secondary/20 rounded-xl border border-dashed">
                      {/* GitHub Sign In */}
                      <p className="text-muted-foreground mb-4">Please sign in to access GitHub features</p>
                      <Button onClick={() => signIn("github")}>Sign In with GitHub</Button>
                    </div>
                  ) : (
                    <div>
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">Signed in as <span className="font-medium text-foreground">{session.user.name}</span></p>
                          <Button onClick={() => signOut()}>Sign out</Button>
                        </div>
                      </div>
                      <div className="space-y-6">
                        {/* Repos Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Repository</Label>
                            <div className="flex gap-2">
                              <Select value={selectedRepo} onValueChange={handleRepoChange} disabled={isFetchingGitHub}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder={githubRepos.length > 0 ? "Select Repository" : "No repos loaded"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {githubRepos.map(repo => (
                                    <SelectItem key={repo.id} value={repo.full_name}>{repo.full_name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button size="icon" variant="outline" onClick={fetchRepos} disabled={isFetchingGitHub}>
                                {isFetchingGitHub ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                              </Button>
                            </div>
                            {githubRepos.length === 0 && !isFetchingGitHub && (
                              <p className="text-xs text-muted-foreground">Click refresh to load your repositories</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Branch</Label>
                            <Select value={selectedGithubBranch} onValueChange={(val) => handleBranchChange(val)} disabled={!selectedRepo || isFetchingGitHub}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Branch" />
                              </SelectTrigger>
                              <SelectContent>
                                {repoBranches.map(branch => (
                                  <SelectItem key={branch.name} value={branch.name}>{branch.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Commits List */}
                        {repoCommits.length > 0 && (
                          <div className="space-y-2">
                            <Label>Recent Commits</Label>
                            <div className="border rounded-xl divide-y bg-card max-h-[400px] overflow-y-auto">
                              {repoCommits.map(commit => (
                                <div key={commit.sha} className="p-4 hover:bg-secondary/50 transition-colors flex justify-between items-start gap-4">
                                  <div className="space-y-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{commit.commit.message}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <span className="font-mono bg-secondary px-1.5 py-0.5 rounded">{commit.sha.substring(0, 7)}</span>
                                      <span>•</span>
                                      <span>{commit.commit.author.name}</span>
                                      <span>•</span>
                                      <span>{new Date(commit.commit.author.date).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleCommitSelect(commit.sha, commit.commit.message)}
                                    disabled={isFetchingGitHub}
                                  >
                                    Use
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
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
                      className={`${line.startsWith("+")
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



        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                className="w-full h-12 text-lg font-medium"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {recordId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {recordId ? "Update Record" : "Create Record"}
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
