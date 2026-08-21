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

        const nasabahCount = await prisma.nasabah.count();
        let nasabah = await prisma.nasabah.findMany({ orderBy: { id: 'asc' } });

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
                {
                    nama: 'Nina Rahma',
                    nik: '3477090123456790',
                    pekerjaan: 'Karyawan Swasta',
                    penghasilan: 8200000,
                    saldoRataRata: 750000,
                    estimasiPengeluaran: 2800000,
                    riwayatPembayaran: 'lancar',
                    jumlahTanggungan: 2,
                },
                {
                    nama: 'Andi Wijaya',
                    nik: '3578090123456791',
                    pekerjaan: 'Wirausaha',
                    penghasilan: 9000000,
                    saldoRataRata: 650000,
                    estimasiPengeluaran: 3200000,
                    riwayatPembayaran: 'telat',
                    jumlahTanggungan: 3,
                },
            ];

            await prisma.nasabah.createMany({
                data: sampleNasabah,
            });
            nasabah = await prisma.nasabah.findMany({ orderBy: { id: 'asc' } });
            console.log('Sample nasabah data inserted successfully');
        } else {
            console.log('Data nasabah sudah ada, skip nasabah seeding');
        }

        if (nasabah.length > 0) {
            const pinjamanCount = await prisma.pinjaman.count();
            if (pinjamanCount === 0) {
                const pinjamanData = nasabah.slice(0, 4).map((item, index) => ({
                    nasabahId: item.id,
                    jumlahPinjaman: [15000000, 24000000, 32000000, 18000000][index] || 22000000,
                    tenor: [12, 18, 24, 12][index] || 12,
                    sukuBunga: [1.2, 1.4, 1.1, 1.3][index] || 1.2,
                    jenisBunga: 'efektif',
                    status: index % 2 === 0 ? 'active' : 'approved',
                    cicilanBulanan: [1350000, 1500000, 1800000, 1600000][index] || 1500000,
                    totalBunga: [1800000, 2200000, 2800000, 2000000][index] || 2000000,
                    totalPembayaran: [16800000, 26200000, 34800000, 20000000][index] || 26000000,
                    tanggalPengajuan: new Date(Date.now() - (index + 1) * 86400000 * 12),
                }));

                await prisma.pinjaman.createMany({
                    data: pinjamanData,
                });
                console.log('Sample pinjaman data inserted successfully');
            }

            const simpananCount = await prisma.simpanan.count();
            if (simpananCount === 0) {
                const simpananData = nasabah.map((item, index) => ({
                    nasabahId: item.id,
                    jumlahSetoran: [2500000, 3200000, 2100000, 4700000, 3900000][index] || 3000000,
                    bungaSimpanan: 2.5,
                    jenisInterest: 'flat',
                    tanggalSetoran: new Date(Date.now() - index * 86400000 * 8),
                    saldoAkhir: [2500000, 3200000, 2100000, 4700000, 3900000][index] || 3000000,
                    status: 'aktif',
                    keterangan: 'Setoran awal simpanan',
                }));

                await prisma.simpanan.createMany({
                    data: simpananData,
                });
                console.log('Sample simpanan data inserted successfully');
            }

            const pembayaranCount = await prisma.pembayaran.count();
            if (pembayaranCount === 0) {
                const pinjaman = await prisma.pinjaman.findMany({ orderBy: { id: 'asc' } });
                const pembayaranData = pinjaman.flatMap((item, index) => [
                    {
                        pinjamanId: item.id,
                        jumlahBayar: item.cicilanBulanan ?? 1500000,
                        tanggalBayar: new Date(Date.now() - (index + 1) * 86400000 * 8),
                        statusBayar: index % 2 === 0 ? 'lancar' : 'telat',
                        dariTanggalSeharusnya: new Date(Date.now() - (index + 1) * 86400000 * 10),
                    },
                    {
                        pinjamanId: item.id,
                        jumlahBayar: item.cicilanBulanan ?? 1500000,
                        tanggalBayar: new Date(Date.now() - (index + 2) * 86400000 * 7),
                        statusBayar: index % 2 === 0 ? 'lancar' : 'lancar',
                        dariTanggalSeharusnya: new Date(Date.now() - (index + 2) * 86400000 * 9),
                    },
                ]);

                await prisma.pembayaran.createMany({
                    data: pembayaranData,
                });
                console.log('Sample pembayaran data inserted successfully');
            }

            const analisisCount = await prisma.analisisRisiko.count();
            if (analisisCount === 0) {
                const riskData = nasabah.map((item, index) => ({
                    nasabahId: item.id,
                    skorPekerjaan: [22, 30, 18, 24, 16][index] || 20,
                    skorPenghasilan: [28, 24, 20, 30, 26][index] || 24,
                    skorLamaBekerja: [15, 12, 10, 18, 14][index] || 12,
                    skorRiwayat: [10, 12, 8, 10, 8][index] || 10,
                    skorTanggungan: [8, 6, 12, 10, 10][index] || 10,
                    totalSkor: [83, 84, 68, 92, 76][index] || 80,
                    status: ['layak', 'layak', 'review', 'layak', 'review'][index] || 'review',
                }));

                await prisma.analisisRisiko.createMany({
                    data: riskData,
                });
                console.log('Sample analisis risiko data inserted successfully');
            }
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
