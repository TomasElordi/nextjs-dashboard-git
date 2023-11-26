import conn from '@/app/lib/database';
export const dynamic = 'force-dynamic';
export async function POST(request) {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  const { email } = await request.json();
  const client = await conn.connect();
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const user = await client.query(
      `
      SELECT * FROM users WHERE email=$1
    `,
      [email],
    );
    client.end();
    return new Response(JSON.stringify({ data: user.rows[0] }));
  } catch (error) {
    console.error('Database Error:', error);
    client.end();
    return new Response(JSON.stringify({ message: error }), {
      status: 500,
    });
  }
}
