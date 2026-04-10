import { FolderOpen, GitBranch, Share2, Search, Trash2, ShieldCheck } from 'lucide-react';

const FEATURES = [
    {
        icon: FolderOpen,
        title: 'Folder organization',
        description: 'Create nested folders to keep your files structured exactly the way you want.',
    },
    {
        icon: GitBranch,
        title: 'Version history',
        description: 'Every file upload creates a new version. Browse, download, or restore any previous version at any time.',
    },
    {
        icon: Share2,
        title: 'Granular sharing',
        description: 'Share folders with specific users and control whether they can view, upload, or manage files.',
    },
    {
        icon: Search,
        title: 'Instant search',
        description: 'Find any file instantly across all your folders with full-text search.',
    },
    {
        icon: Trash2,
        title: 'Trash & restore',
        description: 'Deleted files go to trash first, so you can always recover them before they are permanently removed.',
    },
    {
        icon: ShieldCheck,
        title: 'Self-hosted & private',
        description: 'Run on your own infrastructure with S3-compatible storage. Your data never leaves your control.',
    },
] as const;

export function FeaturesSection() {
    return (
        <section className="border-t bg-muted/30">
            <div className="mx-auto max-w-6xl px-6 py-20">
                <div className="mb-12 text-center">
                    <h2 className="mb-3 text-3xl font-bold tracking-tight">Everything you need</h2>
                    <p className="text-muted-foreground">Built for teams that need real control over their files.</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map(({ icon: Icon, title, description }) => (
                        <div
                            key={title}
                            className="rounded-xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                                <Icon className="size-5 text-primary" />
                            </div>
                            <h3 className="mb-2 font-semibold">{title}</h3>
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
