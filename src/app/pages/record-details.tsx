import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Copy, Search, ChevronDown, ChevronRight, FileCode, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { EnvironmentBadge } from "../components/environment-badge";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { DiffEditor } from "@monaco-editor/react";

interface RecordDetailsProps {
  recordId?: string;
  onNavigate: (page: string) => void;
  darkMode: boolean;
}

export function RecordDetails({ onNavigate, darkMode }: RecordDetailsProps) {
  const [selectedFile, setSelectedFile] = useState("src/auth/jwt.ts");
  const [viewMode, setViewMode] = useState<"unified" | "split">("split");
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set(["src/auth/"]));

  const mockRecord = {
    branch: "feature/user-authentication",
    environment: "DEV" as const,
    taskId: "TASK-1234",
    timestamp: "2 hours ago",
    description: "Implemented JWT authentication with refresh token support and password hashing using bcrypt. Added middleware for protected routes and session management.",
    tags: ["authentication", "security", "backend"],
    author: "Sarah Chen",
    filesChanged: [
      {
        path: "src/auth/jwt.ts",
        linesAdded: 127,
        linesRemoved: 12,
        folder: "src/auth/",
      },
      {
        path: "src/auth/middleware.ts",
        linesAdded: 89,
        linesRemoved: 23,
        folder: "src/auth/",
      },
      {
        path: "src/models/user.ts",
        linesAdded: 18,
        linesRemoved: 10,
        folder: "src/models/",
      },
    ],
  };

  const originalCode = `import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthService {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}`;

  const modifiedCode = `import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthService {
  private secretKey: string;
  private refreshSecretKey: string;

  constructor(secretKey: string, refreshSecretKey: string) {
    this.secretKey = secretKey;
    this.refreshSecretKey = refreshSecretKey;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, this.secretKey, { expiresIn: '15m' });
  }

  generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, this.refreshSecretKey, { expiresIn: '7d' });
  }

  verifyToken(token: string, isRefresh: boolean = false): any {
    const secret = isRefresh ? this.refreshSecretKey : this.secretKey;
    return jwt.verify(token, secret);
  }
}`;

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFiles(newExpanded);
  };

  const folders = Array.from(new Set(mockRecord.filesChanged.map(f => f.folder)));

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("records")}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Records
          </Button>
          
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold">{mockRecord.branch}</h1>
                <EnvironmentBadge env={mockRecord.environment} />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                {mockRecord.taskId} • {mockRecord.timestamp} • by {mockRecord.author}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[350px,1fr] gap-6">
          {/* Left Panel - Metadata */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Description Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-3">Description</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{mockRecord.description}</p>
            </div>

            {/* Tags Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {mockRecord.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* AI Summary Card */}
            <div className="bg-gradient-to-br from-[#06b6d4]/10 to-[#8b5cf6]/10 border border-[#06b6d4]/20 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#06b6d4]" />
                <h3 className="font-semibold">AI Summary</h3>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                This change implements a comprehensive JWT-based authentication system with refresh token support. Security is enhanced with increased bcrypt salt rounds (12) and proper token expiration times.
              </p>
            </div>

            {/* Files List */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Changed Files</h3>
                <span className="text-xs text-muted-foreground">{mockRecord.filesChanged.length} files</span>
              </div>

              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search files..." className="pl-9 h-9 text-sm" />
              </div>

              <div className="space-y-1">
                {folders.map((folder) => (
                  <div key={folder}>
                    <button
                      onClick={() => toggleFolder(folder)}
                      className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-secondary/50 rounded text-sm text-muted-foreground transition-colors"
                    >
                      {expandedFiles.has(folder) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      {folder}
                    </button>
                    {expandedFiles.has(folder) && (
                      <div className="ml-6 space-y-1">
                        {mockRecord.filesChanged
                          .filter((f) => f.folder === folder)
                          .map((file) => (
                            <button
                              key={file.path}
                              onClick={() => setSelectedFile(file.path)}
                              className={`flex items-start gap-2 w-full px-2 py-2 rounded text-sm transition-all ${
                                selectedFile === file.path
                                  ? "bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/30"
                                  : "hover:bg-secondary/50 text-foreground/70"
                              }`}
                            >
                              <FileCode className="w-4 h-4 shrink-0 mt-0.5" />
                              <div className="flex-1 text-left">
                                <div className="font-medium break-all">{file.path.split("/").pop()}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  <span className="text-[#10b981]">+{file.linesAdded}</span>
                                  {" / "}
                                  <span className="text-[#ef4444]">-{file.linesRemoved}</span>
                                </div>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Diff Viewer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
          >
            {/* File Header */}
            <div className="border-b border-border p-4 flex items-center justify-between bg-secondary/30">
              <div className="flex items-center gap-3">
                <FileCode className="w-5 h-5 text-[#06b6d4]" />
                <span className="font-mono text-sm font-medium">{selectedFile}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
              </div>
            </div>

            {/* Tabs for View Mode */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "unified" | "split")} className="p-4">
              <TabsList>
                <TabsTrigger value="split">Split View</TabsTrigger>
                <TabsTrigger value="unified">Unified View</TabsTrigger>
              </TabsList>

              <TabsContent value="split" className="mt-4">
                <div className="border border-border rounded-lg overflow-hidden" style={{ height: "600px" }}>
                  <DiffEditor
                    original={originalCode}
                    modified={modifiedCode}
                    language="typescript"
                    theme={darkMode ? "vs-dark" : "light"}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: "on",
                      renderSideBySide: true,
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="unified" className="mt-4">
                <div className="border border-border rounded-lg overflow-hidden" style={{ height: "600px" }}>
                  <DiffEditor
                    original={originalCode}
                    modified={modifiedCode}
                    language="typescript"
                    theme={darkMode ? "vs-dark" : "light"}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: "on",
                      renderSideBySide: false,
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}