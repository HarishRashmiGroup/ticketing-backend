import { Migration } from '@mikro-orm/migrations';

export class Migration20250421043844 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "comment" ("id" serial primary key, "content" text not null, "author_id" varchar(255) not null, "ticket_id" int not null, "created_at" timestamptz not null);`);

    this.addSql(`alter table "comment" add constraint "comment_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "comment" add constraint "comment_ticket_id_foreign" foreign key ("ticket_id") references "ticketing" ("id") on update cascade;`);
  }

}
