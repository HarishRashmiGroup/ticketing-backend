import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Comment } from "./entities/comment.entity";
import { commentMailTemplate } from "../email/email.template";
import { EmailService } from "../email/email.service";
import { Ticketing } from "../ticketing/entities/ticketing.entity";
import { User, UserRole } from "../user/entities/user.entity";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: EntityRepository<User>,

        @InjectRepository(Ticketing)
        private readonly ticketingRepository: EntityRepository<Ticketing>,

        @InjectRepository(Comment)
        private readonly commentRepository: EntityRepository<Comment>,

        private readonly emailService: EmailService,
        private readonly em: EntityManager,
    ) { }
    async createTask(userId: string, description: string, taskId: number) {
        const [user, ticket] = await Promise.all([this.userRepository.findOneOrFail({ id: userId }),
        this.ticketingRepository.findOneOrFail({ id: taskId }, { populate: ['createdBy'] })]);
        const comment = new Comment({ description, createdBy: user, ticket });
        const didOwnerCommented = userId === ticket.createdBy.id;
        await this.em.persistAndFlush(comment);
        const to = ticket.createdBy.email;
        const cc = user.email;
        const emailHtml = commentMailTemplate(description, user.name, ticket.query);
        if (user.role === UserRole.admin) {
            this.emailService.sendEmailWithCC(
                to,
                cc,
                `New comment on: ${ticket.query.substring(0, 30)}...`,
                emailHtml
            );
        }
        return { messsage: 'Comment added.', status: 201 };
    }
    async getComments(ticketId: number) {
        const [ticket, comments] = await Promise.all([
            this.ticketingRepository.findOneOrFail({ id: ticketId }),
            this.commentRepository.find({ ticket: ticketId }, { fields: ['createdBy.name', 'description', 'createdAt'], orderBy: { createdAt: 'ASC' } })]);
        //Todo: logic for handling not assigned user.
        return comments.map((comment) => ({
            description: comment.description,
            createdBy: comment.createdBy.name,
            date: comment.createdAt,
        }));
    }
}