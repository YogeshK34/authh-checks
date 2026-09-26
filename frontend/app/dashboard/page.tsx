"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Dashboard() {
    const router = useRouter();

    async function logout() {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            const data = await res.json();
            if (!res.ok) return toast.error(data.error);

            toast.success('Logged out.');
            setTimeout(() => router.push('/login'), 1000);

        } catch (error: any) {
            console.error(error.message);
            toast.error(error.message);
            return;
        }
    }
    return (
        <div className="min-h-screen bg-background">
            <header className="border-b px-6 py-4">
                <h1 className="text-sm font-medium text-foreground">Dashboard</h1>
            </header>

            <main className="px-6 py-10 max-w-2xl">
                <h2 className="text-2xl font-semibold tracking-tight">Hello, User</h2>
                <p className="text-muted-foreground mt-1 text-sm">You're logged in and good to go.</p>
            </main>

            <Button className="w-full mt-2" onClick={logout}>Logout</Button>
        </div>
    );
}