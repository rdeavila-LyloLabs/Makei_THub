import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message: string };
}) {
    const signIn = async (formData: FormData) => {
        "use server";

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const supabase = await createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return redirect("/login?message=No se pudo autenticar al usuario");
        }

        return redirect("/dashboard");
    };

    const signUp = async (formData: FormData) => {
        "use server";

        const origin = (await headers()).get("origin");
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const supabase = await createClient();

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            },
        });

        if (error) {
            return redirect("/login?message=No se pudo autenticar al usuario");
        }

        return redirect("/login?message=Revisa tu correo para continuar con el inicio de sesión");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/20">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-primary">Makei Training</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="animate-in flex-1 flex flex-col w-full justify-center gap-4 text-foreground">

                        <div className="flex flex-col gap-2">
                            <label className="text-md" htmlFor="email">
                                Correo Electrónico
                            </label>
                            <Input
                                className="rounded-md px-4 py-2 bg-inherit border mb-2"
                                name="email"
                                placeholder="tu@empresa.com"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-md" htmlFor="password">
                                Contraseña
                            </label>
                            <Input
                                className="rounded-md px-4 py-2 bg-inherit border mb-2"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button formAction={signIn} className="bg-primary text-primary-foreground mb-2">
                            Iniciar Sesión
                        </Button>
                        <Button
                            formAction={signUp}
                            variant="outline"
                            className="border-foreground/20 text-foreground mb-2"
                        >
                            Registrarse
                        </Button>

                        {searchParams?.message && (
                            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                                {searchParams.message}
                            </p>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
