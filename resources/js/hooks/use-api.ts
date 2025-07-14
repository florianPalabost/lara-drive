import { usePage } from '@inertiajs/react';
import ky from 'ky';

export function useApi() {
    const { props } = usePage();
    const csrfToken = props.csrf_token as string;

    return ky.create({
        prefixUrl: '/',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': csrfToken,
        },
        credentials: 'same-origin',
    });
}
