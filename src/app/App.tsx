import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "./components/ui/sonner";
import { Navigation } from "./components/navigation";
import { Dashboard } from "./pages/dashboard";
import { RecordsList } from "./pages/records-list";
import { CreateRecord } from "./pages/create-record";
import { DesignSystem } from "./pages/design-system";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { RecordDetails } from "./pages/record-details";
import { Profile } from "./pages/profile";
import { useSession } from "next-auth/react";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedRecordId, setSelectedRecordId] = useState<string | undefined>();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleNavigate = (page: string, recordId?: string) => {
    setCurrentPage(page);
    setSelectedRecordId(recordId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />;
      case "records":
        return <RecordsList onNavigate={handleNavigate} />;
      case "create":
        return <CreateRecord onNavigate={handleNavigate} recordId={selectedRecordId} />;
      case "design-system":
        return <DesignSystem />;
      case "login":
        return <Login onNavigate={handleNavigate} />;
      case "register":
        return <Register onNavigate={handleNavigate} />;
      case "record-details":
        if (selectedRecordId) return <RecordDetails recordId={selectedRecordId} onNavigate={handleNavigate} />;
        return <Dashboard onNavigate={handleNavigate} />;
      case "profile":
        return <Profile onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation
        onNavigate={handleNavigate}
        currentPage={currentPage}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      <Toaster position="bottom-right" />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#06b6d4]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8b5cf6]/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
