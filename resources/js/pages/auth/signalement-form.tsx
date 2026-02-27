import { useState, FormEvent } from 'react';
import { router, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

export default function SignalementForm() {
    const { auth } = usePage<SharedData>().props;

    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');

    const submit = (e: FormEvent) => {
        e.preventDefault();

        router.post('/signalements', {
            titre,
            description,
        });
    };

    if (auth.user?.role !== 'Citoyen') {
        return null;
    }

    return (
        <form onSubmit={submit} className="space-y-4 max-w-md">
            <input
                type="text"
                value={titre}
                onChange={e => setTitre(e.target.value)}
                placeholder="Titre"
                className="w-full border rounded p-2"
            />

            <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full border rounded p-2"
            />

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Envoyer
            </button>
        </form>
    );
}
