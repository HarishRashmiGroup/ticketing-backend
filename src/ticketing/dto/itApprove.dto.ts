import { IsEnum, IsNumber, IsString } from "class-validator";
import { TicketingType } from "../entities/ticketing.entity";


export enum ActionEnum {
    Approved = 'approved',
    Rejected = 'rejected'
}

export enum RequestTypeEnum {
    resolved = 'resolved',
    approved = 'approved',
}
export class ItApproveDto {

    @IsEnum(RequestTypeEnum)
    request: RequestTypeEnum;

    @IsString()
    query: string;

    @IsString()
    category: string;

    @IsString()
    subCategory: string;

    @IsEnum(TicketingType)
    type: TicketingType;

    @IsString()
    item: string;

    @IsString()
    remark: string;

    @IsEnum(ActionEnum)
    action: ActionEnum;
}
export class ActionDto {
    @IsEnum(ActionEnum)
    action: ActionEnum

    @IsString()
    remark: string;
}

export class HeadApproveDto {
    @IsString()
    query: string;

    @IsEnum(ActionEnum)
    action: ActionEnum;
}