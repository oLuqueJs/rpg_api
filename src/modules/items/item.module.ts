import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { ItemRepository } from "./repositories/item.repository";
import { ItemService } from "./item.service";

@Module({
  exports:[],
  imports:[],
  controllers:[ItemController],
  providers:[ItemRepository, ItemService],
})
export class ItemModule {}