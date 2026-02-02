
import { PrismaClient } from '@prisma/client';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const DATABASE_URL = "postgresql://neondb_owner:npg_N7fSCV3slyZg@ep-empty-voice-aerg852h-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

process.env.DATABASE_URL = DATABASE_URL;

const pool = new Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const shirtColumns = ["Size", "Shoulder", "Chest", "Waist", "Hip", "Sleeve", "Neck", "Biceps", "Forearm", "Length"];
const trouserColumns = ["Size", "Waist", "Hip", "Thigh", "Full Crotch", "Knee", "Ankle", "Length"];

const shirtClassicData = [
    { Size: "XS", Shoulder: 17, Chest: 38, Waist: 35, Hip: 38, Sleeve: 23.5, Neck: 14, Biceps: 13.5, Forearm: 10, Length: 27.5 },
    { Size: "S", Shoulder: 18, Chest: 40, Waist: 37, Hip: 40, Sleeve: 24, Neck: 14.5, Biceps: 14, Forearm: 10.5, Length: 28 },
    { Size: "M", Shoulder: 18.5, Chest: 42.5, Waist: 39.5, Hip: 42.5, Sleeve: 24.5, Neck: 15, Biceps: 15, Forearm: 11, Length: 28.5 },
    { Size: "L", Shoulder: 19, Chest: 44.5, Waist: 41.5, Hip: 44.5, Sleeve: 25, Neck: 16, Biceps: 15.5, Forearm: 11.5, Length: 29 },
    { Size: "XL", Shoulder: 19.5, Chest: 46, Waist: 43.5, Hip: 46, Sleeve: 25.5, Neck: 16.5, Biceps: 16.5, Forearm: 12, Length: 30 },
    { Size: "XXL", Shoulder: 20.5, Chest: 48, Waist: 45.5, Hip: 48, Sleeve: 26, Neck: 17.5, Biceps: 17.5, Forearm: 12.5, Length: 31 },
    { Size: "3XL", Shoulder: 21.5, Chest: 50.5, Waist: 48, Hip: 50.5, Sleeve: 26.5, Neck: 18, Biceps: 18, Forearm: 13, Length: 32 }
];

const shirtSlimData = [
    { Size: "XS", Shoulder: 16, Chest: 36, Waist: 32, Hip: 36, Sleeve: 24, Neck: 14, Biceps: 12, Forearm: 9, Length: 26.5 },
    { Size: "S", Shoulder: 17, Chest: 38, Waist: 34, Hip: 38, Sleeve: 24.5, Neck: 14.5, Biceps: 12.5, Forearm: 9.5, Length: 27.5 },
    { Size: "M", Shoulder: 18, Chest: 39.5, Waist: 35.5, Hip: 39.5, Sleeve: 25, Neck: 15, Biceps: 13.5, Forearm: 10, Length: 28 },
    { Size: "L", Shoulder: 18.5, Chest: 41, Waist: 37, Hip: 41, Sleeve: 25, Neck: 15.5, Biceps: 14, Forearm: 10.5, Length: 28.5 },
    { Size: "XL", Shoulder: 19.5, Chest: 42.5, Waist: 38.5, Hip: 42.5, Sleeve: 25.5, Neck: 16, Biceps: 15, Forearm: 11, Length: 29.5 },
    { Size: "XXL", Shoulder: 20, Chest: 45, Waist: 41, Hip: 45, Sleeve: 26, Neck: 17, Biceps: 16, Forearm: 11.5, Length: 30.5 },
    { Size: "3XL", Shoulder: 21, Chest: 47, Waist: 43.5, Hip: 47, Sleeve: 26.5, Neck: 17.5, Biceps: 16.5, Forearm: 12, Length: 31.5 }
];

