-- CreateTable
CREATE TABLE "Data" (
    "id" SERIAL NOT NULL,
    "rollNo" CHAR(50) NOT NULL,
    "name" CHAR(50) NOT NULL,
    "fName" CHAR(50) NOT NULL,
    "section" CHAR(2) NOT NULL,

    CONSTRAINT "Data_pkey" PRIMARY KEY ("id")
);
