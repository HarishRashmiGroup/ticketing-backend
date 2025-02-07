import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Media } from "./entities/media.entity";
import { MediaService } from "./media.service";
import { MediaController } from "./media.controller";

@Module({
    imports: [MikroOrmModule.forFeature([Media])],
    controllers: [MediaController],
    providers: [MediaService],
})
export class MediaModule { }
