import { Migration } from '@mikro-orm/migrations';

export class Migration20250204054457 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" alter column "passkey" type varchar(255) using ("passkey"::varchar(255));`);
    this.addSql(`alter table "user" alter column "passkey" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" alter column "passkey" type varchar(255) using ("passkey"::varchar(255));`);
    this.addSql(`alter table "user" alter column "passkey" set not null;`);
  }

}
