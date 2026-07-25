import { Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Reveal } from '@/components/common/Reveal';

export default function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" path="/404" />
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-24 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-widest2 text-stone">404</p>
          <h1 className="mt-4 font-serif text-5xl font-light">This page has wandered off.</h1>
          <p className="mt-6 text-sm text-stone">Perhaps it is out photographing a wedding.</p>
          <Link
            to="/"
            className="mt-10 inline-block border border-ink px-8 py-4 text-xs uppercase tracking-widest2 transition-colors hover:bg-ink hover:text-paper"
          >
            Back home
          </Link>
        </Reveal>
      </section>
    </>
  );
}
