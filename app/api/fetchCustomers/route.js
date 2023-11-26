import conn from '@/app/lib/database';

export const dynamic = 'force-dynamic';
export async function GET() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  const client = await conn.connect();
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await client.query(
      `
      SELECT
          id,
          name
        FROM customers
        ORDER BY name ASC
    `,
    );

    // console.log('Data fetch completed after 3 seconds.');
    const customers = data.rows;
    client.end();
    return new Response(JSON.stringify({ data: customers }));
  } catch (error) {
    console.error('Database Error:', error);
    client.end();
    return new Response(JSON.stringify({ message: error }), {
      status: 500,
    });
  }
}

export async function fetchCustomers() {
  try {
    const data =
      (await sql) <
      CustomerField >
      `
        SELECT
          id,
          name
        FROM customers
        ORDER BY name ASC
      `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}
