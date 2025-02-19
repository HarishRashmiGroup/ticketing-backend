import { Migration } from '@mikro-orm/migrations';

export class Migration20250219055146 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "otp" varchar(255) null;`);
  }

}
