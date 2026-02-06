import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { LogOut, Mail, User, Shield, Calendar } from "lucide-react";
import { Badge } from "../components/ui/badge";

interface ProfileProps {
    onNavigate: (page: string) => void;
}

export function Profile({ onNavigate }: ProfileProps) {
    const { data: session } = useSession();

    if (!session?.user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">Please log in</h2>
                    <Button onClick={() => onNavigate("login")}>Go to Login</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-12 pt-8">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                >
                    {/* Banner Background */}
                    <div className="h-32 bg-gradient-to-r from-[#06b6d4]/20 to-[#8b5cf6]/20 relative">
                        <div className="absolute inset-0 bg-grid-white/10" />
                    </div>

                    <div className="px-8 pb-8">
                        {/* Avatar & Header */}
                        <div className="relative -mt-16 mb-6 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
                            <Avatar className="w-32 h-32 border-4 border-card ring-4 ring-border/50 shadow-xl">
                                <AvatarImage src={session.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.name}`} />
                                <AvatarFallback className="text-4xl">{session.user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 pb-4">
                                <h1 className="text-3xl font-bold mb-1">{session.user.name}</h1>
                                <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                                    Full Stack Developer
                                    <Badge variant="secondary" className="text-xs">PRO</Badge>
                                </p>
                            </div>
                            <div className="pb-4">
                                <Button
                                    variant="destructive"
                                    className="gap-2 shadow-lg hover:shadow-red-500/20"
                                    onClick={() => signOut()}
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </Button>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid gap-6 py-6 border-t border-border">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Account Details
                            </h3>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                        <Mail className="w-4 h-4" />
                                        Email Address
                                    </div>
                                    <p className="font-medium text-lg truncate" title={session.user.email || ""}>
                                        {session.user.email}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                        <Shield className="w-4 h-4" />
                                        Role
                                    </div>
                                    <p className="font-medium text-lg">
                                        Admin
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
