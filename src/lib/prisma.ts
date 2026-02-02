import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Hardcoded database URL for deployment
const DATABASE_URL = "postgresql://neondb_owner:npg_N7fSCV3slyZg@ep-empty-voice-aerg852h-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

// Create a connection pool
const pool = new Pool({
  connectionString: DATABASE_URL,
});

const adapter = new PrismaPg(pool);

// PrismaClient is attached to the `global` object in development to prevent
// exhausting the database connection limit.

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;