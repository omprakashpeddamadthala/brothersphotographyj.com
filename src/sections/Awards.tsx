import { awards } from '@/data/site';
import { AnimatedHeading } from '@/components/common/AnimatedHeading';
import { Reveal } from '@/components/common/Reveal';

export function Awards() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <AnimatedHeading eyebrow="Recognition">Awards &amp; features</AnimatedHeading>
      <ul className="mt-14 divide-y divide-ink/10">
        {awards.map((award, i) => (
          <Reveal key={award.id} delay={i * 0.08}>
            <li className="flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="font-serif text-xl">{award.title}</span>
              <span className="text-sm text-stone">
                {award.organisation} · {award.year}
              </span>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
