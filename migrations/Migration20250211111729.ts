import { Migration } from '@mikro-orm/migrations';

export class Migration20250211111729 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "ticketing" add column "head_rejected_at" timestamptz null, add column "it_head_rejected_at" timestamptz null, add column "approved_by_it_head_id" varchar(255) null, add column "head_remark" text null;`);
    this.addSql(`alter table "ticketing" add constraint "ticketing_approved_by_it_head_id_foreign" foreign key ("approved_by_it_head_id") references "user" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "ticketing" drop constraint "ticketing_approved_by_it_head_id_foreign";`);
  }

}
