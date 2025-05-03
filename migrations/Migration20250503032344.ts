import { Migration } from '@mikro-orm/migrations';

export class Migration20250503032344 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "comment" add column "user_read" boolean not null default false;`);
  }

}
