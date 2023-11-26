import conn from '@/app/lib/database';
export const dynamic = 'force-dynamic';
export async function POST(request) {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  const { id } = await request.json();
  const client = await conn.connect();
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await client.query(
      `
      SELECT
      invoices.id,
      invoices.customer_id,
      invoices.amount,
      invoices.status
    FROM invoices
    WHERE invoices.id = $1;
    `,
      [id],
    );

    // console.log('Data fetch completed after 3 seconds.');
    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));
    client.end();
    return new Response(JSON.stringify({ data: invoice[0] }));
  } catch (error) {
    console.error('Database Error:', error);
    client.end();
    return new Response(JSON.stringify({ message: error }), {
      status: 500,
    });
  }
}
