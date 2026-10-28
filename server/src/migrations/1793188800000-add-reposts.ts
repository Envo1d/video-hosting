import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddReposts1793188800000 implements MigrationInterface {
	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "reposts" integer NOT NULL DEFAULT 0')
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('ALTER TABLE "posts" DROP COLUMN "reposts"')
	}
}
