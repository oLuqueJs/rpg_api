import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ResponseItemDto } from './dto/response-item.dto';
import { plainToClass } from 'class-transformer';
import { ItemType } from '@prisma/client';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find all magic items
   */
  async findAll(): Promise<ResponseItemDto[]> {
    try {
      const items = await this.prisma.magicItem.findMany();
      return items.map(item => plainToClass(ResponseItemDto, item));
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch items: ${error.message}`);
    }
  }

  /**
   * Find one magic item by id
   */
  async findOne(id: number): Promise<ResponseItemDto> {
    try {
      const item = await this.prisma.magicItem.findUnique({
        where: { id },
      });
      
      if (!item) {
        throw new NotFoundException(`Item with ID ${id} not found`);
      }
      
      return plainToClass(ResponseItemDto, item);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to fetch item: ${error.message}`);
    }
  }

  /**
   * Find items by type
   */
  async findByType(type: ItemType): Promise<ResponseItemDto[]> {
    try {
      const items = await this.prisma.magicItem.findMany({
        where: { item_type: type },
      });
      
      return items.map(item => plainToClass(ResponseItemDto, item));
    } catch (error) {
      throw new InternalServerErrorException(`Failed to fetch items by type: ${error.message}`);
    }
  }
}