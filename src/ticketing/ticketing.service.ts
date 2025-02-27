import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository, FilterQuery } from "@mikro-orm/core";
import { User, UserRole } from "src/user/entities/user.entity";
import { Media } from "src/media/entities/media.entity";
import { EntityManager } from "@mikro-orm/postgresql";
import { PriorityEnum, Ticketing, TicketingType } from "./entities/ticketing.entity";
import { Category } from "./entities/categoy.entity";
import { SubCategory } from "./entities/subcategory.entity";
import { Item } from "./entities/item.entity";
import { wrap } from "@mikro-orm/core";
import { ActionEnum, ItApproveDto } from "./dto/itApprove.dto";
import { AddCategory, AddSubCategory, TicketFilterDto, TicketStatusEnum } from "./dto/createTicket.dto";


@Injectable()
export class TicketingService {
  constructor(
    @InjectRepository(Ticketing) private readonly ticketRepo: EntityRepository<Ticketing>,
    @InjectRepository(User) private readonly userRepo: EntityRepository<User>,
    @InjectRepository(Media) private readonly mediaRepo: EntityRepository<Media>,
    private readonly em: EntityManager
  ) { }

  async assignSequenceToTicket(ticket: Ticketing) {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const count = await this.ticketRepo.count({
      id: { $lt: ticket.id }, createdAt: {
        $gte: firstDay,
        $lte: lastDay
      },
      type: ticket.type
    });
    const month = ('0' + String(new Date().getMonth() + 1)).slice(-2)
    const year = ('0' + String(new Date().getFullYear())).slice(-2);
    const sequnce = String(Number(count)).padStart(4, '0');
    const prefix = ticket.type == TicketingType.Incident ? "INC" : "SRQ";
    const sequenceId = `${prefix}${month}${year}${sequnce}`;
    wrap(ticket).assign({ serialNo: sequenceId });
    await this.em.flush();
  }

  async createTicket({ id, query, type, category, subCategory, item, priority, attachmentId }: { id: string, query: string, category: string, subCategory: string, item: string, type: TicketingType, priority: PriorityEnum, attachmentId?: number }) {
    const [user, ticketCategory, ticketSubCategory, ticketItem, attachment] = await Promise.all([
      this.userRepo.findOneOrFail({ id }),
      this.em.findOneOrFail(Category, { name: category, type }),
      this.em.findOneOrFail(SubCategory, { name: subCategory, category: { name: category } }, { populate: ['category'] }),
      this.em.findOneOrFail(Item, { name: item, subCategory: { name: subCategory } }, { populate: ['subCategory'] }),
      isNaN(attachmentId) ? null : this.em.findOneOrFail(Media, { id: attachmentId })
    ]);

    const ticket = new Ticketing({ query, type, priority, category: ticketCategory, subCategory: ticketSubCategory, item: ticketItem, createdBy: user, attachment });
    await this.em.persistAndFlush(ticket);
    await this.assignSequenceToTicket(ticket);
    return ({
      message: 'Ticket Created successfully!',
      ticketNo: ticket.serialNo,
      status: 201 as const,
    })
  }

  async getTicketById(id: number) {
    if (isNaN(Number(id))) {
      throw new BadRequestException("Id should be a number.");
    }
    const ticket = await this.ticketRepo.findOneOrFail({ id }, { populate: ["createdBy", "attachment", "category", "subCategory", "item", "approvedByHead"] });
    const data = {
      id: ticket.id,
      sequenceNo: ticket.serialNo,
      query: ticket.query,
      createdAt: new Date(ticket.createdAt),
      createdBy: ticket.createdBy.name,
      email: ticket.createdBy.email,
      type: ticket.type,
      category: ticket.category.name,
      subCategory: ticket.subCategory.name,
      item: ticket.item.name,
      priority: ticket.priority,
      attachmentId: ticket.attachment?.id,
      attachementName: ticket.attachment?.name,
      approvedByItHeadAt: ticket.itHeadApprovalAt,
      rejectedByHeadAt: ticket.headRejectedAt,
      approvedByHeadAt: ticket.headApprovalAt,
      resolvedAt: ticket.resolvedAt,
      itHeadRemark: ticket.headRemark ?? "",
      remark: ticket.itReview,
    };
    return data;
  }

