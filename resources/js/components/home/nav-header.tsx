import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { type User } from '@/types';

interface NavHeaderProps {
    user: User | null;
    appName: string;
}

export function NavHeader({ user, appName }: NavHeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                    </div>
                    <span className="font-semibold text-sm">{appName}</span>
                </div>

                <nav className="flex items-center gap-2">
                    {user ? (
                        <Button asChild size="sm">
                            <Link href={route('dashboard')}>Go to Drive</Link>
                        </Button>
                    ) : (
                        <>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={route('login')}>Log in</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link href={route('register')}>Get started</Link>
                            </Button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
