import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const responseInvoicesById = await fetch(
    `${process.env.URL}/api/fetchInvoicesById`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    },
  );
  const invoice = (await responseInvoicesById.json()).data;
  if (!invoice) {
    notFound();
  }
  const responseCustomers = await fetch(
    `${process.env.URL}/api/fetchCustomers`,
  );
  const customers = (await responseCustomers.json()).data;
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
