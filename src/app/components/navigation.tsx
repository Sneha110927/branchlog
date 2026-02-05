import { Search, Moon, Sun, LayoutDashboard, History, Plus, Palette, Menu, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { EnvironmentBadge } from "./environment-badge";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Navigation({ onNavigate, currentPage, darkMode, onToggleDarkMode }: NavigationProps) {
  const [selectedEnv, setSelectedEnv] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <motion.h1 
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] bg-clip-text text-transparent cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                onNavigate("dashboard");
                setMobileMenuOpen(false);
              }}
            >
              BranchLog
            </motion.h1>
            
            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-2">
              <Button
                variant={currentPage === "dashboard" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onNavigate("dashboard")}
                className="gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
              <Button
                variant={currentPage === "records" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onNavigate("records")}
                className="gap-2"
              >
                <History className="w-4 h-4" />
                Records
              </Button>
              <Button
                variant={currentPage === "design-system" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onNavigate("design-system")}
                className="gap-2"
              >
                <Palette className="w-4 h-4" />
                Design System
              </Button>
            </div>
          </div>

          {/* Search and Filters - Desktop Only */}
          <div className="flex-1 max-w-xl hidden xl:flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by task ID, branch, or file..."
                className="pl-10 bg-secondary/50 border-border/50 focus:border-[#06b6d4]/50"
              />
            </div>
            
            <div className="flex gap-2">
              {(["UAT", "LIVE", "DEV"] as const).map((env) => (
                <button
                  key={env}
                  onClick={() => setSelectedEnv(selectedEnv === env ? null : env)}
                  className="transition-transform hover:scale-105"
                >
                  <EnvironmentBadge 
                    env={env} 
                    className={selectedEnv === env ? "ring-2 ring-[#06b6d4]/50" : "opacity-60 hover:opacity-100"}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              size="sm"
              onClick={() => {
                onNavigate("create");
                setMobileMenuOpen(false);
              }}
              className="bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] hover:opacity-90 text-white border-0 gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Record</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className="rounded-full hidden sm:flex"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            <Avatar className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer ring-2 ring-border hover:ring-[#06b6d4]/50 transition-all hidden sm:flex">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 space-y-2 border-t border-border mt-4">
                <Button
                  variant={currentPage === "dashboard" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    onNavigate("dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
                <Button
                  variant={currentPage === "records" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    onNavigate("records");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start gap-2"
                >
                  <History className="w-4 h-4" />
                  Records
                </Button>
                <Button
                  variant={currentPage === "design-system" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    onNavigate("design-system");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start gap-2"
                >
                  <Palette className="w-4 h-4" />
                  Design System
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleDarkMode}
                  className="w-full justify-start gap-2"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}