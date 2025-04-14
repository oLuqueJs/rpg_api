import { Controller, Get, Param, ParseEnumPipe, ParseIntPipe } from '@nestjs/common';
import { ItemService } from './item.service';
import { ResponseItemDto } from './dto/response-item.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ItemType } from '@prisma/client';

@ApiTags('items')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  @ApiOperation({ summary: 'List all magic items' })
  @ApiResponse({ status: 200, description: 'Return all magic items.', type: [ResponseItemDto] })
  async findAll(): Promise<ResponseItemDto[]> {
    return this.itemService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a magic item by ID' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiResponse({ status: 200, description: 'Return the magic item.', type: ResponseItemDto })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseItemDto> {
    return this.itemService.findOne(id);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'List magic items by type' })
  @ApiParam({ name: 'type', description: 'Item type (WEAPON, ARMOR, AMULET)', enum: ItemType })
  @ApiResponse({ status: 200, description: 'Return magic items of the specified type.', type: [ResponseItemDto] })
  async findByType(@Param('type', new ParseEnumPipe(ItemType)) type: ItemType): Promise<ResponseItemDto[]> {
    return this.itemService.findByType(type);
  }
}