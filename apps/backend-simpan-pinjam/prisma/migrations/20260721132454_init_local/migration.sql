/*
  Warnings:

  - You are about to drop the column `alamat` on the `Nasabah` table. All the data in the column will be lost.
  - You are about to drop the column `alamatIbuKandung` on the `Nasabah` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Nasabah` table. All the data in the column will be lost.
  - You are about to drop the column `namaIbuKandung` on the `Nasabah` table. All the data in the column will be lost.
  - You are about to drop the column `noHp` on the `Nasabah` table. All the data in the column will be lost.
  - You are about to drop the column `noRek` on the `Nasabah` table. All the data in the column will be lost.
  - You are about to drop the column `tanggalLahir` on the `Nasabah` table. All the data in the column will be lost.
  - You are about to drop the column `tanggalLahirIbuKandung` on the `Nasabah` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Nasabah" DROP COLUMN "alamat",
DROP COLUMN "alamatIbuKandung",
DROP COLUMN "email",
DROP COLUMN "namaIbuKandung",
DROP COLUMN "noHp",
DROP COLUMN "noRek",
DROP COLUMN "tanggalLahir",
DROP COLUMN "tanggalLahirIbuKandung",
ADD COLUMN     "jumlahTanggungan" INTEGER,
ADD COLUMN     "riwayatPembayaran" TEXT;

-- CreateTable
CREATE TABLE "AnalisisRisiko" (
    "id" SERIAL NOT NULL,
    "nasabahId" INTEGER NOT NULL,
    "skorPekerjaan" INTEGER NOT NULL,
    "skorPenghasilan" INTEGER NOT NULL,
    "skorLamaBekerja" INTEGER NOT NULL,
    "skorRiwayat" INTEGER NOT NULL,
    "skorTanggungan" INTEGER NOT NULL,
    "totalSkor" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalisisRisiko_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnalisisRisiko" ADD CONSTRAINT "AnalisisRisiko_nasabahId_fkey" FOREIGN KEY ("nasabahId") REFERENCES "Nasabah"("id") ON DELETE CASCADE ON UPDATE CASCADE;
