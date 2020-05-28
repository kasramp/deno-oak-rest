import { Client } from "https://deno.land/x/mysql/mod.ts";
import config from "../config.js";

const client = await new Client().connect({
    hostname: config.database.host,
    username: config.database.username,
    password: config.database.password,
    db: config.database.name,
    poolSize: 10
});

const getUsers = async () => {
    return await client.query("SELECT id, first_name AS firstName, last_name as lastName, age FROM users");
}

const getUserById = async (id) => {
    return await client.query(`SELECT id, first_name AS firstName, last_name AS lastName, age ` +
        `FROM users WHERE id = ?`, [id]);
}

const addUser = async (firstName, lastName, age) => {
    const result = await client.execute(`INSERT INTO users(first_name, last_name, age) VALUES(?, ?, ?)`, [firstName, lastName, age]);
    return getUserById(result.lastInsertId);
}

const deleteUser = async (id) => {
    return (await client.execute("DELETE FROM users WHERE id = ?", [id])).affectedRows > 0 ? true : false;
}

const updateUser = async (id, firstName, lastName, age) => {
    const result = await client.execute("UPDATE users SET first_name = ?, last_name = ?, age = ? WHERE id = ?", [firstName, lastName, age, id]);
    return getUserById(id);
}

export default {
    getUsers,
    getUserById,
    addUser,
    deleteUser,
    updateUser
};