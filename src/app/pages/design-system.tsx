import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { EnvironmentBadge } from "../components/environment-badge";
import { StatCard } from "../components/stat-card";
import { RecordCard } from "../components/record-card";
import { FileCode, Plus, Minus, GitBranch } from "lucide-react";

export function DesignSystem() {
  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] bg-clip-text text-transparent">
            Design System
          </h1>
          <p className="text-muted-foreground">
            BranchLog component library and design tokens
          </p>
        </motion.div>

        <div className="space-y-16">
          {/* Colors */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Colors</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Primary Accents</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-[#06b6d4] shadow-lg" />
                    <div>
                      <p className="text-sm font-medium">Cyan</p>
                      <p className="text-xs text-muted-foreground">#06b6d4</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-[#8b5cf6] shadow-lg" />
                    <div>
                      <p className="text-sm font-medium">Violet</p>
                      <p className="text-xs text-muted-foreground">#8b5cf6</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Environment</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-[#3b82f6] shadow-lg" />
                    <div>
                      <p className="text-sm font-medium">DEV</p>
                      <p className="text-xs text-muted-foreground">#3b82f6</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-[#f59e0b] shadow-lg" />
                    <div>
                      <p className="text-sm font-medium">UAT</p>
                      <p className="text-xs text-muted-foreground">#f59e0b</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-[#ef4444] shadow-lg" />
                    <div>
                      <p className="text-sm font-medium">LIVE</p>
                      <p className="text-xs text-muted-foreground">#ef4444</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Diff Colors</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-[#10b981] shadow-lg" />
                    <div>
                      <p className="text-sm font-medium">Added</p>
                      <p className="text-xs text-muted-foreground">#10b981</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-[#ef4444] shadow-lg" />
                    <div>
                      <p className="text-sm font-medium">Removed</p>
                      <p className="text-xs text-muted-foreground">#ef4444</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-[#f59e0b] shadow-lg" />
                    <div>
                      <p className="text-sm font-medium">Modified</p>
                      <p className="text-xs text-muted-foreground">#f59e0b</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Gradients</h3>
                <div className="space-y-2">
                  <div className="w-full h-16 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#22d3ee] shadow-lg" />
                  <div className="w-full h-16 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] shadow-lg" />
                  <div className="w-full h-16 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] shadow-lg" />
                </div>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Typography</h2>
            <div className="bg-card border border-border rounded-xl p-8 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-1">Heading 1</h1>
                <p className="text-sm text-muted-foreground">text-4xl font-bold</p>
              </div>
              <div>
                <h2 className="text-3xl font-semibold mb-1">Heading 2</h2>
                <p className="text-sm text-muted-foreground">text-3xl font-semibold</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-1">Heading 3</h3>
                <p className="text-sm text-muted-foreground">text-2xl font-semibold</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Heading 4</h4>
                <p className="text-sm text-muted-foreground">text-xl font-semibold</p>
              </div>
              <div>
                <p className="text-base mb-1">Body text - The quick brown fox jumps over the lazy dog</p>
                <p className="text-sm text-muted-foreground">text-base</p>
              </div>
              <div>
                <p className="text-sm mb-1">Small text - The quick brown fox jumps over the lazy dog</p>
                <p className="text-sm text-muted-foreground">text-sm</p>
              </div>
              <div>
                <p className="text-xs mb-1">Extra small text - The quick brown fox jumps over the lazy dog</p>
                <p className="text-sm text-muted-foreground">text-xs</p>
              </div>
            </div>
          </section>

          {/* Spacing */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Spacing Scale</h2>
            <div className="bg-card border border-border rounded-xl p-8 space-y-4">
              {[1, 2, 3, 4, 6, 8, 12, 16, 24].map((size) => (
                <div key={size} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-muted-foreground">{size * 4}px</div>
                  <div className="h-8 bg-[#06b6d4] rounded" style={{ width: `${size * 4}px` }} />
                  <div className="text-sm font-mono text-muted-foreground">gap-{size} / p-{size} / m-{size}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Buttons */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
            <div className="bg-card border border-border rounded-xl p-8 space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Primary (Gradient)</h3>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] hover:opacity-90 text-white border-0">
                    Primary Button
                  </Button>
                  <Button className="bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] hover:opacity-90 text-white border-0" size="sm">
                    Small Primary
                  </Button>
                  <Button className="bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] hover:opacity-90 text-white border-0" size="lg">
                    Large Primary
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Secondary</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="secondary" size="sm">Small Secondary</Button>
                  <Button variant="secondary" size="lg">Large Secondary</Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Outline</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="outline" size="sm">Small Outline</Button>
                  <Button variant="outline" size="lg">Large Outline</Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Ghost</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="ghost" size="sm">Small Ghost</Button>
                  <Button variant="ghost" size="lg">Large Ghost</Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">With Icons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] hover:opacity-90 text-white border-0 gap-2">
                    <Plus className="w-4 h-4" />
                    Create Record
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <FileCode className="w-4 h-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Badges */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Badges</h2>
            <div className="bg-card border border-border rounded-xl p-8 space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Environment Badges</h3>
                <div className="flex flex-wrap gap-3">
                  <EnvironmentBadge env="DEV" />
                  <EnvironmentBadge env="UAT" />
                  <EnvironmentBadge env="LIVE" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Standard Badges</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Diff Badges</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30 gap-1">
                    <Plus className="w-3 h-3" />
                    234 lines
                  </Badge>
                  <Badge className="bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30 gap-1">
                    <Minus className="w-3 h-3" />
                    45 lines
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Inputs */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Form Elements</h2>
            <div className="bg-card border border-border rounded-xl p-8 space-y-6">
              <div className="max-w-md">
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Input</h3>
                <Input placeholder="Enter text..." />
              </div>

              <div className="max-w-md">
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Input with Icon</h3>
                <div className="relative">
                  <FileCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search files..." className="pl-10" />
                </div>
              </div>
            </div>
          </section>

          {/* Cards */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Cards</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Stat Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    title="Total Records"
                    value="1,247"
                    icon={FileCode}
                    trend="+12.5% from last month"
                    trendUp={true}
                  />
                  <StatCard
                    title="Changes This Week"
                    value="89"
                    icon={GitBranch}
                    trend="-3.2% from last week"
                    trendUp={false}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Record Cards</h3>
                <RecordCard
                  id="1"
                  branch="feature/user-authentication"
                  environment="DEV"
                  taskId="TASK-1234"
                  timestamp="2 hours ago"
                  summary="Implemented JWT authentication with refresh token support and password hashing using bcrypt"
                  linesAdded={234}
                  linesRemoved={45}
                  filesChanged={8}
                />
              </div>
            </div>
          </section>

          {/* Shadows & Effects */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Shadows & Effects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <p className="text-sm font-medium mb-2">Shadow Small</p>
                <p className="text-xs text-muted-foreground">shadow-sm</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 shadow-md">
                <p className="text-sm font-medium mb-2">Shadow Medium</p>
                <p className="text-xs text-muted-foreground">shadow-md</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                <p className="text-sm font-medium mb-2">Shadow Large</p>
                <p className="text-xs text-muted-foreground">shadow-lg</p>
              </div>
            </div>
          </section>

          {/* Border Radius */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Border Radius</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-card border border-border rounded p-6 text-center">
                <p className="text-sm font-medium">rounded</p>
                <p className="text-xs text-muted-foreground">0.25rem</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <p className="text-sm font-medium">rounded-lg</p>
                <p className="text-xs text-muted-foreground">0.5rem</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <p className="text-sm font-medium">rounded-xl</p>
                <p className="text-xs text-muted-foreground">0.75rem</p>
              </div>
              <div className="bg-card border border-border rounded-full p-6 text-center">
                <p className="text-sm font-medium">rounded-full</p>
                <p className="text-xs text-muted-foreground">9999px</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