  async getTickets(id: string, pageNumber: number, pageSize: number) {
    const user = await this.userRepo.findOneOrFail(id);
    const options: FilterQuery<Ticketing> = {};
    options.createdBy = user;
    const result = await this.ticketRepo.findAndCount(options, { populate: ['createdBy'], orderBy: { resolvedAt: 'desc nulls first', createdAt: 'DESC' }, limit: pageSize, offset: (pageNumber - 1) * pageSize });
    const lists = result[0].map((ticket) => ({
      id: ticket.id,
      sequenceNo: ticket.serialNo,
      query: ticket.query,
      createdAt: new Date(ticket.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      createdBy: ticket.createdBy.name,
      type: ticket.type,
      reOpenedAt: ticket.reOpenedAt,
      resolvedAt: ticket.resolvedAt,
      remark: ticket.itReview,
    }))
    return ({
      lists,
      currentPage: pageNumber,
      totalPage: Math.ceil(result[1] / pageSize)
    })
  }

  async getApprovalTickets(id: string, pageNumber: number, pageSize: number) {
    const user = await this.userRepo.findOneOrFail(id);
    const options: FilterQuery<Ticketing> = {};
    options.createdBy = { reportingTo: user };
    options.type = TicketingType.Service;
    const result = await this.ticketRepo.findAndCount(options, { populate: ['createdBy'], orderBy: { headApprovalAt: 'DESC NULLS FIRST', headRejectedAt: 'DESC NULLS FIRST', createdAt: 'DESC' }, limit: pageSize, offset: (pageNumber - 1) * pageSize });
    const lists = result[0].map((ticket) => ({
      id: ticket.id,
      sequenceNo: ticket.serialNo,
      query: ticket.query,
      createdAt: new Date(ticket.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      createdBy: ticket.createdBy.name,
      createdById: ticket.createdBy.id,
      headRejectedAt: ticket.headRejectedAt,
      headApprovedAt: ticket.headApprovalAt,
      resolvedAt: ticket.resolvedAt,
      type: ticket.type,
    }))
    return ({
      lists,
      currentPage: pageNumber,
      totalPage: Math.ceil(result[1] / pageSize)
    })
  }

  async getItTickets(dto: TicketFilterDto) {
    const pageSize = dto.pageSize;
    const pageNumber = dto.pageNumber;
    const options: FilterQuery<Ticketing> = {}
    if (dto.date) {
      const startOfDay = new Date(dto.date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(dto.date);
      endOfDay.setHours(23, 59, 59, 999);

      options.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }
    if (dto.type) {
      options.type = dto.type;
    }
    if (dto.status) {
      options.approvedByIt = dto.status === TicketStatusEnum.open ? { $eq: null } : { $ne: null };
    }
    const result = await this.ticketRepo.findAndCount(
      options, {
      populate: ['createdBy', 'approvedByIt'],
      orderBy: { resolvedAt: 'DESC NULLS FIRST', createdAt: 'DESC' },
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize
    });
    const lists = result[0].map((ticket) => ({
      id: ticket.id,
      sequenceNo: ticket.serialNo,
      query: ticket.query,
      createdAt: new Date(ticket.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      createdBy: ticket.createdBy.name,
      createdById: ticket.createdBy.id,
      itHeadApprovedAt: ticket.itHeadApprovalAt,
      itHeadRejectedAt: ticket.itHeadRejectedAt,
      headRejectedAt: ticket.headRejectedAt,
      headApprovedAt: ticket.headApprovalAt,
      type: ticket.type,
      reOpenedAt: ticket.reOpenedAt,
      itHeadRemark: ticket.headRemark,
      remark: ticket.itReview,
      resolvedBy: ticket.approvedByIt?.name,
      resolvedAt: ticket.resolvedAt,
    }));
    return ({
      lists,
      currentPage: pageNumber,
      totalPage: Math.ceil(result[1] / pageSize)
    })
  }

  async approveTicketHead(ticketId: number, query: string, action: ActionEnum, headId: string) {
    const [ticket, user] = await Promise.all([
      this.ticketRepo.findOneOrFail({ id: ticketId, type: TicketingType.Service, createdBy: { reportingTo: headId } }, { populate: ['createdBy'] }),
      this.userRepo.findOneOrFail({ id: headId })
    ]);

    if (ticket.createdBy.reportingTo.id != user.id) {
      throw new BadRequestException('Not a valid request.');
    }
    // if (ticket.headApprovalAt || ticket.headRejectedAt) {
    //   throw new BadRequestException("Bad request.")
    // }
    if (action === ActionEnum.Approved)
      wrap(ticket).assign({ query, approvedByHead: this.em.getReference(User, headId), headRejectedAt: null, headApprovalAt: new Date() });
    else
      wrap(ticket).assign({ headRejectedAt: new Date(), headApprovalAt: null })
    await this.em.flush();
    return ({
      message: action,
      status: 200 as const
    });
  }

  async apporvedByIt(dto: ItApproveDto, id: number, userId: string) {
    const [ticket, category, subCategory, item, user] = await Promise.all([
      this.ticketRepo.findOneOrFail({ id }),
      this.em.findOneOrFail(Category, { name: dto.category, type: dto.type }),
      this.em.findOneOrFail(SubCategory, { name: dto.subCategory, category: { name: dto.category } }, { populate: ['category'] }),
      this.em.findOneOrFail(Item, { name: dto.item, subCategory: { name: dto.subCategory } }, { populate: ['subCategory'] }),
      this.em.findOneOrFail(User, { id: userId })
    ]);
    if (user.role != UserRole.admin) throw new ForbiddenException('');
    if (dto.action === ActionEnum.Approved)
      wrap(ticket).assign({ category, subCategory, item, query: dto.query, itHeadApprovalAt: new Date(), itHeadRejectedAt: null, headRemark: dto.remark });
    else
      wrap(ticket).assign({ category, subCategory, item, query: dto.query, itHeadApprovalAt: null, itHeadRejectedAt: new Date() })
    await this.em.flush()
    return ({
      message: "Approved",
      status: 200 as const
    })
  }

  async resolvedByIt(dto: ItApproveDto, id: number, userId: string) {
    const [ticket, category, subCategory, item] = await Promise.all([
      this.ticketRepo.findOneOrFail({ id }),
      this.em.findOneOrFail(Category, { name: dto.category, type: dto.type }),
      this.em.findOneOrFail(SubCategory, { name: dto.subCategory, category: { name: dto.category } }, { populate: ['category'] }),
      this.em.findOneOrFail(Item, { name: dto.item, subCategory: { name: dto.subCategory } }, { populate: ['subCategory'] }),
    ]);
    if (ticket.approvedByIt) {
      throw new BadRequestException("Ticket already Resolved.")
    }
    wrap(ticket).assign({ category, subCategory, item, query: dto.query, resolvedAt: new Date(), approvedByIt: this.em.getReference(User, userId), itReview: dto.remark });
    await this.em.flush()
    return ({
      message: "Approved",
      status: 200 as const
    })
  }

  async getDashboard() {
    const now = new Date();
    const monthstart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthend = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const [openIncident, closeIncident, openService, closeService] = await Promise.all([
      this.ticketRepo.count({
        type: TicketingType.Incident,
        resolvedAt: { $eq: null },
        $and: [
          { createdAt: { $lte: monthend } },
          { createdAt: { $gt: monthstart } }
        ]
      }),
      this.ticketRepo.count({
        type: TicketingType.Incident,
        resolvedAt: { $ne: null },
        $and: [
          { createdAt: { $lte: monthend } },
          { createdAt: { $gt: monthstart } }
        ]
      }),
      this.ticketRepo.count({
        type: TicketingType.Service,
        resolvedAt: { $eq: null },
        $and: [
          { createdAt: { $lte: monthend } },
          { createdAt: { $gt: monthstart } }
        ]
      }),
      this.ticketRepo.count({
        type: TicketingType.Service,
        resolvedAt: { $ne: null },
        $and: [
          { createdAt: { $lte: monthend } },
          { createdAt: { $gt: monthstart } }
        ]
      })
    ]);
    return ({
      openIncident: openIncident,
      closeService: closeService,
      openService: openService,
      closeIncident: closeIncident
    })
  }

  async categoryFor(type: TicketingType) {
    const categories = await this.em.find(Category, { type: type }, { orderBy: { name: 'ASC' } });
    return categories.map((c) => ({
      id: c.id,
      label: c.name,
    }));
  }

  async addCategory(dto: AddCategory) {
    const exist = await this.em.findOne(Category, { type: dto.type, name: dto.name });
    if (exist) throw new BadRequestException('Category already exist.');
    const category = new Category({ type: dto.type, name: dto.name });
    await this.em.persistAndFlush(category);
    return ({
      id: category.id,
      label: category.name
    })
  }

  async subCategoryFor(id: number) {
    const subCategories = await this.em.find(SubCategory, { category: id }, { orderBy: { name: 'ASC' } });
    return subCategories.map((c) => ({
      id: c.id,
      label: c.name,
    }));
  }

  async addSubCategory(dto: AddSubCategory) {
    const exist = await this.em.findOne(SubCategory, { category: dto.id, name: dto.name });
    if (exist) throw new BadRequestException("SubCategory already exist.");
    const subCategory = new SubCategory({ category: this.em.getReference(Category, dto.id), name: dto.name });
    await this.em.persistAndFlush(subCategory);
    return ({
      id: subCategory.id,
      label: subCategory.name
    })
  }

  async itemsFor(id: number) {
    const items = await this.em.find(Item, { subCategory: id }, { orderBy: { name: 'ASC' } });
    return items.map((c) => ({
      id: c.id,
      label: c.name,
    }));
  }

  async addItem(dto: AddSubCategory) {
    const exist = await this.em.findOne(Item, { subCategory: { id: dto.id }, name: dto.name });
    if (exist) throw new BadRequestException("Item already exist.");
    const item = new Item({ subCategory: this.em.getReference(SubCategory, dto.id), name: dto.name });
    await this.em.persistAndFlush(item);
    return ({
      id: item.id,
      label: item.name
    })
  }
}
