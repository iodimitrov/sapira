import { MigrationInterface, QueryRunner } from "typeorm";

export class FileKey1737329030559 implements MigrationInterface {
    name = 'FileKey1737329030559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "filename"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "cloudFilename"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "key" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "key"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "cloudFilename" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file" ADD "filename" text NOT NULL`);
    }

}
