-- CreateTable
CREATE TABLE `groep` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Naam` VARCHAR(255) NOT NULL,
    `Aanmaakdatum` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Geldig` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `groepstudent` (
    `GroepID` INTEGER NOT NULL,
    `StudentID` INTEGER NOT NULL,
    `Aanmaakdatum` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Geldig` INTEGER NOT NULL DEFAULT 1,

    INDEX `GroepID`(`GroepID`),
    PRIMARY KEY (`StudentID`, `GroepID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `opdracht` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Naam` VARCHAR(512) NOT NULL,
    `Geldig` INTEGER NOT NULL DEFAULT 1,
    `Aanmaakdatum` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Naam_UNIQUE`(`Naam`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `opdrachtelement` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `OpdrachtID` INTEGER NOT NULL,
    `Beschrijving` VARCHAR(4096) NOT NULL,
    `Minuten` INTEGER NOT NULL DEFAULT 1,
    `Geldig` INTEGER NOT NULL DEFAULT 1,
    `Aanmaakdatum` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `opdrachtelement_ID_key`(`ID`),
    INDEX `OpdrachtID`(`OpdrachtID`),
    PRIMARY KEY (`ID`, `Aanmaakdatum`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rapport` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `StudentID` INTEGER NOT NULL,
    `OpdrachtElementID` INTEGER NOT NULL,
    `Status` INTEGER NOT NULL DEFAULT 0,
    `ExtraMinuten` INTEGER NOT NULL DEFAULT 0,
    `Aanmaakdatum` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Geldig` INTEGER NOT NULL DEFAULT 1,

    INDEX `OpdrachtElementID`(`OpdrachtElementID`),
    INDEX `StudentID`(`StudentID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Code` VARCHAR(45) NOT NULL,
    `Gebruikersnaam` VARCHAR(45) NOT NULL,
    `Familienaam` VARCHAR(45) NOT NULL,
    `Voornaam` VARCHAR(45) NOT NULL,
    `Sorteernaam` VARCHAR(90) NOT NULL,
    `Email` VARCHAR(90) NOT NULL,
    `Aanmaakdatum` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Geldig` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vraagstudent` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `RapportID` INTEGER NOT NULL,
    `Beschrijving` VARCHAR(255) NOT NULL,
    `Aanmaakdatum` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Geldig` INTEGER NULL DEFAULT 1,

    INDEX `RapportID`(`RapportID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `groepstudent` ADD CONSTRAINT `groepstudent_ibfk_1` FOREIGN KEY (`GroepID`) REFERENCES `groep`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `groepstudent` ADD CONSTRAINT `groepstudent_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `student`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `opdrachtelement` ADD CONSTRAINT `opdrachtelement_ibfk_1` FOREIGN KEY (`OpdrachtID`) REFERENCES `opdracht`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rapport` ADD CONSTRAINT `rapport_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `student`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rapport` ADD CONSTRAINT `rapport_ibfk_2` FOREIGN KEY (`OpdrachtElementID`) REFERENCES `opdrachtelement`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `vraagstudent` ADD CONSTRAINT `vraagstudent_ibfk_1` FOREIGN KEY (`RapportID`) REFERENCES `rapport`(`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
