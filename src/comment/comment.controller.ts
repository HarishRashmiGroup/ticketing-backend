import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { Auth } from "../common/decorators/auth.decorator";
import { User } from "../common/decorators/user.decorator";

@Controller('comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
    ) { }
    @Auth()
    @Post()
    newComment(@User() userId: string, @Body() body: { description: string; ticketId: number }) {
        return this.commentService.createTask(userId, body.description, body.ticketId);
    }

    @Auth()
    @Get(':taskId')
    getComments(@Param('taskId') ticketId: number) {
        return this.commentService.getComments(ticketId);
    }
}