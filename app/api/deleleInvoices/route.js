import conn from '@/app/lib/database';
export const dynamic = 'force-dynamic';
export async function POST(request) {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  const { id } = await request.json();
  const client = await conn.connect();
  try {
    const result = await client.query(
      `
      DELETE FROM invoices WHERE id = $1
    `,
      [id],
    );
    client.end();
    // console.log('Data fetch completed after 3 seconds.');
    return new Response(JSON.stringify({ data: result }));
  } catch (error) {
    console.error('Database Error:', error);
    client.end();
    return new Response(JSON.stringify({ message: error }), {
      status: 500,
    });
  }
}
