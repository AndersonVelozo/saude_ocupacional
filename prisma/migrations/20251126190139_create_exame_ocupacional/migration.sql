-- CreateEnum
CREATE TYPE "TipoExame" AS ENUM ('ADMISSIONAL', 'PERIODICO', 'DEMISSIONAL', 'RETORNO_TRABALHO', 'MUDANCA_FUNCAO');

-- CreateTable
CREATE TABLE "ExameOcupacional" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoExame" NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "colaboradorId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExameOcupacional_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExameOcupacional" ADD CONSTRAINT "ExameOcupacional_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Colaborador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
