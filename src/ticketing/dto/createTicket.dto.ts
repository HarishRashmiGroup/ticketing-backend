import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
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

export enum TicketStatusEnum {
    open = "open",
    close = "close"
}

export class TicketFilterDto {
    @IsOptional()
    @IsEnum(TicketStatusEnum)
    status: TicketStatusEnum;

    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    date: Date;

    @IsOptional()
    @IsEnum(TicketingType)
    type: TicketingType;

    @Transform(({ value }) => (Number(value)))
    @IsNumber()
    pageNumber: number;

    @Transform(({ value }) => (Number(value)))
    @IsNumber()
    pageSize: number;
}

export class AddCategory {
    @IsEnum(TicketingType)
    type: TicketingType

    @IsString()
    name: string;
}

export class AddSubCategory {
    @IsNumber()
    id: number;

    @IsString()
    name: string;
}