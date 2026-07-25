import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { SEO } from '@/components/common/SEO';
import { AnimatedHeading } from '@/components/common/AnimatedHeading';
import { Reveal } from '@/components/common/Reveal';
import { submitEnquiry } from '@/services/enquiries';
import { siteConfig } from '@/data/site';
import type { ContactFormValues } from '@/types';

const inputClass =
  'w-full border-b border-ink/15 bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-ink/30 focus:border-gold';

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
        title="Book Us Now"
        description="Tell us about your wedding — dates, places and plans. We would love to hear your story."
        path="/contact"
      />

      <section className="mx-auto max-w-3xl px-6 pb-28 pt-32 md:pt-40">
        <AnimatedHeading as="h1" eyebrow="Book us now :)">
          Tell us your story
        </AnimatedHeading>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-loose text-stone">
            We take on a limited number of weddings each season. Share your dates
            and plans below, or write to us directly at{' '}
            <a
              href={`mailto:${siteConfig.email}`}
              className="underline underline-offset-4 transition-colors hover:text-gold"
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
              Your enquiry is on its way to us. We usually reply within two
              working days.
            </p>
            <button
              type="button"
              className="mt-8 border border-ink px-8 py-4 text-xs uppercase tracking-widest2 transition-colors hover:bg-ink hover:text-paper"
              onClick={() => setSubmitted(false)}
            >
              Send another enquiry
            </button>
          </Reveal>
        ) : (
          <Reveal delay={0.15}>
            <form
              className="mt-16 grid gap-8 sm:grid-cols-2"
              onSubmit={handleSubmit((values) => mutation.mutate(values))}
              noValidate
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="text-[11px] uppercase tracking-widest2 text-stone"
                >
                  Your names *
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="First & Last name"
                  className={inputClass}
                  aria-invalid={!!errors.name}
                  {...register('name', {
                    required: 'Please tell us your names.',
                  })}
                />
                {errors.name && (
                  <p role="alert" className="mt-2 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="text-[11px] uppercase tracking-widest2 text-stone"
                >
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
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

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="text-[11px] uppercase tracking-widest2 text-stone"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  className={inputClass}
                  {...register('phone')}
                />
              </div>

              {/* Event Date */}
              <div>
                <label
                  htmlFor="eventDate"
                  className="text-[11px] uppercase tracking-widest2 text-stone"
                >
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

              {/* Event Type */}
              <div>
                <label
                  htmlFor="eventType"
                  className="text-[11px] uppercase tracking-widest2 text-stone"
                >
                  Type of event
                </label>
                <select
                  id="eventType"
                  className={`${inputClass} cursor-pointer`}
                  {...register('eventType')}
                >
                  <option value="">Select one</option>
                  <option value="wedding">Wedding</option>
                  <option value="pre-wedding">Pre-Wedding Shoot</option>
                  <option value="engagement">Engagement</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Number of Events */}
              <div>
                <label
                  htmlFor="numberOfEvents"
                  className="text-[11px] uppercase tracking-widest2 text-stone"
                >
                  Number of events / days
                </label>
                <input
                  id="numberOfEvents"
                  type="text"
                  placeholder="e.g. 3 days"
                  className={inputClass}
                  {...register('numberOfEvents')}
                />
              </div>

              {/* Venue / City */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="location"
                  className="text-[11px] uppercase tracking-widest2 text-stone"
                >
                  Venue / city
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder="e.g. Udaipur, Rajasthan"
                  className={inputClass}
                  {...register('location')}
                />
              </div>

              {/* How did you hear */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="heardAboutUs"
                  className="text-[11px] uppercase tracking-widest2 text-stone"
                >
                  How did you hear about us?
                </label>
                <input
                  id="heardAboutUs"
                  type="text"
                  placeholder="e.g. Instagram, friend's wedding, Google"
                  className={inputClass}
                  {...register('heardAboutUs')}
                />
              </div>

              {/* Message */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="text-[11px] uppercase tracking-widest2 text-stone"
                >
                  Tell us about your celebration *
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Share your plans, ideas, and anything you'd like us to know..."
                  className={inputClass}
                  aria-invalid={!!errors.message}
                  {...register('message', {
                    required: 'A few lines about your plans would be lovely.',
                  })}
                />
                {errors.message && (
                  <p role="alert" className="mt-2 text-xs text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="text-center sm:col-span-2">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-ink px-10 py-4 text-xs uppercase tracking-widest2 text-paper transition-colors hover:bg-gold disabled:opacity-50"
                >
                  {mutation.isPending ? 'Sending…' : 'Send enquiry'}
                </button>
              </div>
            </form>
          </Reveal>
        )}
      </section>
    </>
  );
}
