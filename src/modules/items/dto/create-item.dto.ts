import { ItemType } from "@prisma/client";
import { IsEnum, IsInt, IsString, Max, MaxLength } from "class-validator";

export class CreateItemDto {
  @IsString()
  @MaxLength(150)
  name: String

  @IsEnum(ItemType)
  item_type: ItemType

  @IsInt()
  @Max(10)
  strenght_points: number;

  @IsInt()
  @Max(10)
  defense_points: number;
}