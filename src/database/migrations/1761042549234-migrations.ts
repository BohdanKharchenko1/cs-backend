import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1761042549234 implements MigrationInterface {
    name = 'Migrations1761042549234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "wallet" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "balance" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "balance"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "wallet"`);
    }

}
