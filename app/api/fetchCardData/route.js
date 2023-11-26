import conn from '@/app/lib/database';
import { formatCurrency } from '@/app/lib/utils';

//Force dynamic cache
export const dynamic = 'force-dynamic';
export async function GET() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  const client = await conn.connect();
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');

    const invoiceCount = await client.query(`SELECT COUNT(*) FROM invoices`);
    const customerCount = await client.query(`SELECT COUNT(*) FROM customers`);
    const invoiceStatus = await client.query(`
          SELECT
          SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
          FROM invoices
      `);
    const numberOfInvoices = Number(invoiceCount.rows[0].count ?? '0');
    const numberOfCustomers = Number(customerCount.rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(invoiceStatus.rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(
      invoiceStatus.rows[0].pending ?? '0',
    );
    client.end();
    // console.log('Data fetch completed after 3 seconds.');
    return new Response(
      JSON.stringify({
        numberOfCustomers: numberOfCustomers,
        numberOfInvoices: numberOfInvoices,
        totalPaidInvoices: totalPaidInvoices,
        totalPendingInvoices: totalPendingInvoices,
      }),
    );
  } catch (error) {
    console.error('Database Error:', error);
    client.end();
    return new Response(JSON.stringify({ message: error }), {
      status: 500,
    });
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
           SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
           SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
           FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}
