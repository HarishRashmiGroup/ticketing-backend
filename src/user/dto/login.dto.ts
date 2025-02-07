import { Transform } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
    @IsEmail()
    @Transform(({ value }: { value: string }) => value.toLocaleLowerCase())
    email: string;

    @IsString()
    passkey: string;
}

export class EmailDto {
    @IsEmail()
    @Transform(({ value }: { value: string }) => value.toLocaleLowerCase())
    email: string;
}