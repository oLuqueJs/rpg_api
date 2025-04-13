import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { ResponseCharacterDto } from './dto/response-character.dto';
import { CreateItemDto } from '../items/dto/create-item.dto';
import { ResponseItemDto } from '../items/dto/response-item.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('characters')
@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new character' })
  @ApiResponse({ status: 201, description: 'Character created successfully.', type: ResponseCharacterDto })
  @ApiResponse({ status: 400, description: 'Bad request. The sum of strength and defense points must be exactly 10.' })
  async create(@Body() createCharacterDto: CreateCharacterDto): Promise<ResponseCharacterDto> {
    return this.characterService.create(createCharacterDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all characters' })
  @ApiResponse({ status: 200, description: 'Return all characters.', type: [ResponseCharacterDto] })
  async findAll(): Promise<ResponseCharacterDto[]> {
    return this.characterService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a character by ID' })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 200, description: 'Return the character.', type: ResponseCharacterDto })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseCharacterDto> {
    return this.characterService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a character' })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 200, description: 'Character updated successfully.', type: ResponseCharacterDto })
  @ApiResponse({ status: 400, description: 'Bad request. The sum of strength and defense points must be exactly 10.' })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ): Promise<ResponseCharacterDto> {
    return this.characterService.update(id, updateCharacterDto);
  }

  @Patch(':id/pseudonym')
  @ApiOperation({ summary: 'Update a character\'s adventurer pseudonym' })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 200, description: 'Character pseudonym updated successfully.', type: ResponseCharacterDto })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  async updatePseudonym(
    @Param('id', ParseIntPipe) id: number,
    @Body('adventurer_pseudonym') pseudonym: string,
  ): Promise<ResponseCharacterDto> {
    return this.characterService.updateAdventurerPseudonym(id, pseudonym);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a character' })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 204, description: 'Character deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.characterService.remove(id);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add a magic item to a character' })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 201, description: 'Item added successfully.', type: ResponseItemDto })
  @ApiResponse({ status: 400, description: 'Bad request. Item validation failed.' })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  @ApiResponse({ status: 409, description: 'Conflict. Character can only have one amulet.' })
  async addItemToCharacter(
    @Param('id', ParseIntPipe) id: number,
    @Body() createItemDto: CreateItemDto,
  ): Promise<ResponseItemDto> {
    return this.characterService.addItemToCharacter(id, createItemDto);
  }

  @Get(':id/items')
  @ApiOperation({ summary: 'List all items of a character' })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 200, description: 'Return all items of the character.', type: [ResponseItemDto] })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  async findCharacterItems(@Param('id', ParseIntPipe) id: number): Promise<ResponseItemDto[]> {
    return this.characterService.findCharacterItems(id);
  }

  @Get(':id/amulet')
  @ApiOperation({ summary: 'Get character\'s amulet' })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 200, description: 'Return the character\'s amulet or null if not found.', type: ResponseItemDto })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  async findCharacterAmulet(@Param('id', ParseIntPipe) id: number): Promise<ResponseItemDto | null> {
    return this.characterService.findCharacterAmulet(id);
  }

  @Delete(':characterId/items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove an item from a character' })
  @ApiParam({ name: 'characterId', description: 'Character ID' })
  @ApiParam({ name: 'itemId', description: 'Item ID' })
  @ApiResponse({ status: 204, description: 'Item removed successfully.' })
  @ApiResponse({ status: 404, description: 'Character or item not found.' })
  async removeItemFromCharacter(
    @Param('characterId', ParseIntPipe) characterId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<void> {
    return this.characterService.removeItemFromCharacter(characterId, itemId);
  }

  @Post(':id/level-up')
  @ApiOperation({ summary: 'Level up a character' })
  @ApiParam({ name: 'id', description: 'Character ID' })
  @ApiResponse({ status: 200, description: 'Character leveled up successfully.', type: ResponseCharacterDto })
  @ApiResponse({ status: 404, description: 'Character not found.' })
  async levelUp(@Param('id', ParseIntPipe) id: number): Promise<ResponseCharacterDto> {
    return this.characterService.levelUp(id);
  }
}
