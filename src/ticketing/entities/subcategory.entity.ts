import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Category } from "./categoy.entity";

@Entity()
export class SubCategory {
    @PrimaryKey()
    id: number;

    @Property()
    name: string;

    @ManyToOne(() => Category)
    category: Category;

    constructor({ name, category }: { name: string, category: Category }) {
        this.name = name;
        this.category = category;
    }
}