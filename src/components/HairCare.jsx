import OilCard from './OilCard';

const OILS = [
  {
    emoji: '🌸',
    name: 'Camellia Oil',
    tagline: 'Hero Oil · Thin Hair Ideal · Primary Treatment',
    detail: 'Extracted from Camellia japonica — the lightest natural oil available with a fatty acid profile nearly identical to your scalp\'s own sebum. Penetrates the hair shaft without coating it or weighing fine strands down. Used for centuries in Japan for extraordinary shine. This is your primary oil and the base of every ritual.',
    ratio: '3–5 drops · Scalp to ends · 30–60 min · 1–2× per week',
    steps: [
      { h: 'Warm the Oil', p: 'Place 3–5 drops camellia oil in your palm and rub both palms together briskly for 10 seconds. Warm oil penetrates the hair shaft up to 3× more effectively than cold oil. The warmth also makes the application much more pleasant.' },
      { h: 'Section and Apply to Scalp', p: 'Part hair into 4 sections. Apply oil directly to the scalp in each part using your fingertips. Camellia\'s light molecular structure means it won\'t build up on fine strands — apply freely from scalp to mid-length.' },
      { h: 'Scalp Massage — 5 Minutes', p: 'Using the pads of your fingers (never nails), massage in small firm circular motions: start at the temples, move to the crown, finish at the nape. 5 full minutes of genuine massage is the minimum for meaningful circulation benefit. This is the step most people cut short — don\'t.' },
      { h: 'Work Through Mid-Lengths', p: '1–2 additional drops smoothed through mid-length strands with palms. Do not bring oil all the way to the ends on a full treatment — the ends get their own oil in a later step.' },
      { h: 'Leave On 45–60 Minutes', p: 'Wrap hair loosely in a warm towel for the first 15 minutes — heat enhances penetration. Then remove the towel and let hair rest. For longer leave-ins, use a silk cap.' },
      { h: 'Shampoo Out Correctly', p: 'Apply shampoo to DRY hair first — before adding any water. Surfactants bind oil most effectively before water dilutes them. Lather at scalp, add a small amount of water, massage well, then rinse. Repeat if strands still feel coated.' },
      { h: 'Condition Mid-Lengths to Ends', p: 'Lightweight conditioner from ear-level down only. Never on the scalp — this weighs down fine roots. Leave 2–3 min. Rinse with cool water to seal the cuticle and maximise shine.' },
      { h: 'Finishing', p: 'Scrunch gently with a microfibre towel (never rub — friction = frizz for wavy strands). Air dry where possible. A wide-tooth comb on wet hair only — never brush dry wavy hair.' },
    ],
  },
  {
    emoji: '🌿',
    name: 'Rosemary Oil',
    tagline: 'Scalp Stimulator — Always Dilute',
    detail: 'Clinical studies show rosemary essential oil matches minoxidil for improving hair density over 6 months. It increases scalp microcirculation, activates dormant follicles, and reduces hair fall. This is an essential oil — it MUST be diluted before touching your scalp. Never apply neat.',
    ratio: '2–3 drops rosemary EO per 10ml camellia or jojoba (2–3% dilution) · Scalp only · 30–60 min · 1–2×/week',
    steps: [
      { h: 'Prepare Your Blend (Sunday, in advance)', p: 'Add 6 drops rosemary essential oil to a 10ml glass dropper bottle. Fill with camellia oil or jojoba oil. Cap, shake gently. Label "Rosemary Blend." This gives you a safe 2% dilution. Store in a cool dark place. Lasts 2–3 months.' },
      { h: 'Patch Test Before First Use', p: 'Apply 1 drop of the diluted blend to the inner wrist. Wait 24 hours. No redness or irritation means it\'s safe to use on your scalp. Essential oils require patch testing — never skip this the first time.' },
      { h: 'Section the Scalp', p: 'Part hair into 4 sections to expose the scalp fully. Apply the rosemary blend using the dropper directly to the scalp parting lines — 3–4 drops total is enough.' },
      { h: 'Scalp Massage — 5 Minutes', p: 'Firm circular motions with the pads of your fingers across the entire scalp. The rosemary increases blood flow to follicles during the massage. This combination — mechanical stimulation plus rosemary vasodilation — is what drives the density benefit.' },
      { h: 'Leave On 45–60 Minutes', p: 'The rosemary continues working throughout the leave-in period. No heat wrap needed for this one — rosemary is already stimulating. Tie hair loosely so it doesn\'t tangle.' },
      { h: 'Shampoo Out Twice', p: 'Because essential oils are more concentrated, shampoo twice to ensure complete removal. Apply shampoo to dry hair first, lather well, add water, rinse. Repeat. Leaving rosemary EO residue on the scalp can cause sensitivity over time.' },
      { h: 'Consistency Is the Key', p: 'Rosemary oil for hair density requires at least 4–6 weeks of consistent 1–2× per week use before any visible result. The studies that showed minoxidil-equivalent results ran for 6 months. Commit to the timeline.' },
    ],
  },
  {
    emoji: '✨',
    name: 'Argan Oil',
    tagline: 'Shine & Frizz Control · Post-Wash Finishing Oil',
    detail: 'Rich in oleic acid and Vitamin E. Controls frizz in wavy hair and protects from heat styling. For thin strands: use ONLY as a finishing oil after washing — not as a pre-wash treatment, which weighs fine hair down and flattens wave pattern.',
    ratio: '1–2 drops ONLY · Damp mid-length to ends (never scalp) · Do not rinse out · After every wash',
    steps: [
      { h: 'Wait Until Hair Is Damp, Not Dripping', p: 'After washing and towel-scrunching, wait until hair is 60–70% dry. Applying argan oil to soaking wet hair dilutes it too much to work. Applying to dry hair distributes unevenly and can cause greasiness at roots.' },
      { h: 'One Drop in Each Palm', p: '1 drop for fine strands. 2 drops maximum if your hair is thicker or longer than shoulder-length. Rub palms together. The warmth of your hands activates the oil and prevents patchy application.' },
      { h: 'Apply Mid-Length to Ends Only', p: 'Smooth palms from mid-shaft down to the ends. Never apply to the scalp or root area — argan is a finishing oil and will flatten fine roots. Focus on the last 5–8 cm of the lengths where dryness and frizz concentrate.' },
      { h: 'Scrunch Waves Into Place', p: 'Scrunch upward with both palms to encourage your natural wave pattern. The argan creates a light flexible hold that enhances waves without crunch.' },
      { h: 'Air Dry Only', p: 'Let hair air dry completely. If you must use heat, apply the argan oil first as a heat protectant — it withstands heat up to 220°C. But air drying with argan consistently is what gives wavy hair its signature healthy shine.' },
    ],
  },
  {
    emoji: '🥥',
    name: 'Coconut Oil',
    tagline: 'Protein Protection · Sparingly · Ends Only',
    detail: 'Penetrates the hair cortex and reduces protein loss during washing. However, overuse causes protein overload on fine hair making strands brittle and stiff. For thin wavy hair: ends only, maximum every 2 weeks, always wash out completely. Use less than you think you need.',
    ratio: '1–2 drops · Ends only (not scalp or mid-shaft) · Max 20 min · Once every 2 weeks · Always wash out',
    steps: [
      { h: 'Use Only Every 2 Weeks', p: 'Mark the date in your phone when you use coconut oil. Do not use again until at least 14 days have passed. Coconut oil builds up in the hair cortex — using it weekly causes protein overload, which makes fine strands feel dry, brittle, and stiff despite the oil.' },
      { h: 'Apply to Dry Ends Only', p: '1–2 drops on fingertips. Apply only to the last 3–4 cm of your ends. This is the oldest, most damaged part of your hair — it benefits from coconut\'s protein protection. Do not bring oil toward the scalp or mid-shaft.' },
      { h: 'Maximum 20-Minute Leave-In', p: 'Set a timer. 20 minutes is enough for coconut oil to bind to the hair cortex. Leaving it on longer on fine hair increases the risk of protein overload. This is one case where less time is genuinely better.' },
      { h: 'Wash Out Completely', p: 'Apply shampoo to the dry ends first before wetting. Coconut oil is harder to remove than other oils — it requires warm water and thorough shampooing. If strands still feel waxy after drying, shampoo again.' },
      { h: 'Watch for Protein Overload Signs', p: 'If hair feels unusually stiff, dry, or snaps easily after using coconut oil, that is protein overload. Stop using it for 4–6 weeks and focus on moisture with camellia and argan oil only. The hair will recover.' },
    ],
  },
  {
    emoji: '🌼',
    name: 'Jojoba Oil',
    tagline: 'Carrier Oil · Scalp Balance · Sebum Mimicker',
    detail: 'Technically a liquid wax — the closest molecular match to human scalp sebum of any oil. Best carrier for diluting rosemary essential oil. Balances scalp oil production: if your scalp overproduces sebum, jojoba signals it to produce less. Lightweight enough for thin hair as a standalone scalp treatment.',
    ratio: 'As carrier: mix rosemary EO into 10ml jojoba · Or 3–4 drops alone on scalp · 45 min · Rinse out',
    steps: [
      { h: 'Primary Use: Carrier for Rosemary EO', p: 'Jojoba is the ideal carrier for rosemary essential oil. In your 10ml dropper bottle, fill with jojoba oil and add 6 drops rosemary EO. The jojoba not only dilutes safely but also independently stimulates follicles and balances sebum production.' },
      { h: 'Standalone Scalp Treatment', p: 'On days when you want to treat your scalp without doing a full camellia ritual, apply 3–4 drops of pure jojoba directly to the scalp parting lines. Massage in for 2–3 minutes. It works well as a quick 30-minute midweek scalp treatment.' },
      { h: 'Section and Apply to Scalp Only', p: 'Part hair into sections, apply directly to scalp skin — not the hair lengths. Jojoba is designed for scalp health. Its job is to balance sebum, not to add shine or moisture to the strands.' },
      { h: 'Massage 3–5 Minutes', p: 'Use firm circular motions with fingertip pads. The combination of jojoba\'s sebum-balancing effect and mechanical massage creates a noticeably cleaner scalp that requires washing less frequently over time.' },
      { h: 'Leave 45 Minutes, Then Shampoo', p: 'Shampoo out as you would camellia oil — apply shampoo to dry scalp area first, lather well, add water, rinse. One thorough wash is usually enough since jojoba is a lighter oil than camellia for scalp use.' },
    ],
  },
];

export default function HairCare() {
  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Wavy · Thin Strands</div>
        <h2 className="s-title">Hair Care <em>&amp; Oils</em></h2>
        <p className="s-desc">Tap each oil to reveal its full profile, exact usage ratio, and complete step-by-step ritual tailored to your hair type.</p>
      </div>

      <div className="divider splash-item">Your Oil Guide — Tap Each Oil to Expand</div>
      <div className="oil-grid splash-item">
        {OILS.map(o => <OilCard key={o.name} {...o} />)}
      </div>

      <div className="note-box note-gold splash-item">
        💡 <strong>Weekly routine at a glance:</strong> Use camellia + rosemary blend 1–2× per week as your main treatment. Use argan oil after every wash as a finishing oil. Use jojoba as your rosemary carrier or as a standalone scalp treatment. Use coconut oil on ends only once every 2 weeks.
      </div>

      <div className="note-box note-rose splash-item">
        🚫 Avoid for thin strands: castor oil, sweet almond oil (too heavy), sleeping without a silk cap on oiling nights, brushing dry wavy hair, and coconut oil more than once every 2 weeks. A silk pillowcase alone reduces breakage and frizz noticeably every single night.
      </div>
    </div>
  );
}
