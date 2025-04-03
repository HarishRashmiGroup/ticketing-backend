import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { TicketStatusEnum } from "./createTicket.dto";
import { Transform } from "class-transformer";

export class ReportDto {
    @IsOptional()
    @Transform(({ value }) => (Number(value)))
    @IsNumber()
    month: number;

    @IsOptional()
    @Transform(({ value }) => (Number(value)))
    @IsNumber()
    year: number;

    @IsOptional()
    @IsString()
    itEngineerId: string;

    @IsOptional()
    @IsEnum(TicketStatusEnum)
    status: TicketStatusEnum;

    @IsOptional()
    @Transform(({ value }) => new Date(value))
    startDate: Date;

    @IsOptional()
    @Transform(({ value }) => new Date(value).setHours(23, 59, 59, 999))
    endDate: Date;

    @IsOptional()
    @IsString()
    department: string;

}