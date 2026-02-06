import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Loader2, Github } from "lucide-react";
import { motion } from "framer-motion";

export function Login({ onNavigate }: { onNavigate: (page: string) => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (result?.error) {
                toast.error("Invalid credentials");
            } else {
                toast.success("Logged in successfully!");
                onNavigate("dashboard");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 bg-card rounded-xl border border-border shadow-lg"
            >
                <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] bg-clip-text text-transparent">Welcome Back</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" {...register("email", { required: true })} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" {...register("password", { required: true })} />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6]" disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => signIn("github", { callbackUrl: "/" })}
                        disabled={isLoading}
                    >
                        <Github className="w-4 h-4" />
                        GitHub
                    </Button>
                </form>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button onClick={() => onNavigate("register")} className="text-[#06b6d4] hover:underline">
                        Register
                    </button>
                </p>
            </motion.div>
        </div>
    );
}
