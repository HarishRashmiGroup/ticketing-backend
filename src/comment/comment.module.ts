import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { EmailModule } from "../email/email.module";
import { Comment } from "./entities/comment.entity";
import { User } from "../user/entities/user.entity";
import { Ticketing } from "../ticketing/entities/ticketing.entity";

@Module({
    imports: [MikroOrmModule.forFeature([Ticketing, User, Comment]), EmailModule],
    controllers: [CommentController],
    providers: [CommentService]

})
export class CommentModule { }