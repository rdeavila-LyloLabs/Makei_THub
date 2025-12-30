import Link from "next/link"
import { Users, BookOpen, LayoutDashboard, Settings, LogOut } from "lucide-react"

export function Sidebar() {
    return (
        <div className="flex h-screen w-64 flex-col border-r bg-card text-card-foreground shadow-sm">
            <div className="flex h-16 items-center border-b px-6">
                <div className="flex items-center gap-2 font-bold text-xl text-primary">
                    <BookOpen className="h-6 w-6" />
                    <span>Makei</span>
                </div>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    <LayoutDashboard className="h-4 w-4" />
                    Panel Principal
                </Link>
                <Link
                    href="/dashboard/employees"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    <Users className="h-4 w-4" />
                    Colaboradores
                </Link>
                <Link
                    href="/dashboard/trainings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    <BookOpen className="h-4 w-4" />
                    Capacitaciones
                </Link>
            </nav>
            <div className="border-t p-4">
                <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-foreground">Usuario Admin</span>
                        <span className="text-xs">admin@makei.com</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
