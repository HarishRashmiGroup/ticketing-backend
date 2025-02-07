import { Migration } from '@mikro-orm/migrations';

export class Migration20250204054435 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "email" varchar(255) not null;`);
  }

}
