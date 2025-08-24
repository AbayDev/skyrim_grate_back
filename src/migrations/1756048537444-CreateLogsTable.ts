import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLogsTable1756048537444 implements MigrationInterface {
  name = 'CreateLogsTable1756048537444';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."logs_type_enum" AS ENUM('error', 'info', 'warning')`,
    );
    await queryRunner.query(
      `CREATE TABLE "logs" ("id" SERIAL NOT NULL, "type" "public"."logs_type_enum" NOT NULL, "message" character varying(1000) NOT NULL, "payload" jsonb, "stack" character varying(4000), "createAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "logs"`);
    await queryRunner.query(`DROP TYPE "public"."logs_type_enum"`);
  }
}
