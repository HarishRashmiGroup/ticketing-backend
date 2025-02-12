import { Migration } from '@mikro-orm/migrations';

export class Migration20250208094901 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "contact" varchar(255) null, add column "department" varchar(255) null;`);
  }

}
