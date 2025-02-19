import { Entity, Enum, ManyToMany, ManyToOne, PrimaryKey, Property, Unique } from "@mikro-orm/core";

export enum UserRole {
    employee = 'employee',
    head = 'head',
    admin = 'admin',
    it = 'it'
};

@Entity()
export class User {
    @PrimaryKey()
    id: string;

    @Property()
    name: string;

    @Property()
    email: string;

    @Property({ nullable: true, default: null })
    contact: string | null;

    @Property({ nullable: true, default: null })
    department: string | null;

    @Property({ nullable: true })
    passkey: string;

    @Property({ nullable: true })
    password: string;

    @Property({ nullable: true })
    otp: string;

    @ManyToOne({ default: null })
    reportingTo: User | null;

    @Enum(() => UserRole)
    role: UserRole;

    @Property()
    createdAt: Date = new Date();

    @Property({ default: null, onUpdate: () => { new Date() } })
    updatedAt: Date | null = null;
    constructor({ id, email, name, contact, role, department, reportingTo, passkey }: { id: string, email: string, contact: string, department: string, name: string, role: UserRole, reportingTo: User | null, passkey: string | null }) {
        this.id = id;
        this.name = name;
        this.contact = contact;
        this.department = department;
        this.email = email;
        this.reportingTo = reportingTo;
        this.role = role;
        this.passkey = passkey;
    }
}