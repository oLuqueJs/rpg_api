import { ItemType } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, ValidateIf } from "class-validator";

export class CreateItemDto {
  @IsString()
  @MaxLength(150)
  @IsNotEmpty()
  name: string;

  @IsEnum(ItemType)
  item_type: ItemType;

  @IsInt()
  @Min(0)
  @Max(10)
  @ValidateIf(o => o.item_type !== 'ARMOR')
  strength_points: number = 0;

  @IsInt()
  @Min(0)
  @Max(10)
  @ValidateIf(o => o.item_type !== 'WEAPON')
  defense_points: number = 0;

  character_id?: number;
}
