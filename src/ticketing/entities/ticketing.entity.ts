import { Collection, Entity, Enum, ManyToOne, OneToMany, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Media } from "../../media/entities/media.entity";
import { User } from "../../user/entities/user.entity";
import { Category } from "./categoy.entity";
import { SubCategory } from "./subcategory.entity";
import { Item } from "./item.entity";
import { Max, Min } from "class-validator";
import { Comment } from "./comment.entity";

export enum TicketingType {
    Incident = 'Incident',
    Service = 'Service'
}

export enum PriorityEnum {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}

@Entity()
export class Ticketing {
    @PrimaryKey()
    id: number;

    @Property({ default: null, nullable: true })
    serialNo: string | null = null;

    @Enum(() => TicketingType)
    type: TicketingType;

    @Property({ columnType: 'text' })
    query: string;

    @Property({ default: null })
    headApprovalAt: Date | null = null;

    @Property({ default: null })
    itHeadApprovalAt: Date | null = null;

    @Property({ default: null })
    headRejectedAt: Date | null = null;

    @Property({ default: null })
    itHeadRejectedAt: Date | null = null;

    @Property({ default: null })
    reOpenedAt: Date | null = null;

    @Property({ default: null, nullable: true })
    resolvedAt: Date | null;

    @ManyToOne(() => Category)
    category: Category;

    @ManyToOne(() => SubCategory)
    subCategory: SubCategory;

    @ManyToOne(() => Item)
    item: Item;

    @Enum(() => PriorityEnum)
    priority: PriorityEnum;

    @ManyToOne(() => User)
    createdBy: User;

    @ManyToOne(() => User)
    approvedByHead: User | null = null;

    @ManyToOne(() => User)
    approvedByIt: User | null = null;

    @ManyToOne(() => User)
    approvedByItHead: User | null = null;

    @Property({ columnType: 'text', nullable: true, default: null })
    itReview: string | null;

    @Property({ columnType: 'text', nullable: true, default: null })
    headRemark: string | null;

    @Property({ columnType: 'text', nullable: true, default: null })
    feedback: string | null;

    @Max(5)
    @Min(1)
    @Property({ columnType: 'integer', nullable: true, default: null })
    rating: number | null = null;

    @OneToOne({ entity: () => Media, nullable: true })
    attachment: Media;

    @OneToMany({ entity: () => Comment, mappedBy: 'ticket' })
    comments = new Collection<Comment>(this);

    @Property()
    createdAt: Date = new Date();

    @Property({ default: null, onUpdate: () => new Date })
    updatedAt: Date | null;

    constructor({ query, category, type, subCategory, item, createdBy, priority, attachment }: { query: string, type: TicketingType, category: Category, subCategory: SubCategory, item: Item, createdBy: User, priority: PriorityEnum, attachment: Media | null }) {
        this.query = query;
        this.category = category;
        this.type = type;
        this.subCategory = subCategory;
        this.item = item;
        this.createdBy = createdBy;
        this.priority = priority;
        this.attachment = attachment;
    }
}