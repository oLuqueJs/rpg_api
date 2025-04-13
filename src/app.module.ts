import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { CharacterModule } from './modules/character/character.module';
import { ItemModule } from './modules/items/item.module';
@Module({
  imports: [PrismaModule, CharacterModule, ItemModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
