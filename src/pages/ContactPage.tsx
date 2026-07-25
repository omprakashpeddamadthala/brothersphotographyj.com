import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { SEO } from '@/components/common/SEO';
import { AnimatedHeading } from '@/components/common/AnimatedHeading';
import { Reveal } from '@/components/common/Reveal';
import { Button } from '@/components/ui/Button';
import { submitEnquiry } from '@/services/enquiries';
import { siteConfig } from '@/data/site';
import type { ContactFormValues } from '@/types';

const inputClass =
  'w-full border-b border-ink/20 bg-transparent py-3 text-sm outline-none transition-colors focus:border-gold';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>();

  const mutation = useMutation({
    mutationFn: submitEnquiry,
    onSuccess: () => {
      setSubmitted(true);
      reset();
    },
  });

  return (
    <>
      <SEO
        title="Book Us"
        description="Tell us about your wedding — dates, places and plans. We would love to hear your story."
        path="/contact"
      />
      <section className="mx-auto max-w-3xl px-6 pb-24 pt-36">
        <AnimatedHeading as="h1" eyebrow="Book us now :)">
          Tell us your story
        </AnimatedHeading>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-loose text-stone">
            We take on a limited number of weddings each season. Share your dates and plans below, or
            write to us directly at{' '}
            <a
              href={`mailto:${siteConfig.email}`}
              className="underline underline-offset-4 hover:text-gold"
            >
              {siteConfig.email}
            </a>
            .
          </p>
        </Reveal>

        {submitted ? (
          <Reveal className="mt-16 text-center">
            <p className="font-serif text-3xl">Thank you!</p>
            <p className="mt-4 text-sm text-stone">
              Your enquiry is on its way to us. We usually reply within two working days.
            </p>
            <Button variant="outline" className="mt-8" onClick={() => setSubmitted(false)}>
              Send another enquiry
            </Button>
          </Reveal>
        ) : (
          <Reveal delay={0.15}>
            <form
              className="mt-16 grid gap-8 sm:grid-cols-2"
              onSubmit={handleSubmit((values) => mutation.mutate(values))}
              noValidate
            >
              <div>
                <label htmlFor="name" className="text-xs uppercase tracking-widest2 text-stone">
                  Your names *
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className={inputClass}
                  aria-invalid={!!errors.name}
                  {...register('name', { required: 'Please tell us your names.' })}
                />
                {errors.name && (
                  <p role="alert" className="mt-2 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="text-xs uppercase tracking-widest2 text-stone">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  aria-invalid={!!errors.email}
                  {...register('email', {
                    required: 'Please share an email address.',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'That email looks incomplete.',
                    },
                  })}
                />
                {errors.email && (
                  <p role="alert" className="mt-2 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="text-xs uppercase tracking-widest2 text-stone">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  className={inputClass}
                  {...register('phone')}
                />
              </div>
              <div>
                <label htmlFor="eventDate" className="text-xs uppercase tracking-widest2 text-stone">
                  Wedding date *
                </label>
                <input
                  id="eventDate"
                  type="date"
                  className={inputClass}
                  aria-invalid={!!errors.eventDate}
                  {...register('eventDate', {
                    required: 'A date (even tentative) helps us check availability.',
                  })}
                />
                {errors.eventDate && (
                  <p role="alert" className="mt-2 text-xs text-red-600">
                    {errors.eventDate.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="location" className="text-xs uppercase tracking-widest2 text-stone">
                  Venue / city
                </label>
                <input id="location" type="text" className={inputClass} {...register('location')} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="text-xs uppercase tracking-widest2 text-stone">
                  Tell us about your celebration *
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className={inputClass}
                  aria-invalid={!!errors.message}
                  {...register('message', { required: 'A few lines about your plans would be lovely.' })}
                />
                {errors.message && (
                  <p role="alert" className="mt-2 text-xs text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2 text-center">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Sending…' : 'Send enquiry'}
                </Button>
              </div>
            </form>
          </Reveal>
        )}
      </section>
    </>
  );
}
