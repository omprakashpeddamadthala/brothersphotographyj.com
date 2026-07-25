import { awards } from '@/data/site';
import { AnimatedHeading } from '@/components/common/AnimatedHeading';
import { Reveal } from '@/components/common/Reveal';

/**
 * Award badge with circular/shield styling to represent award logos.
 * Uses placeholder SVG shapes since we can't use copyrighted award logos.
 */
function AwardBadge({ title, year }: { title: string; year: number }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4">
      {/* Placeholder badge shape */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-ink/15 md:h-24 md:w-24">
        <span className="text-center text-[10px] font-medium uppercase leading-tight tracking-wider text-ink/50">
          {year}
        </span>
      </div>
      <p className="max-w-[140px] text-center text-[11px] uppercase leading-relaxed tracking-widest2 text-stone">
        {title}
      </p>
    </div>
  );
}

export function Awards() {
  return (
    <section className="bg-mist py-24">
      <div className="mx-auto max-w-6xl px-6">
        <AnimatedHeading eyebrow="Recognition">
          Awards & features
        </AnimatedHeading>
        <Reveal className="mt-14">
          <div className="flex flex-wrap items-start justify-center gap-8 md:gap-12">
            {awards.map((award) => (
              <AwardBadge
                key={award.id}
                title={award.title}
                year={award.year}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
