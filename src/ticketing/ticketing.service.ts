import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository, FilterQuery } from "@mikro-orm/core";
import { User, UserRole } from "src/user/entities/user.entity";
import { Media } from "src/media/entities/media.entity";
import { EntityManager } from "@mikro-orm/postgresql";
import { PriorityEnum, Ticketing, TicketingType } from "./entities/ticketing.entity";
import { Category } from "./entities/categoy.entity";
import { SubCategory } from "./entities/subcategory.entity";
import { Item } from "./entities/item.entity";
import { wrap } from "module";

@Injectable()
export class TicketingService {
  constructor(
    @InjectRepository(Ticketing) private readonly ticketRepo: EntityRepository<Ticketing>,
    @InjectRepository(User) private readonly userRepo: EntityRepository<User>,
    @InjectRepository(Media) private readonly mediaRepo: EntityRepository<Media>,
    private readonly em: EntityManager
  ) { }

  async assignSequenceToTicket(ticket: Ticketing) {
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const lastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    const count = await this.ticketRepo.count({
      id: { $lte: ticket.id }, createdAt: {
        $gte: firstDay,
        $lte: lastDay
      }
    });
    const month = ('0' + String(new Date().getMonth() + 1)).slice(-2)
    const year = ('0' + String(new Date().getFullYear())).slice(-2);
    const sequnce = String(Number(count) + 1).padStart(4, '0');;
    const sequenceId = `RML${year}${month}${sequnce}`;
    wrap(ticket.serialNo = sequenceId);
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
    this.assignSequenceToTicket(ticket);
    return ({
      message: 'Ticket Created successfully!',
      status: 201 as const,
    })
  }

  async getTicketById(id: number) {
    return this.ticketRepo.findOne({ id }, { populate: ["createdBy", "approvedByHead", "attachment"] });
  }

  async getTickets(id: string) {
    const user = await this.userRepo.findOneOrFail(id);
    console.log(user)
    const options: FilterQuery<Ticketing> = {};
    if (user.role === UserRole.employee) {
      options.createdBy = user;
    } else if (user.role === UserRole.head) {
      options.createdBy = { reportingTo: user }
    } else {
      options.id = { $ne: 0 }
    }
    const tickets = await this.ticketRepo.find(options, { populate: ['createdBy'], orderBy: { itApprovalAt: 'ASC', createdAt: 'ASC' } });
    const lists = tickets.map((ticket) => ({
      serialNo: ticket.serialNo,
      query: ticket.query,
      createdBy: ticket.createdBy.name,
      itApprovedAt: ticket.itApprovalAt,
      headApprovedAt: ticket.headApprovalAt,
      type: ticket.type,
      reOpenedAt: ticket.reOpenedAt,
    }))
    return ({
      lists,
      currentPage: 1,
      totalPage: 1
    })
  }

  async approveTicketHead(ticketId: number, headId: number) {

  }
}
