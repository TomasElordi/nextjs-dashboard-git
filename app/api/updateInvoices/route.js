import conn from '@/app/lib/database';
export const dynamic = 'force-dynamic';
export async function POST(request) {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  const { customerId, amountInCents, status, id } = await request.json();
  const client = await conn.connect();
  try {
    const result = await client.query(
      `
      UPDATE invoices
      SET customer_id = $1, amount = $2, status = $3
      WHERE id = $4
    `,
      [customerId, amountInCents, status, id],
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
