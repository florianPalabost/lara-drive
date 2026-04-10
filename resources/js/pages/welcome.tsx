import { Head, usePage } from '@inertiajs/react';
import { NavHeader } from '@/components/home/nav-header';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturesSection } from '@/components/home/features-section';
import { type SharedData } from '@/types';

export default function Welcome() {
    const { auth, name } = usePage<SharedData>().props;
    const appName = name || 'LaraDrive';

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col bg-background text-foreground">
                <NavHeader user={auth.user ?? null} appName={appName} />

                <main className="flex flex-1 flex-col">
                    <HeroSection user={auth.user ?? null} appName={appName} />
                    <FeaturesSection />
                </main>

                <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} {appName}. Self-hosted with love.
                </footer>
            </div>
        </>
    );
}
