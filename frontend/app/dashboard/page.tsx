export default function Dashboard() {
    return (
        <div className="min-h-screen bg-background">
            <header className="border-b px-6 py-4">
                <h1 className="text-sm font-medium text-foreground">Dashboard</h1>
            </header>

            <main className="px-6 py-10 max-w-2xl">
                <h2 className="text-2xl font-semibold tracking-tight">Hello, User</h2>
                <p className="text-muted-foreground mt-1 text-sm">You're logged in and good to go.</p>
            </main>
        </div>
    );
}