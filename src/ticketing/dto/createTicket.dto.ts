import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { PriorityEnum, TicketingType } from "../entities/ticketing.entity";

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