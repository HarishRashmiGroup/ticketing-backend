import { Comment } from "src/ticketing/entities/comment.entity";
import { UserRole } from "../entities/user.entity";

export class CommentsRO{
    author: string;
    createdAt: Date;
    content: string;
    isIT: boolean;
    constructor(comment: Comment){
        this.author = comment.author.name,
        this.createdAt = comment.createdAt,
        this.content = comment.content,
        this.isIT = comment.author.role !== UserRole.employee
    }
}