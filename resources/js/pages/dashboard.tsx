import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData} from '@/types';
import { Head, usePage } from '@inertiajs/react';
import SignalementForm from './auth/signalement-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const user = usePage<SharedData>().props.auth.user;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <p>Bonjour {user.name}, vous êtes {user.role?.toLowerCase()} !</p>
                {user.role === 'Agent' && (
                    <div className="mt-10">
                        <div className="flex items-center justify-center
                                        w-full max-w-md h-40
                                        bg-gray-100 rounded-lg shadow-sm">
                            <p className="text-lg font-medium text-gray-700">
                                Section agent
                            </p>
                        </div>
                    </div>
                )}
                <SignalementForm />
            </div>
        </AppLayout>
    );
}
