import app from "./app.js";
import config from "./app/config/index.js";
import {prisma} from "./app/lib/prisma.js";
// import {redisClient} from "./app/lib/redis.js";
import { seedDatabase } from "../prisma/seed.js"; // সিড ফাংশন ইমপোর্ট করা হলো

const PORT = config.port || 5000;

const main = async () => {
	try {
		await prisma.$connect();
		console.log("Connected to the database successfully.");

		// if (!redisClient.isOpen) {
		// 	await redisClient.connect();
		// 	console.log("Redis Connected Successfully.");
		// }

		// Run Database Seeding during startup
		await seedDatabase();

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Error starting the server:", error);
		await prisma.$disconnect();
		process.exit(1);
	}
};

main();