const { Pool } = require('pg');
const {
  invoices,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

const conn = new Pool({
  user: 'user-name',
  password: 'strong-password',
  host: 'localhost',
  port: 5432,
  database: 'tutorial-nextjs14',
});

async function seedUsers() {
  const client = await conn.connect();

  try {
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Crear la tabla "users" si no existe
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    console.log(`Created "users" table`);

    // Insertar datos en la tabla "users"
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.query(
          `
          INSERT INTO users (id, name, email, password)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (id) DO NOTHING;
        `,
          [user.id, user.name, user.email, hashedPassword],
        );
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function seedInvoices() {
  const client = await conn.connect();

  try {
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Crear la tabla "invoices" si no existe
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        customer_id UUID NOT NULL,
        amount INT NOT NULL,
        status VARCHAR(255) NOT NULL,
        date DATE NOT NULL
      );
    `);

    console.log(`Created "invoices" table`);

    // Insertar datos en la tabla "invoices"
    const insertedInvoices = await Promise.all(
      invoices.map(async (invoice) => {
        return client.query(
          `
          INSERT INTO invoices (customer_id, amount, status, date)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (id) DO NOTHING;
        `,
          [invoice.customer_id, invoice.amount, invoice.status, invoice.date],
        );
      }),
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function seedCustomers() {
  const client = await conn.connect();

  try {
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Crear la tabla "customers" si no existe
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `);

    console.log(`Created "customers" table`);

    // Insertar datos en la tabla "customers"
    const insertedCustomers = await Promise.all(
      customers.map(async (customer) => {
        return client.query(
          `
          INSERT INTO customers (id, name, email, image_url)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (id) DO NOTHING;
        `,
          [customer.id, customer.name, customer.email, customer.image_url],
        );
      }),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      createTable,
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function seedRevenue() {
  const client = await conn.connect();

  try {
    // Crear la tabla "revenue" si no existe
    const createTable = await client.query(`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `);

    console.log(`Created "revenue" table`);

    // Insertar datos en la tabla "revenue"
    const insertedRevenue = await Promise.all(
      revenue.map(async (rev) => {
        return client.query(
          `
          INSERT INTO revenue (month, revenue)
          VALUES ($1, $2)
          ON CONFLICT (month) DO NOTHING;
        `,
          [rev.month, rev.revenue],
        );
      }),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();
  } catch (err) {
    console.error(
      'An error occurred while attempting to seed the database:',
      err,
    );
  } finally {
    await conn.end();
  }
}

main();
