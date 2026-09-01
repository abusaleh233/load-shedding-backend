import type { Server } from "node:http";
import app from "./app";
import config from "./app/config";

let server: Server;

async function main() {
	try {
		const port = config.port || 5000;

		server = app.listen(port, () => {
			console.log(
				`🚀 Server is running on port ${port} in ${config.node_env || "development"} mode`
			);
		});
	} catch (error) {
		console.error("❌ Failed to start server:", error);
		process.exit(1);
	}
}

// Start Server Execution
main();

// Handling Unhandled Promise Rejections (e.g., Database connection loss)
process.on("unhandledRejection", (reason, promise) => {
	console.error("💥 UNHANDLED REJECTION! Shutting down...", reason);
	if (server) {
		server.close(() => {
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
});

// Handling Uncaught Exceptions (e.g., Reference errors, syntax runtime bugs)
process.on("uncaughtException", (error) => {
	console.error("💥 UNCAUGHT EXCEPTION! Shutting down...", error);
	process.exit(1);
});