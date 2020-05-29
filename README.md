# deno-oak-rest
The goal of the project is to buld REST APIs with Deno and Oak library.

For the tutorials check the below links,
- [Build REST APIs with Deno and Oak](https://www.geekyhacker.com/2020/05/21/build-rest-apis-with-deno-and-oak/)
- [Using MySQL with Deno](https://www.geekyhacker.com/2020/05/29/using-mysql-with-deno/)

## How to run

First of all make sure you have Deno installed.

Then start MySQL docker and run the `db_initializer.sh` script to create the `users` table,

```bash
$ cd docker && docker-compose up -d && ./db_initializer.sh
```

And finally run the following command,

```bash
$ deno run --allow-env --allow-read --allow-net index.js
```

Now, open the browser and hit `localhost:8080`.

## Endpoints

- `GET /` - displays welcome page
- `GET /v1/users` - returns a list of users
- `GET /v1/users/:id` - gets a user by id
- `POST /v1/users` - creates a new user
- `PUT /v1/users/:id` - update an existing user
- `DELETE /v1/users/:id` - deletes a user by id
