import { ItemType } from "@prisma/client";
import { IsEnum, IsInt, IsString, Max, MaxLength, Min } from "class-validator";

export class ResponseItemDto {
  @IsInt()
  id: number;
  
  @IsString()
  @MaxLength(150)
  name: string;

  @IsEnum(ItemType)
  item_type: ItemType;

  @IsInt()
  @Min(0)
  @Max(10)
  strength_points: number;

  @IsInt()
  @Min(0)
  @Max(10)
  defense_points: number;

  character_id: number;
}
