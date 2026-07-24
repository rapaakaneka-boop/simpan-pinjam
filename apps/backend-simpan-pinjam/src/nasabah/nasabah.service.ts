import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNasabahDto } from './dto/create-nasabah.dto';
import { UpdateNasabahDto } from './dto/update-nasabah.dto';
import { PaginatedNasabahResponse, ListNasabahDto } from './dto/list-nasabah.dto';

function normalizeNasabahPayload(payload: any) {
    const data = payload || {};
    const nama = data.nama ?? data.name ?? data.namaLengkap;
    const nik = data.nik ?? data.NIK;
    const pekerjaan = data.pekerjaan ?? data.kerja ?? 'Tidak tercantum';
    const penghasilan = Number(data.penghasilan ?? data.gaji ?? 0);
    const riwayatPembayaran = data.riwayatPembayaran ?? data.riwayat ?? 'Belum ada data';
    const jumlahTanggungan = data.jumlahTanggungan ?? data.jumlahTanggungan ?? null;

    return {
        nama,
        nik,
        pekerjaan,
        penghasilan,
        riwayatPembayaran,
        jumlahTanggungan,
    };
}

@Injectable()
export class NasabahService {
    constructor(private prisma: PrismaService) { }

    async create(createNasabahDto: CreateNasabahDto) {
        const normalized = normalizeNasabahPayload(createNasabahDto);

        try {
            return await this.prisma.nasabah.create({
                data: {
                    nama: normalized.nama,
                    nik: normalized.nik,
                    pekerjaan: normalized.pekerjaan,
                    penghasilan: normalized.penghasilan,
                    riwayatPembayaran: normalized.riwayatPembayaran,
                    jumlahTanggungan: normalized.jumlahTanggungan,
                },
            });
        } catch (error: any) {
            if (error?.code === 'P2002' && error?.meta?.target?.includes('nik')) {
                throw new BadRequestException('NIK sudah terdaftar. Gunakan NIK yang berbeda.');
            }
            throw error;
        }
    }

    async findAllPaginated(
        page: number = 1,
        limit: number = 10,
        search?: string,
        pekerjaan?: string,
    ): Promise<PaginatedNasabahResponse> {
        const skip = (page - 1) * limit;

        // Build where condition for filtering
        const whereCondition: any = {};
        if (search) {
            whereCondition.OR = [
                { nama: { contains: search, mode: 'insensitive' } },
                { nik: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (pekerjaan) {
            whereCondition.pekerjaan = pekerjaan;
        }

        // Get total count
        const total = await this.prisma.nasabah.count({
            where: whereCondition,
        });

        // Get paginated data (without deep relations for performance)
        const data = await this.prisma.nasabah.findMany({
            where: whereCondition,
            skip,
            take: limit,
            select: {
                id: true,
                nama: true,
                nik: true,
                pekerjaan: true,
                penghasilan: true,
                saldoRataRata: true,
                estimasiPengeluaran: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            data: data as ListNasabahDto[],
            total,
            page,
            limit,
            totalPages,
            hasNextPage,
            hasPrevPage,
        };
    }

    async findAll() {
        return await this.prisma.nasabah.findMany({
            select: {
                id: true,
                nama: true,
                nik: true,
                pekerjaan: true,
                penghasilan: true,
                saldoRataRata: true,
                estimasiPengeluaran: true,
                createdAt: true,
                updatedAt: true,
                pinjaman: true,
                risikoNasabah: true,
                riwayatKredit: true,
            },
        });
    }

    async findOne(id: number) {
        return await this.prisma.nasabah.findUnique({
            where: { id },
            select: {
                id: true,
                nama: true,
                nik: true,
                pekerjaan: true,
                penghasilan: true,
                saldoRataRata: true,
                estimasiPengeluaran: true,
                createdAt: true,
                updatedAt: true,
                pinjaman: true,
                riwayatKredit: true,
                peminjamanEksternal: true,
                risikoNasabah: true,
            },
        });
    }

    async findByNIK(nik: string) {
        return await this.prisma.nasabah.findUnique({
            where: { nik },
            select: {
                id: true,
                nama: true,
                nik: true,
                pekerjaan: true,
                penghasilan: true,
                saldoRataRata: true,
                estimasiPengeluaran: true,
                createdAt: true,
                updatedAt: true,
                pinjaman: true,
                risikoNasabah: true,
                riwayatKredit: true,
            },
        });
    }

    async update(id: number, updateNasabahDto: UpdateNasabahDto) {
        const updateData: any = {};

        if (updateNasabahDto.nama !== undefined) updateData.nama = updateNasabahDto.nama;
        if (updateNasabahDto.pekerjaan !== undefined) updateData.pekerjaan = updateNasabahDto.pekerjaan;
        if (updateNasabahDto.penghasilan !== undefined) updateData.penghasilan = updateNasabahDto.penghasilan;
        if (updateNasabahDto.riwayatPembayaran !== undefined) updateData.riwayatPembayaran = updateNasabahDto.riwayatPembayaran;
        if (updateNasabahDto.jumlahTanggungan !== undefined) updateData.jumlahTanggungan = updateNasabahDto.jumlahTanggungan;
        if (updateNasabahDto.saldoRataRata !== undefined) updateData.saldoRataRata = updateNasabahDto.saldoRataRata;
        if (updateNasabahDto.estimasiPengeluaran !== undefined) updateData.estimasiPengeluaran = updateNasabahDto.estimasiPengeluaran;

        return await this.prisma.nasabah.update({
            where: { id },
            data: updateData,
        });
    }

    async remove(id: number) {
        return await this.prisma.nasabah.delete({
            where: { id },
        });
    }

    async getAllByPekerjaan(pekerjaan: string) {
        return await this.prisma.nasabah.findMany({
            where: { pekerjaan },
            select: {
                id: true,
                nama: true,
                nik: true,
                pekerjaan: true,
                penghasilan: true,
                saldoRataRata: true,
                estimasiPengeluaran: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}
