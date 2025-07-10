import { Input } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { FormEvent, useState } from 'react';

export function FileSearch() {
    const [query, setQuery] = useState('');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.get(route('files.search', { q: query }));
        }
    };

    return (
        <form onSubmit={handleSearch} className="w-full mb-4" onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}>
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input
                    type="text"
                    placeholder="Search files..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </form>
    );
}
