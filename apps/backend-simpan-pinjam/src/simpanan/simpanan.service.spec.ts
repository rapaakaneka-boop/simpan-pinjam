import { SimpananService } from './simpanan.service';

describe('SimpananService', () => {
    it('should return all savings records when listing the savings dataset', async () => {
        const mockRecords = [
            {
                id: 1,
                nasabahId: 1,
                jumlahSetoran: 500000,
                bungaSimpanan: 2.5,
                jenisInterest: 'flat',
                tanggalSetoran: new Date('2026-07-01T00:00:00.000Z'),
                saldoAkhir: 500000,
                status: 'aktif',
                keterangan: 'Setoran awal',
                createdAt: new Date('2026-07-01T00:00:00.000Z'),
                updatedAt: new Date('2026-07-01T00:00:00.000Z'),
            },
        ];

        const prisma = {
            simpanan: {
                findMany: jest.fn().mockResolvedValue(mockRecords),
            },
        };

        const service = new SimpananService(prisma as any);

        await expect(service.findAll()).resolves.toEqual(mockRecords);
        expect(prisma.simpanan.findMany).toHaveBeenCalledWith({
            orderBy: { createdAt: 'desc' },
        });
    });

    it('should apply a 0.5% automatic interest for balances above 5 million and up to 20 million', async () => {
        const prisma = {
            nasabah: {
                findUnique: jest.fn().mockResolvedValue({ id: 1, nama: 'A', nik: '1', pekerjaan: 'PNS', penghasilan: 0, saldoRataRata: 0, estimasiPengeluaran: 0, createdAt: new Date(), updatedAt: new Date() }),
            },
            simpanan: {
                findMany: jest.fn().mockResolvedValue([]),
                create: jest.fn().mockResolvedValue({ id: 10, nasabahId: 1, jumlahSetoran: 10000000, saldoAkhir: 10050000, status: 'aktif', keterangan: 'Setoran awal' }),
            },
            transaksiBunga: {
                create: jest.fn().mockResolvedValue({ id: 99, simpananId: 10, nominalBunga: 50000, tanggalTransaksi: new Date() }),
            },
        };

        const service = new SimpananService(prisma as any);

        await service.create({
            nasabahId: 1,
            jumlahSetoran: 10000000,
            jenisInterest: 'flat',
            tanggalSetoran: new Date('2026-08-19T00:00:00.000Z'),
            keterangan: 'Setoran awal',
        });

        expect(prisma.transaksiBunga.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    simpananId: 10,
                    nominalBunga: 50000,
                }),
            }),
        );
    });
});
