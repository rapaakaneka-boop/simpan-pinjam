import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePinjamanDto {
    @ApiPropertyOptional({ description: 'Jumlah pinjaman yang diajukan' })
    jumlahPinjaman?: number;

    @ApiPropertyOptional({ description: 'Tenor pinjaman dalam bulan' })
    tenor?: number;

    @ApiPropertyOptional({ description: 'Suku bunga dalam persen' })
    sukuBunga?: number;

    @ApiPropertyOptional({ description: 'Jenis perhitungan bunga' })
    jenisBunga?: 'flat' | 'efektif';

    @ApiPropertyOptional({ description: 'Cicilan bulanan yang dihitung' })
    cicilanBulanan?: number;

    @ApiPropertyOptional({ description: 'Total bunga yang dihitung' })
    totalBunga?: number;

    @ApiPropertyOptional({ description: 'Total pembayaran yang dihitung' })
    totalPembayaran?: number;

    @ApiPropertyOptional({ enum: ['pending', 'approved', 'active', 'completed', 'rejected'], description: 'Status pinjaman' })
    status?: 'pending' | 'approved' | 'active' | 'completed' | 'rejected';

    @ApiPropertyOptional({ type: String, format: 'date-time', description: 'Tanggal persetujuan jika ada' })
    tanggalAsetujuan?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time', description: 'Tanggal selesai pinjaman jika ada' })
    tanggalSelesai?: Date;
}
