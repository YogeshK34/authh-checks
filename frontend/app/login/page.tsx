"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [passState, setPassState] = useState<'password' | 'text'>('password');
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (searchParams.get('reason') === 'unauthorized') {
            toast.info('Login first to access.');
        }
    }, []);

    async function loginUser() {
        try {
            setLoading(true);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await res.json();
            if (!res.ok) return toast.error(data.error);

            toast.success('Logged in.');
            router.push('/dashboard');

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
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>Log in to your account</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
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
                        <div className="relative">
                            <Input
                                id="password"
                                type={passState}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                disabled={loading}
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                onClick={() => setPassState(prev => prev === 'password' ? 'text' : 'password')}
                            >
                                {password && (
                                    <img
                                        src={passState === 'password' ? '/icons8-eye-24.png' : '/icons8-hide-24.png'}
                                        alt={passState === 'password' ? 'show password' : 'hide password'}
                                        width={18}
                                        height={18}
                                    />
                                )}
                            </Button>
                        </div>
                    </div>

                    <Button onClick={loginUser} disabled={loading} className="w-full mt-2">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Spinner /> Logging in...
                            </span>
                        ) : (
                            'Log in'
                        )}
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                        Don't have an account?{' '}
                        <a href="/register" className="text-foreground underline underline-offset-4">
                            Register
                        </a>
                    </p>
                </CardContent>
            </Card>
        </div >
    );
}