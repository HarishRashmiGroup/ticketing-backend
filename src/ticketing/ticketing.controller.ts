import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Query,
} from "@nestjs/common";
import { TicketingService } from "./ticketing.service";
import { CreateTicketDto, PageDto } from "./dto/createTicket.dto";
import { User } from "src/common/decorators/user.decorator";
import { Auth } from "src/common/decorators/auth.decorator";
import { CombineAccess } from "src/common/decorators/combine-access.decorator";
import { UserRole } from "src/user/entities/user.entity";
import { ActionDto, HeadApproveDto, ItApproveDto, RequestTypeEnum } from "./dto/itApprove.dto";

@Controller("tickets")
export class TicketingController {
  constructor(private readonly ticketService: TicketingService) { }

  @Auth()
  @Post("create")
  async createTicket(@Body() dto: CreateTicketDto, @User() id: string) {
    return this.ticketService.createTicket({ id, ...dto });
  }

  @CombineAccess([UserRole.admin, UserRole.it])
  @Post(':id')
  resolveTicket(@Param('id') id: number, @Body() dto: ItApproveDto, @User() userId: string) {
    if (dto.request === RequestTypeEnum.approved)
      return this.ticketService.apporvedByIt(dto, id, userId);
    return this.ticketService.resolvedByIt(dto, id, userId);
  }


  @Auth()
  @Get('list')
  async getTicketList(@User() id: string, @Query() pageDto: PageDto) {
    return this.ticketService.getTickets(id, pageDto.pageNumber, pageDto.pageSize);
  }

  @CombineAccess([UserRole.admin, UserRole.it])
  @Get('it')
  async getItTicketList(@User() id: string, @Query() pageDto: PageDto) {
    return this.ticketService.getItTickets(pageDto.pageNumber, pageDto.pageSize);
  }

  @CombineAccess([UserRole.head, UserRole.admin])
  @Get('approval')
  async getApprovalTicketList(@User() id: string, @Query() pageDto: PageDto) {
    return this.ticketService.getApprovalTickets(id, pageDto.pageNumber, pageDto.pageSize);
  }

  @CombineAccess([UserRole.admin])
  @Get('dashboard')
  async getDashboard() {
    return this.ticketService.getDashboard();
  }

  @Auth()
  @Get(":id")
  async getTicket(@Param("id") id: number) {
    return this.ticketService.getTicketById(id);
  }

  @Auth()
  @Post("approve-head/:id")
  async approveTicketHead(@Param("id") id: number, @Body() dto: HeadApproveDto, @User() headId: string) {
    return this.ticketService.approveTicketHead(id, dto.query, dto.action, headId);
  }
}
