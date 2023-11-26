import conn from '@/app/lib/database';
export const dynamic = 'force-dynamic';
export async function POST(request) {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  const { query, currentPage } = await request.json();
  const offset = (currentPage - 1) * process.env.ITEMS_PER_PAGE;
  const client = await conn.connect();
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const result = await client.query(
      `
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE $1 OR
        customers.email ILIKE $1 OR
        invoices.amount::text ILIKE $1 OR
        invoices.date::text ILIKE $1 OR
        invoices.status ILIKE $1
      ORDER BY invoices.date DESC
      LIMIT $2 OFFSET $3
    `,
      [`%${query}%`, process.env.ITEMS_PER_PAGE, offset],
    );
    client.end();
    // console.log('Data fetch completed after 3 seconds.');
    return new Response(JSON.stringify({ data: result.rows }));
  } catch (error) {
    console.error('Database Error:', error);
    client.end();
    return new Response(JSON.stringify({ message: error }), {
      status: 500,
    });
  }
}
