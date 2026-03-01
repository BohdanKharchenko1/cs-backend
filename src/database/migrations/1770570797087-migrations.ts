import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1770570797087 implements MigrationInterface {
    name = 'Migrations1770570797087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referral_options" ALTER COLUMN "percentageCommission" TYPE numeric(5,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referral_options" ALTER COLUMN "percentageCommission" TYPE numeric(5,3)`);
    }

}
