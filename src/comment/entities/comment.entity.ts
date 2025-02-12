import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Ticketing } from "../../ticketing/entities/ticketing.entity";
import { User } from "../../user/entities/user.entity";


@Entity()
export class Comment {
    @PrimaryKey()
    id: number;

    @Property({ type: 'text' })
    description: string;

    @ManyToOne({ entity: () => User })
    createdBy: User;

    @ManyToOne({ entity: () => Ticketing, cascade: [Cascade.REMOVE] })
    ticket: Ticketing;

    @Property({ onCreate: () => new Date() })
    createdAt = new Date();

    constructor({ description, createdBy, ticket }: { createdBy: User, description: string, ticket: Ticketing }) {
        this.createdBy = createdBy;
        this.ticket = ticket;
        this.description = description;
    }
}
