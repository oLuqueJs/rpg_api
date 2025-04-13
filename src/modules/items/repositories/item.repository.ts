import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { CreateItemDto } from "../dto/create-item.dto";
import { ResponseItemDto } from "../dto/response-item.dto";
import { UpdateItemDto } from "../dto/update-item.dto";
import { plainToClass } from "class-transformer";
import { ItemType } from "@prisma/client";

@Injectable()
export class ItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ResponseItemDto[]> {
    try {
      const items = await this.prisma.magicItem.findMany();
      return items.map(item => plainToClass(ResponseItemDto, item));
    } catch (error) {
      throw new InternalServerErrorException("Failed to fetch items");
    }
  }

  async findOne(itemId: number): Promise<ResponseItemDto | null> {
    try {
      const item = await this.prisma.magicItem.findUnique({
        where: {
          id: itemId,
        },
      });
      
      if (!item) {
        throw new NotFoundException(`Item with ID ${itemId} not found`);
      }
      
      return plainToClass(ResponseItemDto, item);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to fetch item");
    }
  }

  private validateItem(item: CreateItemDto | UpdateItemDto): void {

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