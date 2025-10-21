import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1760798400935 implements MigrationInterface {
    name = 'Migrations1760798400935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "telegramId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "telegramId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_6758e6c1db84e6f7e711f8021f5" UNIQUE ("telegramId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_6758e6c1db84e6f7e711f8021f5"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "telegramId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "telegramId" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
    }

}
