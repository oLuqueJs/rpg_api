import { IsEnum, IsInt, IsString, Max, MaxLength, Min, Validate, ValidateIf } from "class-validator";
import { Class } from "@prisma/client";
import { Type } from "class-transformer";
import { CreateItemDto } from "src/modules/items/dto/create-item.dto";

export class AttributesSumValidator {
  validate(value: number, args: any) {
    const obj = args.object;
    const sum = (obj.strength_points || 0) + (obj.defense_points || 0);
    return sum <= 10;
  }

  defaultMessage() {
    return 'The sum of strength and defense points must not exceed 10';
  }
}

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
  @Min(0)
  @Max(10)
  @Validate(AttributesSumValidator)
  strength_points: number;

  @IsInt()
  @Min(0)
  @Max(10)
  @Validate(AttributesSumValidator)
  defense_points: number;

  @ValidateIf(o => o.backpack && o.backpack.length > 0)
  @Type(() => CreateItemDto)
  backpack?: CreateItemDto[];
}