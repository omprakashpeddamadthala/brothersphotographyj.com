import type { ContactFormValues } from '@/types';

/**
 * Placeholder enquiry service. The original site relies on a proprietary
 * form backend; swap this out for your provider (Formspree, Basin, a
 * serverless function, etc.) by POSTing `values` to your endpoint.
 */
export async function submitEnquiry(values: ContactFormValues): Promise<{ ok: true }> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  if (import.meta.env.DEV) {
    console.info('Enquiry submitted (dev placeholder):', values);
  }
  return { ok: true };
}
