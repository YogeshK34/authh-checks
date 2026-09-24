"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "@base-ui/react";
import { Spinner } from "./ui/spinner";

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
        <div>
            <h3>User Registration</h3>

            <Input
                type='text'
                value={username}
                onChange={(e) => { setUsername(e.target.value) }}
                placeholder="John Doe"
                required
                disabled={loading}
            />

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

            <Button onClick={registerUser}>{loading ? <><Spinner /> <h6>registering...</h6></> : <><h6>Register</h6></>}</Button>
        </div>
    )
}