import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Ticketing } from "./entities/ticketing.entity";
import { TicketingController } from "./ticketing.controller";
import { TicketingService } from "./ticketing.service";
import { Category } from "./entities/categoy.entity";
import { SubCategory } from "./entities/subcategory.entity";
import { Item } from "./entities/item.entity";
import { User } from "src/user/entities/user.entity";
import { Media } from "src/media/entities/media.entity";
import { EmailService } from "src/email/email.service";
import { Comment } from "./entities/comment.entity";

@Module({
  imports: [MikroOrmModule.forFeature([Ticketing, Comment, Category, SubCategory, Item, User, Media])],
  controllers: [TicketingController],
  providers: [TicketingService, EmailService],
})
export class TicketingModule { }
