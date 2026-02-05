import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "./components/ui/sonner";
import { Navigation } from "./components/navigation";
import { Dashboard } from "./pages/dashboard";
import { RecordsList } from "./pages/records-list";
import { RecordDetails } from "./pages/record-details";
import { CreateRecord } from "./pages/create-record";
import { DesignSystem } from "./pages/design-system";

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
          {currentPage === "dashboard" && <Dashboard onNavigate={handleNavigate} />}
          {currentPage === "records" && <RecordsList onNavigate={handleNavigate} />}
          {currentPage === "record-details" && (
            <RecordDetails
              recordId={selectedRecordId}
              onNavigate={handleNavigate}
              darkMode={darkMode}
            />
          )}
          {currentPage === "create" && <CreateRecord onNavigate={handleNavigate} />}
          {currentPage === "design-system" && <DesignSystem />}
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
