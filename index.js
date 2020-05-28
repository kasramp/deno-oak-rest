import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import storage from "./service/storage.js";
import config from "./config.js";

const router = new Router();
const app = new Application();

router
	.get("/", (context) => {
		context.response.body = "Welcome to Oak example with Deno!";
	})
	.get("/v1/users", async (context) => {
		context.response.body = await storage.getUsers();
	})
	.get("/v1/users/:id", async (context) => {
		if (context.params && context.params.id && !isNaN(parseInt(context.params.id))) {
			const user = (await storage.getUserById(context.params.id))[0];
			if (!user) {
				context.response.status = 404;
				context.response.body = { error: `User ${context.params.id} not found` };
			} else {
				context.response.body = user;
			}
		} else {
			context.response.status = 400;
			context.response.body = { error: "Id must be number" };
		}
	})
	.delete("/v1/users/:id", async (context) => {
		if (context.params && context.params.id && !isNaN(parseInt(context.params.id))) {
			let isDeleted = await storage.deleteUser(context.params.id);
			if (isDeleted) {
				context.response.status = 204;
			} else {
				context.response.status = 404;
				context.response.body = { error: `User ${context.params.id} not found` };
			}
		} else {
			context.response.status = 400;
			context.response.body = { error: "Id must be number" };
		}
	})
	.post("/v1/users", async (context) => {
		if (!context.request.hasBody) {
			context.response.status = 400;
			context.response.body = { error: "Request body cannot be empty" };
		} else {
			const { firstName, lastName, age } = (await context.request.body(true)).value
			const ageInt = parseInt(age);
			if (firstName && lastName && ageInt) {
				let addedUser = (await storage.addUser(firstName, lastName, ageInt))[0];
				context.response.status = 201;
				context.response.body = addedUser;
			} else {
				context.response.status = 400;
				context.response.body = { error: "Invalid payload's provided" };
			}
		}
	})
	.put("/v1/users/:id", async (context) => {
		if (!context.params || !context.params.id ||
			isNaN(parseInt(context.params.id) || !context.request.hasBody)) {
			context.response.status = 400;
			context.response.body = { error: "Invalid request" };
		} else {
			const result = await storage.getUserById(context.params.id);
			if (result.length < 1) {
				context.response.status = 404;
				context.response.body = { error: `User ${context.params.id} not found` };
			} else {
				const id = context.params.id;
				const { firstName, lastName, age } = (await context.request.body()).value
				const ageInt = parseInt(age);
				if (firstName && lastName && ageInt) {
					context.response.status = 200;
					context.response.body = (await storage.updateUser(id, firstName, lastName, ageInt))[0];
				} else {
					context.response.status = 400;
					context.response.body = { error: "Invalid payload's provided" };
				}
			}
		}
	});

app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: config.web.port });