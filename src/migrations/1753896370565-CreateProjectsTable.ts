import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProjectsTable1753896370565 implements MigrationInterface {
  name = 'CreateProjectsTable1753896370565';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."projects_level_enum" AS ENUM('legendary', 'master', 'expert', 'adept', 'apprentice', 'novice')`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects" ("id" integer NOT NULL, "name" character varying(255) NOT NULL, "description" character varying(1000), "date_start" TIMESTAMP, "date_w_start" TIMESTAMP, "date_end" TIMESTAMP, "date_end_real" TIMESTAMP, "level" "public"."projects_level_enum" NOT NULL, "icon_name" character varying(50) NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TYPE "public"."projects_level_enum"`);
  }
}
