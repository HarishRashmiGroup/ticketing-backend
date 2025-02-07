import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { SubCategory } from "./subcategory.entity";

@Entity()
export class Item {
    @PrimaryKey()
    id: number;

    @Property()
    name: string;

    @ManyToOne(() => SubCategory)
    subCategory: SubCategory;

    constructor({ name, subCategory }: { name: string, subCategory: SubCategory }) {
        this.name = name;
        this.subCategory = subCategory;
    }
}