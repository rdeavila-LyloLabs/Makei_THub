import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900">
            <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3 text-primary">
                    <BookOpen className="h-12 w-12" />
                    <h1 className="text-5xl font-bold tracking-tight">Makei Training</h1>
                </div>

                <p className="text-xl text-muted-foreground max-w-md mx-auto">
                    Plataforma de gestión de capacitaciones corporativas.
                </p>

                <div className="flex gap-4 justify-center">
                    <Link href="/login">
                        <Button size="lg" className="bg-primary text-primary-foreground text-lg px-8">
                            Ingresar a la App
                        </Button>
                    </Link>
                </div>
            </div>

            <footer className="absolute bottom-4 text-sm text-muted-foreground">
                © 2024 Makei Soluciones. Todos los derechos reservados.
            </footer>
        </div>
    );
}
