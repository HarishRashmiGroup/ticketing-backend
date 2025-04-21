import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Ticketing } from "./ticketing.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Comment {
    @PrimaryKey()
    id: number;

    @Property({ columnType: 'text' })
    content: string;

    @ManyToOne({ entity: () => User })
    author: User;

    @ManyToOne({ entity: () => Ticketing })
    ticket: Ticketing;

    @Property()
    createdAt: Date = new Date();

    constructor({ content, author, ticket }: { content: string, author: User, ticket: Ticketing }) {
        this.content = content;
        this.author = author;
        this.ticket = ticket;
    }
}