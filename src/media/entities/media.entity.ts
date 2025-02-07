import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Media {
    @PrimaryKey()
    id!: number;

    @Property()
    name!: string;

    @Property({ type: "bytea" })
    data!: Buffer;

    @Property()
    mimeType!: string;

    constructor({ name, data, mimeType }: { name: string, data: Buffer, mimeType: string }) {
        this.name = name;
        this.data = data;
        this.mimeType = mimeType;
    }
}
