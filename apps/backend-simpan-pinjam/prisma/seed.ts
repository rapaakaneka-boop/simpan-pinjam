import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const poolConfig: any = { connectionString };

// Disable SSL for local development databases that do not support TLS.
if (process.env.NODE_ENV === 'production' || process.env.DATABASE_SSL === 'true') {
    poolConfig.ssl = {
        rejectUnauthorized: false,
    };
}

const pool = new Pool(poolConfig);
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log: ['error'],
});

async function main() {
    try {
        // Create admin user if not exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { username: 'admin' },
        });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = await prisma.admin.create({
                data: {
                    username: 'admin',
                    password: hashedPassword,
                    email: 'admin@simpanpinjam.com',
                    namaLengkap: 'Administrator',
                    isActive: true,
                },
            });

            console.log('Admin user created successfully:', {
                id: admin.id,
                username: admin.username,
                email: admin.email,
            });
        } else {
            console.log('Admin user sudah ada, skip admin seeding');
        }

        // Seed sample nasabah data if none exists
        const nasabahCount = await prisma.nasabah.count();
        if (nasabahCount === 0) {
            const sampleNasabah = [
                {
                    nama: 'Samuel Santoso',
                    nik: '3174090123456789',
                    pekerjaan: 'PNS',
                    penghasilan: 7500000,
                    saldoRataRata: 500000,
                    estimasiPengeluaran: 2500000,
                    riwayatPembayaran: 'lancar',
                    jumlahTanggungan: 2,
                },
                {
                    nama: 'Dewi Permata',
                    nik: '3275090123456789',
                    pekerjaan: 'Freelance',
                    penghasilan: 6000000,
                    saldoRataRata: 300000,
                    estimasiPengeluaran: 2000000,
                    riwayatPembayaran: 'lancar',
                    jumlahTanggungan: 1,
                },
                {
                    nama: 'Rian Setiawan',
                    nik: '3376090123456789',
                    pekerjaan: 'Petani',
                    penghasilan: 4000000,
                    saldoRataRata: 150000,
                    estimasiPengeluaran: 1800000,
                    riwayatPembayaran: 'telat',
                    jumlahTanggungan: 4,
                },
            ];

            await prisma.nasabah.createMany({
                data: sampleNasabah,
            });
            console.log('Sample nasabah data inserted successfully');
        } else {
            console.log('Data nasabah sudah ada, skip nasabah seeding');
        }
    } catch (error) {
        console.error('Error during seeding:', error);
        throw error;
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log('Seeding completed successfully');
    })
    .catch(async (e) => {
        console.error('Seeding failed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
