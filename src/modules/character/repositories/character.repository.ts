import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { CreateCharacterDto } from "../dto/create-character.dto";
import { ResponseCharacterDto } from "../dto/response-character.dto";
import { UpdateCharacterDto } from "../dto/update-character.dto";

@Injectable()
export class CharacterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCharacterDto: CreateCharacterDto): Promise<ResponseCharacterDto> {
    try{
      return await this.prisma.character.create({
        data: {
          name: createCharacterDto.name,
          adventurer_pseudonym: createCharacterDto.adventurer_pseudonym,
          strenght_points: createCharacterDto.strenght_points,
          defense_points: createCharacterDto.defense_points,
          class: createCharacterDto.class,
        },
        include: {
          backpack: true,
        },
      });
    } catch (error){
      throw new InternalServerErrorException("TOHANDLE");
    }
  }

  async findAll(): Promise<ResponseCharacterDto[]>{
    try {
      return await this.prisma.character.findMany({
        include: {
          backpack: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException("TOHANDLE");
    }
  }

  async findOne(characterId: number): Promise<ResponseCharacterDto|null>{
    try {
      return await this.prisma.character.findUnique({
        where: {
          id: characterId,
        },
        include: {
          backpack: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException("TOHANDLE");
    }
  }

  async update(updateCharacterDto: UpdateCharacterDto, characterId: number):Promise<UpdateCharacterDto> {
    try {
      return await this.prisma.character.update({
        where: {
          id: characterId
        },
        data: {
          ...updateCharacterDto,
        },
        include: {
          backpack: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException("TOHANDLE");
    }
  }

  async delete(characterId: number): Promise<void> {
    try {
      await this.prisma.character.delete({
        where: {
          id: characterId
        }
      })
    } catch (error) {
      throw new InternalServerErrorException("TOHANDLE")
    }
  }
}