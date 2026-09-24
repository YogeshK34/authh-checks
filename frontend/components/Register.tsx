"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Register() {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    async function registerUser() {
        try {
            setLoading(true);

            const res = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
                credentials: 'include'
            });

            const data = await res.json();
            if (!res.ok) return toast.error(data.error);

            router.push('/login');

        } catch (error: any) {
            console.error(error.message);
            toast.error(error.message);
            return;

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Create an account</CardTitle>
                    <CardDescription>Enter your details to get started</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="johndoe"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="johndoe@email.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                    </div>

                    <Button onClick={registerUser} disabled={loading} className="w-full mt-2">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Spinner /> Registering...
                            </span>
                        ) : (
                            'Register'
                        )}
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                        Already have an account?{' '}
                        <a href="/login" className="text-foreground underline underline-offset-4">
                            Log in
                        </a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}