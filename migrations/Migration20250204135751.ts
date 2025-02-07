import { Migration } from '@mikro-orm/migrations';

export class Migration20250204135751 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "category" ("id" serial primary key, "type" text check ("type" in ('Incident', 'Service')) not null, "name" varchar(255) not null);`);

    this.addSql(`create table "sub_category" ("id" serial primary key, "name" varchar(255) not null, "category_id" int not null);`);

    this.addSql(`create table "item" ("id" serial primary key, "name" varchar(255) not null, "sub_category_id" int not null);`);

    this.addSql(`alter table "sub_category" add constraint "sub_category_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade;`);

    this.addSql(`alter table "item" add constraint "item_sub_category_id_foreign" foreign key ("sub_category_id") references "sub_category" ("id") on update cascade;`);

    this.addSql(`alter table "ticketing" drop constraint if exists "ticketing_type_check";`);

    this.addSql(`alter table "ticketing" add column "serial_no" varchar(255) null, add column "category_id" int not null, add column "sub_category_id" int not null, add column "item_id" int not null, add column "priority" text check ("priority" in ('Low', 'Medium', 'High')) not null;`);
    this.addSql(`alter table "ticketing" add constraint "ticketing_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade;`);
    this.addSql(`alter table "ticketing" add constraint "ticketing_sub_category_id_foreign" foreign key ("sub_category_id") references "sub_category" ("id") on update cascade;`);
    this.addSql(`alter table "ticketing" add constraint "ticketing_item_id_foreign" foreign key ("item_id") references "item" ("id") on update cascade;`);
    this.addSql(`alter table "ticketing" add constraint "ticketing_type_check" check("type" in ('Incident', 'Service'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "ticketing" drop constraint if exists "ticketing_type_check";`);

    this.addSql(`alter table "ticketing" add constraint "ticketing_type_check" check("type" in ('Incidetn', 'Service'));`);
  }

}
