import { Entity, Enum, ManyToMany, ManyToOne, PrimaryKey, Property, Unique } from "@mikro-orm/core";

export enum UserRole {
    employee = 'employee',
    head = 'head',
    admin = 'admin'
};

@Entity()
export class User {
    @PrimaryKey()
    id: string;

    @Property()
    name: string;

    @Property()
    email: string;

    @Property({ nullable: true })
    passkey: string;

    @ManyToOne({ default: null })
    reportingTo: User | null;

    @Enum(() => UserRole)
    role: UserRole;

    @Property()
    createdAt: Date = new Date();

    @Property({ default: null, onUpdate: () => { new Date() } })
    updatedAt: Date | null = null;
    constructor({ id, name, role, reportingTo }: { id: string, name: string, role: UserRole, reportingTo: User | null }) {
        this.id = id;
        this.name = name;
        this.email = '';
        this.reportingTo = reportingTo;
        this.role = role;
    }
}