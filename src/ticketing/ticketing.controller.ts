import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
} from "@nestjs/common";
import { TicketingService } from "./ticketing.service";
import { CreateTicketDto } from "./dto/createTicket.dto";
import { User } from "src/common/decorators/user.decorator";
import { Auth } from "src/common/decorators/auth.decorator";

@Controller("tickets")
export class TicketingController {
  constructor(private readonly ticketService: TicketingService) { }

  @Auth()
  @Post("create")
  async createTicket(@Body() dto: CreateTicketDto, @User() id: string) {
    return this.ticketService.createTicket({ id, ...dto });
  }

  // @Get(":id")
  // async getTicket(@Param("id") id: number) {
  //   return this.ticketService.getTicketById(id);
  // }

  @Auth()
  @Get('list')
  async getTicketList(@User() id: string) {
    return this.ticketService.getTickets(id);
  }

  @Auth()
  @Patch(":id/approve-head")
  async approveTicketHead(@Param("id") id: number, @Body() body: { headId: number }) {
    return this.ticketService.approveTicketHead(id, body.headId);
  }
}
