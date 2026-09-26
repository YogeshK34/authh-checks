"use client";

import { useState } from "react";

interface User {
    id: number,
    username: string,
    email: string,
    password: string,
    role: string
};

export async function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <div>

        </div>
    )
}