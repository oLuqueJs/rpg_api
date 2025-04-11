import { IsEnum, IsInt, IsNumber, IsString, Max, max, MaxLength } from "class-validator";
import { Class } from "@prisma/client";

export class CreateCharacterDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsString()
  @MaxLength(150)
  adventurer_pseudonym: string;

  @IsEnum(Class)
  class: Class;

  @IsInt()
  @Max(10)
  strenght_points: number;

  @IsInt()
  @Max(10)
  defense_points: number;

  backpack: any //TODO: MAGIC ITEMS HERE
}