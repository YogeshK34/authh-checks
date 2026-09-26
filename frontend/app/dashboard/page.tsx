"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
    const router = useRouter();
    const [role, setRole] = useState<string>('');

    useEffect(() => {
        async function fetchRole() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
                    credentials: 'include'
                });

                const data = await res.json();
                if (!res.ok) return toast(data.error);

                setRole(data.role);
            } catch (error: any) {
                console.error(error.message);
                toast.error(error.message);
                return;
            };
        };

        fetchRole();
    }, []);

    async function logout() {
        try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            const data = await res.json();
            if (!res.ok) return toast.error(data.error);

            toast.success('Logged out.');
            router.push('/login');

        } catch (error: any) {
            console.error(error.message);
            toast.error(error.message);
            return;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b px-6 py-4">
                <h1 className="text-sm font-medium text-foreground">Dashboard</h1>
            </header>

            <main className="px-6 py-10 max-w-2xl">
                <h2 className="text-2xl font-semibold tracking-tight">Hello, User</h2>
                <p className="text-muted-foreground mt-1 text-sm">You're logged in and good to go.</p>
            </main>

            <Button onClick={logout} >Logout</Button>

            {role === 'admin' && (
                <Button onClick={() => { router.push('/users') }}>Users</Button>
            )}
        </div>
    );
}