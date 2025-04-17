import { Migration } from '@mikro-orm/migrations';

export class Migration20250417061733 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "ticketing" add column "feedback" text null, add column "rating" integer null;`);
  }
}
