import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { PriorityEnum, TicketingType } from "../entities/ticketing.entity";
import { Transform } from "class-transformer";

export class CreateTicketDto {
    @IsString()
    query: string;

    @IsOptional()
    @IsNumber()
    attachmentId: number;

    @IsEnum(PriorityEnum)
    priority: PriorityEnum;

    @IsString()
    category: string;

    @IsString()
    subCategory: string;

    @IsString()
    item: string;

    @IsEnum(TicketingType)
    type: TicketingType
}

export class PageDto {
    @Transform(({ value }) => (Number(value)))
    @IsNumber()
    pageNumber: number;

    @Transform(({ value }) => (Number(value)))
    @IsNumber()
    pageSize: number;
}