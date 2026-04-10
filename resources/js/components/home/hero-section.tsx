import { Link } from '@inertiajs/react';
import { HardDrive, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type User } from '@/types';

interface HeroSectionProps {
    user: User | null;
    appName: string;
}

export function HeroSection({ user, appName }: HeroSectionProps) {
    return (
        <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center md:py-36">
            <Badge variant="secondary" className="mb-6 gap-1.5">
                <HardDrive className="size-3" />
                Self-hosted file storage
            </Badge>

            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                Your files, your{' '}
                <span className="text-primary">rules</span>
            </h1>

            <p className="mb-10 max-w-xl text-lg text-muted-foreground">
                {appName} is a self-hosted drive to organize, share, and version your files — with full control over your data and who can access it.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row">
                {user ? (
                    <Button asChild size="lg">
                        <Link href={route('dashboard')}>
                            Open Drive
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                ) : (
                    <>
                        <Button asChild size="lg">
                            <Link href={route('register')}>
                                Get started for free
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href={route('login')}>Log in</Link>
                        </Button>
                    </>
                )}
            </div>
        </section>
    );
}
