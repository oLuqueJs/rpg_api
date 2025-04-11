-- CreateEnum
CREATE TYPE "Class" AS ENUM ('WARRIOR', 'MAGE', 'ARCHER', 'ROGUE', 'BARD');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('WEAPON', 'ARMOR', 'AMULET');

-- CreateTable
CREATE TABLE "tb_characters" (
    "character_id" SERIAL NOT NULL,
    "character_name" VARCHAR(150) NOT NULL,
    "character_adventurer_pseudonym" VARCHAR(150) NOT NULL,
    "character_class" "Class" NOT NULL,
    "character_level" INTEGER NOT NULL DEFAULT 1,
    "character_strenght" INTEGER NOT NULL,
    "character_defense" INTEGER NOT NULL,

    CONSTRAINT "tb_characters_pkey" PRIMARY KEY ("character_id")
);

-- CreateTable
CREATE TABLE "tb_items" (
    "item_id" SERIAL NOT NULL,
    "item_name" VARCHAR(150) NOT NULL,
    "item_type" "ItemType" NOT NULL,
    "item_strenght" INTEGER NOT NULL,
    "item_defense" INTEGER NOT NULL,
    "CharacterId" INTEGER NOT NULL,

    CONSTRAINT "tb_items_pkey" PRIMARY KEY ("item_id")
);

-- CreateIndex
CREATE INDEX "tb_characters_character_adventurer_pseudonym_character_clas_idx" ON "tb_characters"("character_adventurer_pseudonym", "character_class");

-- CreateIndex
CREATE INDEX "tb_items_item_name_item_type_idx" ON "tb_items"("item_name", "item_type");

-- AddForeignKey
ALTER TABLE "tb_items" ADD CONSTRAINT "tb_items_CharacterId_fkey" FOREIGN KEY ("CharacterId") REFERENCES "tb_characters"("character_id") ON DELETE RESTRICT ON UPDATE CASCADE;
