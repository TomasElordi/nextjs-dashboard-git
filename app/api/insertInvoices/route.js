import conn from '@/app/lib/database';
export const dynamic = 'force-dynamic';
export async function POST(request) {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  const { customerId, amountInCents, status, date } = await request.json();
  const client = await conn.connect();
  try {
    const result = await client.query(
      `
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES ($1, $2, $3, $4)
    `,
      [customerId, amountInCents, status, date],
    );
    client.end();
    // console.log('Data fetch completed after 3 seconds.');
    console.log(result);
    return new Response(JSON.stringify({ data: result }));
  } catch (error) {
    console.error('Database Error:', error);
    client.end();
    return new Response(JSON.stringify({ message: error }), {
      status: 500,
    });
  }
}
