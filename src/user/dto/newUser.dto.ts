import { IsEnum, IsNumber, IsString } from "class-validator";
import { UserRole } from "../entities/user.entity";

export class NewUserDto {
    @IsString()
    id: string;

    @IsString()
    name: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsString()
    reportingToId: string;

}