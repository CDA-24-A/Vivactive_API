-- DropForeignKey
ALTER TABLE `citizen` DROP FOREIGN KEY `Citizen_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_citizenId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_ressourceId_fkey`;

-- DropForeignKey
ALTER TABLE `favorite` DROP FOREIGN KEY `Favorite_citizenId_fkey`;

-- DropForeignKey
ALTER TABLE `favorite` DROP FOREIGN KEY `Favorite_ressourceId_fkey`;

-- DropForeignKey
ALTER TABLE `invite` DROP FOREIGN KEY `Invite_receverId_fkey`;

-- DropForeignKey
ALTER TABLE `invite` DROP FOREIGN KEY `Invite_ressourceId_fkey`;

-- DropForeignKey
ALTER TABLE `invite` DROP FOREIGN KEY `Invite_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_citizenId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_ressourceId_fkey`;

-- DropForeignKey
ALTER TABLE `progression` DROP FOREIGN KEY `Progression_citizenId_fkey`;

-- DropForeignKey
ALTER TABLE `progression` DROP FOREIGN KEY `Progression_ressourceId_fkey`;

-- DropForeignKey
ALTER TABLE `progression` DROP FOREIGN KEY `Progression_stepId_fkey`;

-- DropForeignKey
ALTER TABLE `ressource` DROP FOREIGN KEY `Ressource_bannerId_fkey`;

-- DropForeignKey
ALTER TABLE `ressource` DROP FOREIGN KEY `Ressource_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `ressource` DROP FOREIGN KEY `Ressource_citizenId_fkey`;

-- DropForeignKey
ALTER TABLE `ressource` DROP FOREIGN KEY `Ressource_fileId_fkey`;

-- DropForeignKey
ALTER TABLE `ressource` DROP FOREIGN KEY `Ressource_typeRessourceId_fkey`;

-- DropForeignKey
ALTER TABLE `step` DROP FOREIGN KEY `Step_ressourceId_fkey`;

-- DropIndex
DROP INDEX `Citizen_roleId_fkey` ON `citizen`;

-- DropIndex
DROP INDEX `Comment_citizenId_fkey` ON `comment`;

-- DropIndex
DROP INDEX `Comment_ressourceId_fkey` ON `comment`;

-- DropIndex
DROP INDEX `Favorite_ressourceId_fkey` ON `favorite`;

-- DropIndex
DROP INDEX `Invite_receverId_fkey` ON `invite`;

-- DropIndex
DROP INDEX `Invite_ressourceId_fkey` ON `invite`;

-- DropIndex
DROP INDEX `Invite_senderId_fkey` ON `invite`;

-- DropIndex
DROP INDEX `Message_citizenId_fkey` ON `message`;

-- DropIndex
DROP INDEX `Message_ressourceId_fkey` ON `message`;

-- DropIndex
DROP INDEX `Progression_citizenId_fkey` ON `progression`;

-- DropIndex
DROP INDEX `Progression_ressourceId_fkey` ON `progression`;

-- DropIndex
DROP INDEX `Progression_stepId_fkey` ON `progression`;

-- DropIndex
DROP INDEX `Ressource_bannerId_fkey` ON `ressource`;

-- DropIndex
DROP INDEX `Ressource_categoryId_fkey` ON `ressource`;

-- DropIndex
DROP INDEX `Ressource_citizenId_fkey` ON `ressource`;

-- DropIndex
DROP INDEX `Ressource_fileId_fkey` ON `ressource`;

-- DropIndex
DROP INDEX `Ressource_typeRessourceId_fkey` ON `ressource`;

-- DropIndex
DROP INDEX `Step_ressourceId_fkey` ON `step`;

-- AddForeignKey
ALTER TABLE `Citizen` ADD CONSTRAINT `Citizen_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ressource` ADD CONSTRAINT `Ressource_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ressource` ADD CONSTRAINT `Ressource_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ressource` ADD CONSTRAINT `Ressource_bannerId_fkey` FOREIGN KEY (`bannerId`) REFERENCES `Image`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ressource` ADD CONSTRAINT `Ressource_typeRessourceId_fkey` FOREIGN KEY (`typeRessourceId`) REFERENCES `TypeRessource`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ressource` ADD CONSTRAINT `Ressource_citizenId_fkey` FOREIGN KEY (`citizenId`) REFERENCES `Citizen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_citizenId_fkey` FOREIGN KEY (`citizenId`) REFERENCES `Citizen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_ressourceId_fkey` FOREIGN KEY (`ressourceId`) REFERENCES `Ressource`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Step` ADD CONSTRAINT `Step_ressourceId_fkey` FOREIGN KEY (`ressourceId`) REFERENCES `Ressource`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Progression` ADD CONSTRAINT `Progression_citizenId_fkey` FOREIGN KEY (`citizenId`) REFERENCES `Citizen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Progression` ADD CONSTRAINT `Progression_stepId_fkey` FOREIGN KEY (`stepId`) REFERENCES `Step`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Progression` ADD CONSTRAINT `Progression_ressourceId_fkey` FOREIGN KEY (`ressourceId`) REFERENCES `Ressource`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_citizenId_fkey` FOREIGN KEY (`citizenId`) REFERENCES `Citizen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_ressourceId_fkey` FOREIGN KEY (`ressourceId`) REFERENCES `Ressource`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_citizenId_fkey` FOREIGN KEY (`citizenId`) REFERENCES `Citizen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_ressourceId_fkey` FOREIGN KEY (`ressourceId`) REFERENCES `Ressource`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invite` ADD CONSTRAINT `Invite_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `Citizen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invite` ADD CONSTRAINT `Invite_receverId_fkey` FOREIGN KEY (`receverId`) REFERENCES `Citizen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invite` ADD CONSTRAINT `Invite_ressourceId_fkey` FOREIGN KEY (`ressourceId`) REFERENCES `Ressource`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
