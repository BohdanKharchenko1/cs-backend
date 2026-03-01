import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1761523014258 implements MigrationInterface {
  name = 'Migrations1761523014258';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "referral_options" ("id" SERIAL NOT NULL, "percentageCommission" numeric(5,3) NOT NULL DEFAULT '0', CONSTRAINT "PK_46656f3c74b32017a771a39cc21" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "referral_options"`);
  }
}
