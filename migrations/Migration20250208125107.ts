import { Migration } from '@mikro-orm/migrations';

export class Migration20250208125107 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "ticketing" add column "approved_by_it_id" varchar(255) null, add column "it_review" text null;`);
    this.addSql(`alter table "ticketing" add constraint "ticketing_approved_by_it_id_foreign" foreign key ("approved_by_it_id") references "user" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "ticketing" drop constraint "ticketing_approved_by_it_id_foreign";`);
  }

}
