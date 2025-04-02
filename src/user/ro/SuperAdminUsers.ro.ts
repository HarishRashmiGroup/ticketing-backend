import { User } from "../entities/user.entity";

export class SuperAdminUsersRO {
    name: string;
    email: string;
    contact: string;
    department: string;
    id: string;
    manager: string;
    constructor(user: User) {
        this.name = user.name;
        this.id = user.id;
        this.contact = user.contact;
        this.department = user.department;
        this.manager = user.reportingTo?.name || "";
        this.email = user.email || "";
    }
}