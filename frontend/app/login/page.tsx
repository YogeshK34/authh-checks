"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        async function checkLogin() {
            if (searchParams.get('reason') === 'unauthorized') {
                return toast.info('Login first to access.')
            }
        };
        checkLogin();
    }, []);

    async function loginUser() {
        try {
            setLoading(true);

            const res = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await res.json();
            if (!res.ok) return toast.error(data.error);

            toast.success('Login successful');

        } catch (error: any) {
            console.error(error.message);
            toast.error(error.message);
            return;

        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>Login form</h3>

            <Input
                type='email'
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
                placeholder="johndoe@email.com"
                required
                disabled={loading}
            />

            <Input
                type='password'
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
                placeholder="********"
                required
                disabled={loading}
            />

            <Button onClick={loginUser}>{loading ? <><Spinner /> <h6>loading...</h6></> : <><h6>Login</h6></>}</Button>
        </div>
    )
}