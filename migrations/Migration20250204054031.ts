import { Migration } from '@mikro-orm/migrations';

export class Migration20250204054031 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "media" ("id" serial primary key, "name" varchar(255) not null, "data" bytea not null, "mime_type" varchar(255) not null);`);

    this.addSql(`create table "user" ("id" varchar(255) not null, "name" varchar(255) not null, "passkey" varchar(255) not null, "reporting_to_id" varchar(255) null, "role" text check ("role" in ('employee', 'head', 'admin')) not null, "created_at" timestamptz not null, "updated_at" timestamptz null, constraint "user_pkey" primary key ("id"));`);

    this.addSql(`create table "ticketing" ("id" serial primary key, "type" text check ("type" in ('Incidetn', 'Service')) not null, "query" text not null, "head_approval_at" timestamptz null, "it_approval_at" timestamptz null, "re_opened_at" timestamptz null, "resolved_at" timestamptz null, "created_by_id" varchar(255) not null, "approved_by_head_id" varchar(255) null, "attachment_id" int null, "created_at" timestamptz not null, "updated_at" timestamptz null);`);
    this.addSql(`alter table "ticketing" add constraint "ticketing_attachment_id_unique" unique ("attachment_id");`);

    this.addSql(`alter table "user" add constraint "user_reporting_to_id_foreign" foreign key ("reporting_to_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "ticketing" add constraint "ticketing_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "ticketing" add constraint "ticketing_approved_by_head_id_foreign" foreign key ("approved_by_head_id") references "user" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "ticketing" add constraint "ticketing_attachment_id_foreign" foreign key ("attachment_id") references "media" ("id") on update cascade on delete set null;`);
  }

}
