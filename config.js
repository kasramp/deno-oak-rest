let config = {};

config.database = {};

config.web = {};

config.database.host = Deno.env.get("DATABASE_HOST") || "localhost";
config.database.username = Deno.env.get("DATABASE_USERNAME") || "root";
config.database.password = Deno.env.get("DATABASE_PASSWORD") || "secret";
config.database.name = Deno.env.get("DATABASE_NAME") || "user_db";
config.web.port = Deno.env.get("WEB_PORT") || 8080;

export default config;