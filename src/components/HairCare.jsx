import OilCard from './OilCard';

const OILS = [
  {
    emoji: '🌸',
    name: 'Camellia Oil',
    tagline: 'Hero Oil · Thin Hair Ideal',
    detail: 'Extracted from Camellia japonica — the lightest natural oil available with a fatty acid profile nearly identical to your scalp\'s own sebum. Penetrates the hair shaft without coating it or weighing fine strands down. Used for centuries in Japan for extraordinary shine. This is your primary oil.',
    ratio: '3–5 drops · Scalp to ends · 30–60 min · 1–2× per week',
  },
  {
    emoji: '🌿',
    name: 'Rosemary Oil',
    tagline: 'Scalp Stimulator — Must Dilute',
    detail: 'Clinical studies show rosemary essential oil matches minoxidil for improving hair density. Increases scalp microcirculation, activates dormant follicles, reduces hair fall. This is an essential oil — MUST be diluted. Never apply neat to the scalp.',
    ratio: '2–3 drops rosemary EO per 10ml camellia or jojoba (2–3% dilution) · Scalp only · 30–60 min · 1–2×/week',
  },
  {
    emoji: '✨',
    name: 'Argan Oil',
    tagline: 'Shine & Frizz · Post-Wash Only',
    detail: 'Rich in oleic acid and Vitamin E. Controls frizz in wavy hair and protects from heat styling. For thin strands: use only as a finishing oil AFTER washing — not as a pre-wash treatment which weighs fine hair down.',
    ratio: '1–2 drops ONLY · Damp mid-length to ends (never scalp) · Do not rinse out · After every wash',
  },
  {
    emoji: '🥥',
    name: 'Coconut Oil',
    tagline: 'Protein Protection · Sparingly',
    detail: 'Penetrates the hair cortex and reduces protein loss during washing. However, overuse causes protein overload on fine hair making strands brittle. For thin wavy hair: ends only, max every 2 weeks, always wash out completely.',
    ratio: '1–2 drops · Ends only (not scalp or mid-shaft) · Max 20 min · Once every 2 weeks',
  },
  {
    emoji: '🌼',
    name: 'Jojoba Oil',
    tagline: 'Carrier Oil · Scalp Balance',
    detail: 'Technically a liquid wax — most closely mimics human scalp sebum of any oil. Best carrier for diluting rosemary essential oil. Balances scalp oil production without blocking follicles. Lightweight enough for thin hair as a scalp-only treatment.',
    ratio: 'As carrier: mix rosemary EO into 10ml jojoba · Or 3–4 drops alone on scalp · 45 min · Rinse out',
  },
];

const STEPS = [
  { n: '1', h: 'Prepare Your Blend', p: 'In your palm: 3–5 drops camellia oil + 2 drops of your pre-made rosemary blend (3 drops rosemary EO in 10ml jojoba, stored in a dropper bottle). Rub palms to warm. Keep 1–2 drops argan oil separate for the ends.' },
  { n: '2', h: 'Section and Apply to Scalp', p: 'Part hair into 4 sections. Apply the camellia + rosemary blend directly to the scalp in each section using fingertips. Do not apply pre-wash oil to the length of fine hair — causes buildup and flattens wave pattern.' },
  { n: '3', h: 'Scalp Massage — 5 Full Minutes', p: 'Pads of fingers only (not nails). Small circular motions: temples → crown → nape. Firm enough to feel warmth and scalp movement, gentle enough not to tangle. 5 minutes is the minimum for meaningful follicle circulation benefit.' },
  { n: '4', h: 'Apply Argan Oil to Ends', p: '1–2 drops argan oil smoothed over the last 5–6 cm of ends only. Protects ends from dryness caused by repeated washing. Do not bring oil toward root.' },
  { n: '5', h: 'Leave On 30–60 Minutes', p: 'Wrap loosely with a warm towel if possible — heat enhances penetration. Do not sleep with oil in on a cotton pillowcase. For longer leave-ins, use a silk cap.' },
  { n: '6', h: 'Washing Out — Critical Step', p: 'Apply shampoo to DRY or barely damp hair first. Surfactants bind oil before water dilutes them. Lather at scalp, add water, rinse. Repeat shampoo if hair feels coated. Skipping this leaves residue that flattens waves.' },
  { n: '7', h: 'Condition Mid-Lengths to Ends', p: 'Lightweight conditioner from ear-level down only. Never condition the scalp — this weighs down fine roots. Leave 2–3 min. Rinse with cool water — seals the cuticle and creates shine.' },
  { n: '8', h: 'Post-Wash Shine Protocol', p: 'Scrunch gently with a microfiber towel (never rub — friction = frizz for wavy strands). 1 drop argan oil on palms, smooth over hair surface. Air dry where possible. Never brush when dry — wide-tooth comb on wet hair only.' },
];

export default function HairCare() {
  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Wavy · Thin Strands</div>
        <h2 className="s-title">Hair Care <em>&amp; Oils</em></h2>
        <p className="s-desc">Tap each oil to reveal its full profile, exact usage, and why it works for your hair type.</p>
      </div>

      <div className="divider splash-item">Your Oil Guide</div>
      <div className="oil-grid splash-item">
        {OILS.map(o => <OilCard key={o.name} {...o} />)}
      </div>

      <div className="divider splash-item">Step-by-Step Oiling Ritual</div>
      <div className="g-card splash-item">
        {STEPS.map(s => (
          <div key={s.n} className="oil-step">
            <div className="oil-sn">{s.n}</div>
            <div>
              <h4>{s.h}</h4>
              <p>{s.p}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="note-box note-rose splash-item">
        🚫 Avoid for thin strands: castor oil, sweet almond oil (too heavy), sleeping without a silk cap, brushing dry wavy hair, and coconut oil more than once every 2 weeks. A silk pillowcase alone reduces breakage and frizz noticeably.
      </div>
    </div>
  );
}
