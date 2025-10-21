import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1760789300412 implements MigrationInterface {
    name = 'Migrations1760789300412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "firstName" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastName" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "user" ADD "photoUrl" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "photoUrl"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
    }

}
