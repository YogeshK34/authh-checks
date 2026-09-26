"use client";

import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
    id: number,
    username: string,
    email: string,
    role: string
};

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchUsers() {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                    headers: { 'Content-type': 'application/json' },
                    credentials: "include"
                });

                const data = await res.json();
                if (!res.ok) return toast.error(data.error);

                setUsers(data.result);
            } catch (error: any) {
                console.error(error.message);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [])

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b px-6 py-4">
                <h1 className="text-sm font-medium text-foreground">Admin</h1>
            </header>

            <main className="px-6 py-10 max-w-4xl">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
                    <p className="text-muted-foreground text-sm mt-1">All registered users in the application.</p>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">User list</CardTitle>
                                <CardDescription className="mt-0.5">
                                    {!loading && `${users.length} user${users.length !== 1 ? 's' : ''} total`}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {loading ? (
                            <div className="flex items-center gap-2 text-muted-foreground py-6 justify-center">
                                <Spinner /> <span className="text-sm">Loading users...</span>
                            </div>
                        ) : users.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">No users found.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((u) => (
                                        <TableRow key={u.id}>
                                            <TableCell className="font-medium">{u.username}</TableCell>
                                            <TableCell className="text-muted-foreground">{u.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                                                    {u.role}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}