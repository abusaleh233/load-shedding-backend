import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Starting Database Seeding...");

	// 1. Password Hashing
	const hashedPassword = await bcrypt.hash("123456", 10);

	// 2. Seed Substation
	const substation = await prisma.substation.upsert({
		where: { code: "SUB-DHAKA-01" },
		update: {},
		create: {
			name: "Dhanmondi Central Substation",
			code: "SUB-DHAKA-01",
			capacityMW: 120.5,
			location: "Dhanmondi, Dhaka",
			contactNo: "+8801700000000",
		},
	});

	// 3. Seed Area
	const area = await prisma.area.upsert({
		where: { code: "AREA-DHA-32" },
		update: {},
		create: {
			name: "Dhanmondi 32",
			code: "AREA-DHA-32",
			substationId: substation.id,
			status: "NORMAL",
		},
	});

	// 4. Seed Super Admin & Consumer Users
	const adminUser = await prisma.user.upsert({
		where: { email: "admin@loadshedding.com" },
		update: {},
		create: {
			name: "System Admin",
			email: "admin@loadshedding.com",
			password: hashedPassword,
			role: "SUPER_ADMIN",
			phone: "+8801800000001",
		},
	});

	const consumerUser = await prisma.user.upsert({
		where: { email: "consumer@loadshedding.com" },
		update: {},
		create: {
			name: "John Doe",
			email: "consumer@loadshedding.com",
			password: hashedPassword,
			role: "CONSUMER",
			consumerId: "CONS-100200",
			meterNumber: "MTR-889900",
			areaId: area.id,
			phone: "+8801900000002",
		},
	});

	// 5. Seed Load Shedding Schedule
	const schedule = await prisma.schedule.create({
		data: {
			title: "Routine Load Shedding - Slot A",
			areaId: area.id,
			startTime: new Date(Date.now() + 3600000), // 1 hour from now
			endTime: new Date(Date.now() + 7200000), // 2 hours from now
			date: new Date(),
			type: "ROUTINE",
			status: "PENDING",
			reason: "Supply shortage from Grid",
		},
	});

	// 6. Seed Bill
	await prisma.bill.create({
		data: {
			billNumber: "BILL-2026-0901",
			userId: consumerUser.id,
			amount: 1550.75,
			dueDate: new Date(Date.now() + 864000000), // 10 days later
			month: "September",
			year: 2026,
			status: "UNPAID",
		},
	});

	console.log("✅ Seeding finished successfully.");
}

main()
	.catch((e) => {
		console.error("❌ Seeding Error:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});