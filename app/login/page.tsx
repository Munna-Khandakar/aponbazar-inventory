"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {useMutation} from "@tanstack/react-query"
import {useForm} from "react-hook-form"
import {LockKeyhole, Mail, Shield} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {useAuth} from "@/hooks/use-auth"
import {authService} from "@/lib/services/auth-service"
import type {LoginInput} from "@/lib/types/LoginInput"

export default function LoginPage() {
    const router = useRouter()
    const {auth, setAuthData} = useAuth()
    const [error, setError] = useState<string | null>(null)

    const {register, handleSubmit, formState: {errors}} = useForm<LoginInput>({
        defaultValues: {
            email: "admin@gmail.com",
            password: "qwer@1234",
        },
    })

    const {mutate, isPending} = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            setAuthData(data)
            router.push("/dashboard")
        },
        onError: (err) => {
            const message =
                err instanceof Error
                    ? err.message
                    : (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
                    "Unable to log in with those credentials."
            setError(message)
        },
    })

    const onSubmit = handleSubmit((values) => {
        setError(null)
        mutate(values)
    })

    useEffect(() => {
        if (auth?.access_token) {
            router.replace("/dashboard")
        }
    }, [auth, router])

    return (
        <div
            className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-10">
            <div className="absolute inset-0 bg-grid-slate-100/60 dark:bg-grid-slate-800/60 [mask-image:radial-gradient(white,transparent_65%)]"/>
            <div
                className="relative z-10 flex w-full max-w-5xl flex-col gap-8 rounded-3xl border border-border/60 bg-background/70 p-10 shadow-2xl backdrop-blur">
                <div className="rounded-2xl border border-border/60 bg-card/70 px-6 py-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Operations panel</p>
                    <p className="text-lg font-semibold text-foreground">Secure access</p>
                </div>
                <div className="grid gap-10 lg:grid-cols-2">
                    <div className="space-y-5">
                        <div
                            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            <Shield size={14}/> Admin console
                        </div>
                        <h1 className="text-4xl font-semibold text-foreground">Sign in to continue</h1>
                        <p className="text-base text-muted-foreground">
                            Use the demo admin credentials to explore the dashboard. Data is mocked but the auth flow
                            follows the production-ready
                            pattern of an Axios service wrapped by React Query and react-hook-form validation.
                        </p>
                        <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5 text-sm">
                            <p className="mb-2 font-semibold text-primary">Demo credentials</p>
                            <p>
                                Email: <span className="font-mono">admin@gmail.com</span>
                            </p>
                            <p>
                                Password: <span className="font-mono">qwer@1234</span>
                            </p>
                        </div>
                    </div>
                    <Card className="border border-border/60 shadow-lg">
                        <CardHeader>
                            <CardTitle>Sign in</CardTitle>
                            <CardDescription>Access is restricted to workspace administrators.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6" onSubmit={onSubmit} noValidate>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <div className="relative">
                                        <Mail
                                            className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground"/>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="admin@gmail.com"
                                            className="pl-9"
                                            aria-invalid={errors.email ? "true" : "false"}
                                            disabled={isPending}
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /\S+@\S+\.\S+/,
                                                    message: "Enter a valid email",
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.email ?
                                        <p className="text-xs font-medium text-destructive">{errors.email.message}</p> : null}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <LockKeyhole
                                            className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground"/>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-9"
                                            aria-invalid={errors.password ? "true" : "false"}
                                            disabled={isPending}
                                            {...register("password", {required: "Password is required"})}
                                        />
                                    </div>
                                    {errors.password ?
                                        <p className="text-xs font-medium text-destructive">{errors.password.message}</p> : null}
                                </div>
                                {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
                                <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                                    {isPending ? "Verifying..." : "Sign in"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
