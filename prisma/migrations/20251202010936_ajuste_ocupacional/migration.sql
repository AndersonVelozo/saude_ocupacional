/*
  Warnings:

  - You are about to drop the column `dataExame` on the `Aso` table. All the data in the column will be lost.
  - You are about to drop the column `observacoes` on the `Aso` table. All the data in the column will be lost.
  - You are about to drop the column `pacienteId` on the `Aso` table. All the data in the column will be lost.
  - You are about to drop the column `situacao` on the `Aso` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Aso` table. All the data in the column will be lost.
  - You are about to drop the column `validade` on the `Aso` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[exameId]` on the table `Aso` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apto` to the `Aso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizadoEm` to the `Aso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exameId` to the `Aso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicoId` to the `Aso` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MEDICO';

-- DropForeignKey
ALTER TABLE "Aso" DROP CONSTRAINT "Aso_pacienteId_fkey";

-- AlterTable
ALTER TABLE "Aso" DROP COLUMN "dataExame",
DROP COLUMN "observacoes",
DROP COLUMN "pacienteId",
DROP COLUMN "situacao",
DROP COLUMN "tipo",
DROP COLUMN "validade",
ADD COLUMN     "apto" BOOLEAN NOT NULL,
ADD COLUMN     "atualizadoEm" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "exameId" INTEGER NOT NULL,
ADD COLUMN     "medicoId" INTEGER NOT NULL,
ADD COLUMN     "parecer" TEXT;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Aso_exameId_key" ON "Aso"("exameId");

-- AddForeignKey
ALTER TABLE "Aso" ADD CONSTRAINT "Aso_exameId_fkey" FOREIGN KEY ("exameId") REFERENCES "ExameOcupacional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aso" ADD CONSTRAINT "Aso_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
