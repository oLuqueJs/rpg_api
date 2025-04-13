import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { CreateCharacterDto } from "../dto/create-character.dto";
import { ResponseCharacterDto } from "../dto/response-character.dto";
import { UpdateCharacterDto } from "../dto/update-character.dto";
import { plainToClass } from "class-transformer";
import { CreateItemDto } from "src/modules/items/dto/create-item.dto";
import { ResponseItemDto } from "src/modules/items/dto/response-item.dto";
import { ItemType } from "@prisma/client";

@Injectable()
export class CharacterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCharacterDto: CreateCharacterDto): Promise<ResponseCharacterDto> {
    try {
      const { strength_points, defense_points } = createCharacterDto;
      if (strength_points + defense_points !== 10) {
        throw new BadRequestException('The sum of strength and defense points must be exactly 10');
      }

      const character = await this.prisma.character.create({
        data: {
          name: createCharacterDto.name,
          adventurer_pseudonym: createCharacterDto.adventurer_pseudonym,
          strength_points: createCharacterDto.strength_points,
          defense_points: createCharacterDto.defense_points,
          class: createCharacterDto.class,
        },
        include: {
          backpack: true,
        },
      });

      return plainToClass(ResponseCharacterDto, character);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to create character");
    }
  }

  async findAll(): Promise<ResponseCharacterDto[]> {
    try {
      const characters = await this.prisma.character.findMany({
        include: {
          backpack: true,
        },
      });
      
      return characters.map(character => plainToClass(ResponseCharacterDto, character));
    } catch (error) {
      throw new InternalServerErrorException("Failed to fetch characters");
    }
  }

  async findOne(characterId: number): Promise<ResponseCharacterDto | null> {
    try {
      const character = await this.prisma.character.findUnique({
        where: {
          id: characterId,
        },
        include: {
          backpack: true,
        },
      });
      
      if (!character) {
        throw new NotFoundException(`Character with ID ${characterId} not found`);
      }
      
      return plainToClass(ResponseCharacterDto, character);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to fetch character");
    }
  }

  async update(updateCharacterDto: UpdateCharacterDto, characterId: number): Promise<ResponseCharacterDto> {
    try {
      const currentCharacter = await this.prisma.character.findUnique({
        where: { id: characterId },
      });
      
      if (!currentCharacter) {
        throw new NotFoundException(`Character with ID ${characterId} not found`);
      }
      
      if (updateCharacterDto.strength_points !== undefined || updateCharacterDto.defense_points !== undefined) {
        const newStrength = updateCharacterDto.strength_points ?? currentCharacter.strength_points;
        const newDefense = updateCharacterDto.defense_points ?? currentCharacter.defense_points;
        
        if (newStrength + newDefense !== 10) {
          throw new BadRequestException('The sum of strength and defense points must be exactly 10');
        }
      }
      
      const { backpack, ...updateData } = updateCharacterDto;
      
      const updatedCharacter = await this.prisma.character.update({
        where: {
          id: characterId
        },
        data: updateData,
        include: {
          backpack: true,
        },
      });
      
      return plainToClass(ResponseCharacterDto, updatedCharacter);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to update character");
    }
  }

  async delete(characterId: number): Promise<void> {
    try {
      const character = await this.prisma.character.findUnique({
        where: { id: characterId },
      });
      
      if (!character) {
        throw new NotFoundException(`Character with ID ${characterId} not found`);
      }
      
      await this.prisma.character.delete({
        where: {
          id: characterId
        }
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to delete character");
    }
  }

  async addItemToCharacter(characterId: number, createItemDto: CreateItemDto): Promise<ResponseItemDto> {
    try {
      const character = await this.prisma.character.findUnique({
        where: { id: characterId },
        include: { backpack: true }
      });
      
      if (!character) {
        throw new NotFoundException(`Character with ID ${characterId} not found`);
      }
      
      this.validateItem(createItemDto);
      
      if (createItemDto.item_type === ItemType.AMULET) {
        const hasAmulet = character.backpack.some(item => item.item_type === ItemType.AMULET);
        if (hasAmulet) {
          throw new ConflictException('Character can only have one amulet');
        }
      }
      
      const item = await this.prisma.magicItem.create({
        data: {
          name: createItemDto.name,
          item_type: createItemDto.item_type,
          strength_points: createItemDto.strength_points,
          defense_points: createItemDto.defense_points,
          character_id: characterId
        }
      });
      
      return plainToClass(ResponseItemDto, item);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to add item to character");
    }
  }

  async findCharacterItems(characterId: number): Promise<ResponseItemDto[]> {
    try {
      const character = await this.prisma.character.findUnique({
        where: { id: characterId },
        include: { backpack: true }
      });
      
      if (!character) {
        throw new NotFoundException(`Character with ID ${characterId} not found`);
      }
      
      return character.backpack.map(item => plainToClass(ResponseItemDto, item));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to fetch character items");
    }
  }

  async findCharacterAmulet(characterId: number): Promise<ResponseItemDto | null> {
    try {
      const character = await this.prisma.character.findUnique({
        where: { id: characterId },
        include: { 
          backpack: {
            where: { item_type: ItemType.AMULET }
          }
        }
      });
      
      if (!character) {
        throw new NotFoundException(`Character with ID ${characterId} not found`);
      }
      
      if (character.backpack.length === 0) {
        return null;
      }
      
      return plainToClass(ResponseItemDto, character.backpack[0]);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to fetch character amulet");
    }
  }

  async removeItemFromCharacter(characterId: number, itemId: number): Promise<void> {
    try {
      const item = await this.prisma.magicItem.findFirst({
        where: { 
          id: itemId,
          character_id: characterId
        }
      });
      
      if (!item) {
        throw new NotFoundException(`Item with ID ${itemId} not found for character ${characterId}`);
      }
      
      await this.prisma.magicItem.delete({
        where: { id: itemId }
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to remove item from character");
    }
  }

  private validateItem(item: CreateItemDto): void {
    if (item.strength_points === 0 && item.defense_points === 0) {
      throw new BadRequestException('Item cannot have zero strength and zero defense');
    }
    
    if (item.item_type === ItemType.WEAPON && item.defense_points !== 0) {
      throw new BadRequestException('Weapons must have zero defense');
    }
    
    if (item.item_type === ItemType.ARMOR && item.strength_points !== 0) {
      throw new BadRequestException('Armor must have zero strength');
    }
  }
}
