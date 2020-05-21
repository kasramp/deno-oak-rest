import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
const app = new Application();

const dummyUsers = [
	{ id: 1, firstName: "John", lastName: "Wick", age: 41 },
	{ id: 2, firstName: "Joe", lastName: "Doe", age: 35 },
	{ id: 3, firstName: "Brad", lastName: "Pitt", age: 50 }
];

const getById = (id) => {
	return dummyUsers.filter(user => user.id == id);
}

router
	.get("/", (context) => {
		context.response.body = "Welcome to Oak example with Deno!";
	})
	.get("/v1/users", (context) => {
		context.response.body = { users: dummyUsers };
	})
	.get("/v1/users/:id", (context) => {
		if (context.params && context.params.id && !isNaN(parseInt(context.params.id))) {
			const result = getById(context.params.id);
			if (result.length < 1) {
				context.response.status = 404;
				context.response.body = { error: `User ${context.params.id} not found` };
			} else {
				context.response.body = result[0];
			}
		} else {
			context.response.status = 400;
			context.response.body = { error: "Id must be number" };
		}
	})
	.delete("/v1/users/:id", (context) => {
		if (context.params && context.params.id && !isNaN(parseInt(context.params.id))) {
			dummyUsers.splice(context.params.id - 1, 1);
			context.response.status = 204;
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
				dummyUsers.push({ id: dummyUsers.length + 1, firstName: firstName, lastName: lastName, age: ageInt });
				context.response.status = 201;
				context.response.body = dummyUsers[dummyUsers.length - 1];
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
			const result = getById(context.params.id);
			if (result.length < 1) {
				context.response.status = 404;
				context.response.body = { error: `User ${context.params.id} not found` };
			} else {
				const id = context.params.id;
				const { firstName, lastName, age } = (await context.request.body()).value
				const ageInt = parseInt(age);
				if (firstName && lastName && ageInt) {
					dummyUsers.splice(id - 1, 1, { id: id, firstName: firstName, lastName: lastName, age: ageInt });
					context.response.status = 200;
					context.response.body = dummyUsers[id-1];
				} else {
					context.response.status = 400;
					context.response.body = { error: "Invalid payload's provided" };
				}
			}
		}
	});

app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8080 });