
import React from 'react';
import { notFound } from "next/navigation";
import { getComboById } from '@/app/actions/comboActions';
import ComboDetailsPage from '@/app/components/ComboDetailsPage';

interface PageParams {
    id: string;
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }) {
    const { id } = await params;
    const combo = await getComboById(id);

    if (!combo) {
        return {
            title: "Combo Not Found | Fittara",
        };
    }

    return {
        title: `${combo.name} | Exclusive Combo`,
        description: combo.description || "Premium combo set from Fittara.",
    };
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
    const { id } = await params;
    const combo = await getComboById(id);

    if (!combo) {
        notFound();
    }

    return <ComboDetailsPage combo={combo} />;
}
