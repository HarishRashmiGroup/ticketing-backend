import { Migration } from '@mikro-orm/migrations';

export class Migration20250212072644 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "ticketing" rename column "it_approval_at" to "it_head_approval_at";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "ticketing" rename column "it_head_approval_at" to "it_approval_at";`);
  }

}