const trouserTailoredData = [
    { Size: "XS", Waist: 28, Hip: 36, Thigh: 22, "Full Crotch": 26, Knee: 14, Ankle: 12, Length: 40 },
    { Size: "S", Waist: 30, Hip: 38, Thigh: 23, "Full Crotch": 27, Knee: 14.5, Ankle: 12.5, Length: 40.5 },
    { Size: "M", Waist: 32, Hip: 40, Thigh: 24, "Full Crotch": 28, Knee: 15, Ankle: 13, Length: 41 },
    { Size: "L", Waist: 34, Hip: 42, Thigh: 25, "Full Crotch": 28.5, Knee: 15.5, Ankle: 13.5, Length: 41.5 },
    { Size: "XL", Waist: 36, Hip: 44, Thigh: 26, "Full Crotch": 29, Knee: 16, Ankle: 14, Length: 42 },
    { Size: "XXL", Waist: 38, Hip: 46, Thigh: 27, "Full Crotch": 30, Knee: 16.5, Ankle: 14.5, Length: 42.5 },
    { Size: "3XL", Waist: 40, Hip: 48, Thigh: 28, "Full Crotch": 31, Knee: 17, Ankle: 15, Length: 43 }
];
const trouserTaperedData = [
    { Size: "XS", Waist: 28, Hip: 36, Thigh: 21.5, "Full Crotch": 28, Knee: 13.5, Ankle: 12, Length: 40 },
    { Size: "S", Waist: 30, Hip: 38, Thigh: 22.5, "Full Crotch": 29, Knee: 14, Ankle: 12.5, Length: 40.5 },
    { Size: "M", Waist: 32, Hip: 40, Thigh: 23.5, "Full Crotch": 30, Knee: 14.5, Ankle: 13, Length: 41 },
    { Size: "L", Waist: 34, Hip: 42, Thigh: 24.5, "Full Crotch": 31, Knee: 15, Ankle: 13.5, Length: 41.5 },
    { Size: "XL", Waist: 36, Hip: 44, Thigh: 25.5, "Full Crotch": 32, Knee: 15.5, Ankle: 14, Length: 42 },
    { Size: "XXL", Waist: 38, Hip: 46, Thigh: 26.5, "Full Crotch": 33, Knee: 16, Ankle: 14.5, Length: 42.5 },
    { Size: "3XL", Waist: 40, Hip: 48, Thigh: 27.5, "Full Crotch": 34, Knee: 16.5, Ankle: 15, Length: 43 }
];
const trouserStraightData = [
    { Size: "XS", Waist: 28, Hip: 37, Thigh: 22.5, "Full Crotch": 29, Knee: 16, Ankle: 17, Length: 40 },
    { Size: "S", Waist: 30, Hip: 39, Thigh: 23.5, "Full Crotch": 30, Knee: 16.5, Ankle: 17, Length: 40.5 },
    { Size: "M", Waist: 32, Hip: 41, Thigh: 24.5, "Full Crotch": 31, Knee: 17, Ankle: 18, Length: 41 },
    { Size: "L", Waist: 34, Hip: 43, Thigh: 25.5, "Full Crotch": 32, Knee: 17.5, Ankle: 18, Length: 41.5 },
    { Size: "XL", Waist: 36, Hip: 45, Thigh: 26.5, "Full Crotch": 33, Knee: 18, Ankle: 19, Length: 42 },
    { Size: "XXL", Waist: 38, Hip: 47, Thigh: 27.5, "Full Crotch": 34, Knee: 18.5, Ankle: 19, Length: 42.5 },
    { Size: "3XL", Waist: 40, Hip: 49, Thigh: 28.5, "Full Crotch": 35, Knee: 19, Ankle: 20, Length: 43 }
];
const trouserRelaxedData = [
    { Size: "XS", Waist: 28, Hip: 38, Thigh: 23.5, "Full Crotch": 29.5, Knee: 15.5, Ankle: 16, Length: 40 },
    { Size: "S", Waist: 30, Hip: 40, Thigh: 24.5, "Full Crotch": 30.5, Knee: 16, Ankle: 17, Length: 40.5 },
    { Size: "M", Waist: 32, Hip: 42, Thigh: 25.5, "Full Crotch": 31.5, Knee: 16.5, Ankle: 18, Length: 41 },
    { Size: "L", Waist: 34, Hip: 44, Thigh: 26.5, "Full Crotch": 32.5, Knee: 17, Ankle: 19, Length: 41.5 },
    { Size: "XL", Waist: 36, Hip: 46, Thigh: 27.5, "Full Crotch": 33.5, Knee: 18.5, Ankle: 20, Length: 42 },
    { Size: "XXL", Waist: 38, Hip: 48, Thigh: 28.5, "Full Crotch": 34.5, Knee: 19, Ankle: 21, Length: 42.5 },
    { Size: "3XL", Waist: 40, Hip: 50, Thigh: 29.5, "Full Crotch": 35.5, Knee: 20, Ankle: 22, Length: 43 }
];
const trouserRegularData = [
    { Size: "XS", Waist: 28, Hip: 38, Thigh: 23, "Full Crotch": 29.5, Knee: 15.5, Ankle: 13, Length: 40 },
    { Size: "S", Waist: 30, Hip: 40, Thigh: 24, "Full Crotch": 30.5, Knee: 16, Ankle: 14, Length: 40.5 },
    { Size: "M", Waist: 32, Hip: 42, Thigh: 25, "Full Crotch": 31.5, Knee: 16.5, Ankle: 14.5, Length: 41 },
    { Size: "L", Waist: 34, Hip: 44, Thigh: 26, "Full Crotch": 32.5, Knee: 17, Ankle: 15, Length: 41.5 },
    { Size: "XL", Waist: 36, Hip: 46, Thigh: 27, "Full Crotch": 33.5, Knee: 17.5, Ankle: 15.5, Length: 42 },
    { Size: "XXL", Waist: 38, Hip: 48, Thigh: 28, "Full Crotch": 34.5, Knee: 18, Ankle: 16, Length: 42.5 },
    { Size: "3XL", Waist: 40, Hip: 50, Thigh: 29, "Full Crotch": 35.5, Knee: 18.5, Ankle: 16.5, Length: 43 }
];

async function main() {
    await prisma.sizeChart.deleteMany({}); // Clear existing

    await prisma.sizeChart.create({
        data: { category: "shirt", fit: "Standard Fit", data: shirtClassicData as any }
    });
    await prisma.sizeChart.create({
        data: { category: "shirt", fit: "Slim Fit", data: shirtSlimData as any }
    });

    await prisma.sizeChart.create({
        data: { category: "pant", fit: "Tailored Fit", data: trouserTailoredData as any }
    });
    await prisma.sizeChart.create({
        data: { category: "pant", fit: "Tapered Fit", data: trouserTaperedData as any }
    });
    await prisma.sizeChart.create({
        data: { category: "pant", fit: "Straight Fit", data: trouserStraightData as any }
    });
    await prisma.sizeChart.create({
        data: { category: "pant", fit: "Relaxed Tapered", data: trouserRelaxedData as any }
    });
    await prisma.sizeChart.create({
        data: { category: "pant", fit: "Regular Fit", data: trouserRegularData as any }
    });

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
