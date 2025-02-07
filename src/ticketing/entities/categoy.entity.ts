import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import { TicketingType } from "./ticketing.entity";

@Entity()
export class Category {
    @PrimaryKey()
    id: number;

    @Enum()
    type: TicketingType;

    @Property()
    name: string;

    constructor({ type, name }: { type: TicketingType, name: string }) {
        this.type = type;
        this.name = name;
    }

}