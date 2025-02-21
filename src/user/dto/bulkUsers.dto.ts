import { Transform, Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, Validate, ValidateNested } from "class-validator";
import { UserRole } from "../entities/user.entity";
import { Optional } from "@nestjs/common";

export class UserDto {
    @IsString()
    id: string;

    @IsString()
    name: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsOptional()
    @IsString()
    reportingTo: string;

    @IsOptional()
    @IsString()
    passkey: string;

    @Optional()
    @Transform(({ value }) => value.toLowerCase().trim())
    @IsString()
    email: string | null;

    @IsString()
    contact: string;

    @IsString()
    department: string;

}

export class BulkUsersDto {
    @ValidateNested({ each: true })
    @Type(() => UserDto)
    data: UserDto[];
}