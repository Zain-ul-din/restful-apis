-- CreateTable
CREATE TABLE `Data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rollNo` CHAR(50) NOT NULL,
    `name` CHAR(50) NOT NULL,
    `fName` CHAR(50) NOT NULL,
    `section` CHAR(2) NOT NULL,
    `cnic` CHAR(13) NOT NULL,

    UNIQUE INDEX `Data_cnic_key`(`cnic`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
