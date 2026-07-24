import { BadRequestException } from '@nestjs/common';
import { NasabahService } from './nasabah.service';

describe('NasabahService', () => {
    it('should turn a duplicate NIK error into a friendly bad request', async () => {
        const prisma = {
            nasabah: {
                create: jest.fn().mockRejectedValue({ code: 'P2002', meta: { target: ['nik'] } }),
            },
        };

        const service = new NasabahService(prisma as any);

        await expect(
            service.create({
                nama: 'Uji Ganda',
                nik: '1234567890123456',
                pekerjaan: 'PNS',
                penghasilan: 5000000,
                riwayatPembayaran: 'Lancar',
            } as any),
        ).rejects.toThrow(BadRequestException);
    });
});
