'use server';

import prisma from '@/lib/prisma';

export async function getAllCombos() {
    try {
        const combos = await prisma.combo.findMany({
            include: {
                ComboItem: {
                    include: {
                        Product: true,
                    },
                    orderBy: {
                        order: 'asc',
                    }
                },
            },
            orderBy: {
                createdat: 'desc',
            },
        });

        return combos;
    } catch (error) {
        console.error('Error fetching combos:', error);
        return [];
    }
}

export async function getComboById(id: string) {
    try {
        const combo = await prisma.combo.findUnique({
            where: { id },
            include: {
                ComboItem: {
                    include: {
                        Product: true,
                    },
                    orderBy: {
                        order: 'asc',
                    }
                },
            },
        });
        return combo;
    } catch (error) {
        console.error('Error fetching combo by ID:', error);
        return null;
    }
}
