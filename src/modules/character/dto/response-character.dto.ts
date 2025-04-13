import { IsEnum, IsInt, IsString, Max, MaxLength } from "class-validator";
import { Class } from "@prisma/client";
import { ResponseItemDto } from "src/modules/items/dto/response-item.dto";
import { Exclude, Expose, Transform } from "class-transformer";

export class ResponseCharacterDto {
    @IsString()
    @MaxLength(150)
    name: string;
  
    @IsString()
    @MaxLength(150)
    adventurer_pseudonym: string;
  
    @IsEnum(Class)
    class: Class;
  
    @IsInt()
    level: number;

    @Exclude()
    strength_points: number;
  
    @Exclude()
    defense_points: number;
  
    backpack: ResponseItemDto[];
    
    @Expose()
    @Transform(({ obj }) => {
      const baseStrength = obj.strength_points || 0;
      const itemsStrength = obj.backpack?.reduce((total, item) => total + (item.strength_points || 0), 0) || 0;
      return baseStrength + itemsStrength;
    })
    get total_strength(): number {
      return 0; 
    }
    
    @Expose()
    @Transform(({ obj }) => {
      const baseDefense = obj.defense_points || 0;
      const itemsDefense = obj.backpack?.reduce((total, item) => total + (item.defense_points || 0), 0) || 0;
      return baseDefense + itemsDefense;
    })
    get total_defense(): number {
      return 0; 
    }
}