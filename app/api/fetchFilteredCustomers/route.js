import conn from '@/app/lib/database';
import { formatCurrency } from '@/app/lib/utils';
export const dynamic = 'force-dynamic';
export async function POST(request) {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  const { query } = await request.json();
  const client = await conn.connect();
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await client.query(
      `
      SELECT
            customers.id,a
            customers.name,
            customers.email,
            customers.image_url,
            COUNT(invoices.id) AS total_invoices,
            SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
            SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
          FROM customers
          LEFT JOIN invoices ON customers.id = invoices.customer_id
          WHERE
            customers.name ILIKE $1 OR
          customers.email ILIKE $1
          GROUP BY customers.id, customers.name, customers.email, customers.image_url
          ORDER BY customers.name ASC
    `,
      [`%${query}%`],
    );
    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));
    client.end();
    // console.log('Data fetch completed after 3 seconds.');
    return new Response(JSON.stringify({ data: customers }));
  } catch (error) {
    console.error('Database Error:', error);
    client.end();
    return new Response(JSON.stringify({ message: error }), {
      status: 500,
    });
  }
}
