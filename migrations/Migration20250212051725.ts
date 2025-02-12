import { Migration } from '@mikro-orm/migrations';

export class Migration20250212051725 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" drop constraint if exists "user_role_check";`);

    this.addSql(`alter table "user" add constraint "user_role_check" check("role" in ('employee', 'head', 'admin', 'it'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop constraint if exists "user_role_check";`);

    this.addSql(`alter table "user" add constraint "user_role_check" check("role" in ('employee', 'head', 'admin'));`);
  }

}
