import { Module } from "@nestjs/common";
import { CharacterController } from "./character.controller";
import { CharacterRepository } from "./repositories/character.repository";
import { CharacterService } from "./character.service";
import { PrismaModule } from "src/common/prisma/prisma.module";

@Module({
  exports:[],
  imports:[PrismaModule],
  controllers:[CharacterController],
  providers:[CharacterRepository, CharacterService],
})
export class CharacterModule {}
