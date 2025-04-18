import { IsDate, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
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

    @IsOptional()
    @IsString()
    userId?: string;

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

    @IsOptional()
    @IsString()
    it: string;

    @IsOptional()
    @IsString()
    ticketNo: string;

    @IsOptional()
    @IsString()
    createdBy: string;

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

export class FilteredDashboardDto {
    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    date: Date;

    @IsOptional()
    @IsString()
    it: string;
}

export class FeedbackDto {
    @IsOptional()
    @IsString()
    feedback: string;

    @Min(1)
    @Max(5)
    @IsNumber()
    rating: number;

    @IsNumber()
    ticketId: number;
}

export class EditQueryDto {
    @IsString()
    query: string;

    @IsNumber()
    ticketId: number;
}