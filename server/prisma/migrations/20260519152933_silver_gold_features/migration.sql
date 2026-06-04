-- CreateTable
CREATE TABLE `PasswordReset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PasswordReset_token_key`(`token`),
    INDEX `PasswordReset_token_idx`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Appointment_date_idx` ON `Appointment`(`date`);

-- AddForeignKey
ALTER TABLE `PasswordReset` ADD CONSTRAINT `PasswordReset_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `Appointment_petId_idx` ON `Appointment`(`petId`);
DROP INDEX `Appointment_petId_fkey` ON `appointment`;

-- RedefineIndex
CREATE INDEX `Appointment_serviceId_idx` ON `Appointment`(`serviceId`);
DROP INDEX `Appointment_serviceId_fkey` ON `appointment`;

-- RedefineIndex
CREATE INDEX `Pet_ownerId_idx` ON `Pet`(`ownerId`);
DROP INDEX `Pet_ownerId_fkey` ON `pet`;

-- RedefineIndex
CREATE INDEX `Pet_speciesId_idx` ON `Pet`(`speciesId`);
DROP INDEX `Pet_speciesId_fkey` ON `pet`;
