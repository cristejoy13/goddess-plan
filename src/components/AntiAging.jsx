const CARDS = [
  { ico: '🛌', t: 'Sleep — Master Hormone', b: "7.5–9 hours is not optional. Growth hormone — which rebuilds your glutes and skin overnight — is secreted primarily in deep sleep. Poor sleep raises cortisol, driving belly fat, puffiness, and hormonal acne. Sleep by 10 PM for optimal cycling." },
  { ico: '☀️', t: 'Morning Sunlight', b: "10–20 min of direct morning sunlight before 9 AM anchors your circadian rhythm, supports serotonin-to-melatonin conversion, regulates cortisol, and supports Vitamin D. Improves sleep, mood, skin healing, and hormone balance — all free." },
  { ico: '🧠', t: 'Brain Health', b: "Omega-3 from bangus, tuna, and tanigue are essential for neuroplasticity. Eggs provide choline — critical for memory. Ginger reduces neuroinflammation. Turmeric's curcumin crosses the blood-brain barrier and supports cognitive longevity." },
  { ico: '🍃', t: 'Cortisol Management', b: "Chronic stress → elevated cortisol → belly fat, acne, hair loss, disrupted hormones. Daily helpers: chamomile tea at night, limit screens after 8 PM, pilates (clinically proven to reduce cortisol), and never train hard on poor sleep." },
  { ico: '🌸', t: 'Hormone-Protective Eating', b: "Eggs provide cholesterol — the raw material for all sex hormones. Healthy fats from avocado, olive oil, and nuts are precursors to estrogen and progesterone. Avoiding processed foods removes xenoestrogens that disrupt your hormonal balance." },
  { ico: '✨', t: 'Skin Longevity Nutrients', b: "Daily collagen peptides rebuild the dermal matrix. Vitamin C from calamansi and papaya drives collagen synthesis. Omega-3 reduces water loss for plumpness. Zinc from nuts and beef heals and regulates oil glands. Your whole plan supports skin from within." },
];

export default function AntiAging() {
  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Longevity &amp; Hormones</div>
        <h2 className="s-title">Anti-Aging <em>&amp; Hormones</em></h2>
        <p className="s-desc">Starting at 22 is your greatest advantage. These habits create the visible difference at 32, 42, and beyond.</p>
      </div>

      <div className="ag-grid splash-item">
        {CARDS.map(c => (
          <div key={c.t} className="ag-card">
            <div className="ag-ico">{c.ico}</div>
            <div className="ag-t">{c.t}</div>
            <div className="ag-b">{c.b}</div>
          </div>
        ))}
      </div>

      <div className="divider splash-item">Supplement Stack</div>
      <div className="g-card splash-item">
        <p><span className="pill pg">Daily</span> Collagen peptides (bovine or marine) — dissolved in water at meals</p>
        <p style={{ marginTop: 8 }}><span className="pill pg">Daily</span> Omega-3 fish oil — or eat fatty fish 3× per week</p>
        <p style={{ marginTop: 8 }}><span className="pill pg">Daily</span> Vitamin C from whole food — calamansi, papaya, tomatoes</p>
        <p style={{ marginTop: 8 }}><span className="pill py">Consider</span> Magnesium glycinate — before bed for sleep, recovery, hormone support</p>
        <p style={{ marginTop: 8 }}><span className="pill py">Consider</span> Zinc picolinate — with food for skin clarity and immune health</p>
        <p style={{ marginTop: 8 }}><span className="pill pr">Avoid</span> High-dose single vitamins without professional guidance</p>
      </div>
    </div>
  );
}
