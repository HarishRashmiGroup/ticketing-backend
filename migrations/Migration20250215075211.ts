import { Migration } from '@mikro-orm/migrations';

export class Migration20250215075211 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "password" varchar(255) null;`);
  }

}
