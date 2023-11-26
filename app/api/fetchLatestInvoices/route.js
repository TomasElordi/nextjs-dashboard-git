import conn from '@/app/lib/database';
import { formatCurrency } from '@/app/lib/utils';
export const dynamic = 'force-dynamic';
export async function GET() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    const client = await conn.connect();
    const data =
      await client.query(`SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    ORDER BY invoices.date DESC
    LIMIT 5`);

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    client.end();
    // console.log('Data fetch completed after 3 seconds.');
    return new Response(JSON.stringify({ data: latestInvoices }));
  } catch (error) {
    console.error('Database Error:', error);
    client.end();
    return new Response(JSON.stringify({ message: error }), {
      status: 500,
    });
  }
}
