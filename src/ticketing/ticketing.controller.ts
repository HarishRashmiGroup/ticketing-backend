import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Query,
  Res,
} from "@nestjs/common";
import { TicketingService } from "./ticketing.service";
import { AddCategory, AddSubCategory, CreateTicketDto, FilteredDashboardDto, PageDto, TicketFilterDto } from "./dto/createTicket.dto";
import { User } from "src/common/decorators/user.decorator";
import { Auth } from "src/common/decorators/auth.decorator";
import { CombineAccess } from "src/common/decorators/combine-access.decorator";
import { UserRole } from "src/user/entities/user.entity";
import { HeadApproveDto, ItApproveDto, RequestTypeEnum } from "./dto/itApprove.dto";
import { TicketingType } from "./entities/ticketing.entity";
import { SubCategory } from "./entities/subcategory.entity";
import { Response } from "express";
import { ReportDto } from "./dto/report.dto";

@Controller("tickets")
export class TicketingController {
  constructor(private readonly ticketService: TicketingService) { }

  @Auth()
  @Post("create")
  async createTicket(@Body() dto: CreateTicketDto, @User() authenticatedUserId: string) {
    const userId = dto.userId || authenticatedUserId;
    return this.ticketService.createTicket({ id: userId, ...dto }, { id: authenticatedUserId });
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
  async getItTicketList(@User() id: string, @Query() dto: TicketFilterDto) {
    return this.ticketService.getItTickets(dto);
  }

  @CombineAccess([UserRole.head, UserRole.admin])
  @Get('approval')
  async getApprovalTicketList(@User() id: string, @Query() pageDto: PageDto) {
    return this.ticketService.getApprovalTickets(id, pageDto.pageNumber, pageDto.pageSize);
  }

  @CombineAccess([UserRole.admin, UserRole.it])
  @Get('dashboard')
  async getDashboard(@Query() dto: FilteredDashboardDto) {
    return this.ticketService.getDashboard(dto);
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

  @Auth()
  @Get("drop/category")
  async categoryFor(@Query('type') type: TicketingType) {
    return this.ticketService.categoryFor(type);
  }

  @CombineAccess([UserRole.admin, UserRole.it])
  @Post("add/category")
  async addCategory(@Body() dto: AddCategory) {
    return this.ticketService.addCategory(dto);
  }

  @Auth()
  @Get("drop/sub-category")
  async subCategoryFor(@Query('id') id: number) {
    return this.ticketService.subCategoryFor(id);
  }

  @CombineAccess([UserRole.admin, UserRole.it])
  @Post("add/sub-category")
  async addSubCategory(@Body() dto: AddSubCategory) {
    return this.ticketService.addSubCategory(dto);
  }

  @Auth()
  @Get("drop/item")
  async itemsFor(@Query('id') id: number) {
    return this.ticketService.itemsFor(id);
  }

  @CombineAccess([UserRole.admin, UserRole.it])
  @Post("add/item")
  async addItem(@Body() dto: AddSubCategory) {
    return this.ticketService.addItem(dto);
  }

  // @CombineAccess([UserRole.admin, UserRole.it])
  @Get("/excel/download")
  async downloadExcel(@Query() dto: ReportDto, @Res() response: Response) {
    return this.ticketService.downloadTicketsExcel(dto, response);
  }
}
