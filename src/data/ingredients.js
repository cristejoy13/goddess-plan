// Each entry: { emoji, color, tagline, options: [{ name, emoji, time, steps[], tip }] }
export const INGREDIENT_RECIPES = {

  /* ── Main protein ingredients ─────────────────────────────────── */

  egg: {
    emoji: '🥚',
    color: 'rgba(255,232,122,0.08)',
    tagline: 'The perfect protein — any way you like it',
    options: [
      {
        name: 'Boiled',
        emoji: '⏱️',
        time: '10 min',
        steps: [
          'Bring a small pot of water to a rolling boil.',
          'Lower the egg in gently with a spoon.',
          'Cook 7–8 min for soft-boiled (jammy yolk) or 10–12 min for hard-boiled.',
          'Transfer immediately to ice water for 2 min.',
          'Peel and eat with a pinch of salt.',
        ],
        tip: 'Soft-boiled gives a creamy yolk with the same protein as hard-boiled. Ice bath makes peeling effortless.',
      },
      {
        name: 'Sunny-side up',
        emoji: '🌞',
        time: '5 min',
        steps: [
          'Heat a non-stick pan on low heat for 1 min.',
          'Add a tiny amount of olive oil or coconut oil — just enough to coat.',
          'Crack the egg directly into the pan.',
          'Cook on low heat for 3–4 min. Do not flip.',
          'Remove when the white is set but the yolk is still runny. Season lightly.',
        ],
        tip: 'Low and slow is the secret — high heat toughens the white and overcooks the yolk instantly.',
      },
      {
        name: 'Scrambled',
        emoji: '🍳',
        time: '8 min',
        steps: [
          'Crack egg into a bowl, whisk with a pinch of salt and a tiny pinch of turmeric.',
          'Heat a non-stick pan on medium-low heat.',
          'Add a drop of olive oil, then pour in the egg.',
          'Gently push the egg around with a spatula — do not stir aggressively.',
          'Remove from heat when still slightly wet. Residual heat will finish it.',
        ],
        tip: 'Removing from heat while still slightly underdone is the key to soft, creamy scrambled eggs.',
      },
    ],
  },

  chicken: {
    emoji: '🍗',
    color: 'rgba(255,92,157,0.07)',
    tagline: 'Your lean protein foundation — three ways',
    options: [
      {
        name: 'Grilled',
        emoji: '🔥',
        time: '20 min',
        steps: [
          'Slice chicken breast to even 150g pieces.',
          'Marinate 10 min: squeeze calamansi juice + pinch of salt + ½ tsp turmeric.',
          'Heat a grill pan on medium-high until very hot.',
          'Grill 4–5 min each side without moving the chicken.',
          'Rest 3 min before cutting — keeps juices inside.',
        ],
        tip: 'Do not press down on the chicken while grilling. The sear marks mean flavour.',
      },
      {
        name: 'Baked',
        emoji: '🫙',
        time: '30 min',
        steps: [
          'Preheat oven to 180°C.',
          'Season chicken with salt, garlic powder, and turmeric on both sides.',
          'Place in a baking dish. Add a splash of water to the bottom to keep it moist.',
          'Bake 25–30 min until internal temperature reaches 75°C.',
          'Rest 5 min before serving.',
        ],
        tip: 'Baked chicken is the easiest to batch-cook on Sunday for the whole week.',
      },
      {
        name: 'Pan-seared',
        emoji: '🍳',
        time: '15 min',
        steps: [
          'Pat chicken dry with a paper towel — moisture prevents browning.',
          'Season both sides with salt and a pinch of ginger powder.',
          'Heat pan dry on medium-high for 1–2 min before adding a drop of oil.',
          'Sear 4–5 min per side without moving. A golden crust = full flavour.',
          'Squeeze calamansi over the top, rest 3 min off heat.',
        ],
        tip: 'Dry chicken + hot pan = restaurant-quality sear at home. Never add wet chicken to the pan.',
      },
    ],
  },

  fish: {
    emoji: '🐟',
    color: 'rgba(92,157,255,0.07)',
    tagline: 'Bangus or tanigue — your fastest-digesting protein',
    options: [
      {
        name: 'Pan-fried',
        emoji: '🍳',
        time: '15 min',
        steps: [
          'Pat fish completely dry with paper towels.',
          'Season with salt, ginger powder, and a squeeze of calamansi.',
          'Heat a pan on medium-high. Add a light layer of coconut oil.',
          'Fry skin-side down first for 4 min without moving.',
          'Flip gently, fry 3–4 min on the other side. Rest 2 min.',
        ],
        tip: 'Dry fish + hot oil = crispy skin. Wet fish steams instead of frying.',
      },
      {
        name: 'Steamed',
        emoji: '♨️',
        time: '12 min',
        steps: [
          'Place fish on a sheet of parchment paper in a steamer or colander over boiling water.',
          'Top with thin slices of fresh ginger and a squeeze of calamansi.',
          'Cover and steam 10–12 min until flesh flakes easily with a fork.',
          'Transfer carefully. Drizzle a tiny amount of sesame-free oil and extra calamansi.',
        ],
        tip: 'Steaming preserves the most omega-3 of any cooking method — no oxidation from heat or oil.',
      },
      {
        name: 'Baked',
        emoji: '🫙',
        time: '18 min',
        steps: [
          'Preheat oven to 190°C.',
          'Place fish in a lined baking dish.',
          'Season with ginger, calamansi, pinch of salt, and a thin slice of tomato on top.',
          'Bake 15–18 min until fish is opaque and flakes at the thickest part.',
          'Finish with fresh calamansi juice before serving.',
        ],
        tip: 'Baking is the most hands-off method — set it and prepare your salad while it cooks.',
      },
    ],
  },

  beef: {
    emoji: '🥩',
    color: 'rgba(200,80,80,0.07)',
    tagline: 'Lean beef — once a week, maximum iron and zinc',
    options: [
      {
        name: 'Stir-fried',
        emoji: '🥢',
        time: '12 min',
        steps: [
          'Slice lean beef thin, across the grain, into strips.',
          'Marinate 10 min: coconut aminos + fresh ginger + pinch of salt.',
          'Heat pan or wok on HIGH — the hottest setting.',
          'Add a drop of coconut oil, then beef in a single layer. Do not stir for 1 min.',
          'Toss and stir-fry 2–3 min more. Add broccoli and pechay in the last min.',
        ],
        tip: 'High heat is everything for stir-fry. Low heat makes the beef grey and tough.',
      },
      {
        name: 'Grilled',
        emoji: '🔥',
        time: '15 min',
        steps: [
          'Choose a lean cut — sirloin or tenderloin work best.',
          'Season both sides: salt, turmeric, calamansi juice. Marinate 10 min.',
          'Heat a grill or grill pan on very high heat.',
          'Grill 3–4 min per side for medium. Do not press down.',
          'Rest 5 min — this is not optional. Resting keeps all the juices inside.',
        ],
        tip: 'Rest time = juice time. Cutting immediately loses 30% of the moisture.',
      },
      {
        name: 'Braised',
        emoji: '🍲',
        time: '35 min',
        steps: [
          'Cut lean beef into chunks. Season with salt and ginger.',
          'Brown on all sides in a pot on high heat — 3–4 min total.',
          'Add 1 cup water or ginger broth, bring to a boil.',
          'Reduce to low heat, cover, and simmer 25–30 min until tender.',
          'Add broccoli and pechay in the last 5 min. Finish with calamansi.',
        ],
        tip: 'Braising makes tough cuts tender and infuses everything with flavour. Best for batch cooking.',
      },
    ],
  },

  /* ── Drinks & Teas ──────────────────────────────────────────── */

  'green-tea': {
    emoji: '🍵',
    color: 'rgba(100,180,100,0.07)',
    tagline: 'The metabolism booster — three brewing methods',
    options: [
      {
        name: 'Classic Hot Brew',
        emoji: '♨️',
        time: '5 min',
        steps: [
          'Boil water, then let it cool 2–3 min — ideal temperature is 80°C, not boiling.',
          'Place 1 green tea bag or 1 tsp loose-leaf tea in a cup.',
          'Pour the hot water over the tea.',
          'Steep exactly 2–3 min. Remove the bag immediately.',
          'Drink plain or add a squeeze of calamansi.',
        ],
        tip: 'Never use boiling water — it destroys the antioxidants (EGCG) and makes it bitter. 80°C is the sweet spot.',
      },
      {
        name: 'Ginger Green Tea',
        emoji: '🫚',
        time: '8 min',
        steps: [
          'Slice 3–4 thin rounds of fresh ginger.',
          'Simmer ginger in 300ml water on low heat for 5 min.',
          'Remove from heat, cool to 80°C (about 2 min).',
          'Add green tea bag. Steep 2–3 min, then remove.',
          'Add a squeeze of calamansi. Drink warm.',
        ],
        tip: 'Ginger + green tea together boost metabolism more than either alone — the combination amplifies thermogenesis.',
      },
      {
        name: 'Iced Green Tea',
        emoji: '🧊',
        time: '10 min',
        steps: [
          'Brew 2 green tea bags in 2 cups of 80°C water for 2–3 min.',
          'Remove bags. Stir in 1 tsp raw honey while still warm.',
          'Add a squeeze of calamansi.',
          'Pour over a full glass of ice immediately.',
          'Stir and drink — the ice dilutes it perfectly.',
        ],
        tip: 'Iced green tea is a great afternoon fat-burner that satisfies a sweet craving without sugar.',
      },
    ],
  },

  'collagen-water': {
    emoji: '💧',
    color: 'rgba(180,140,255,0.07)',
    tagline: 'Skin, joint, and gut support in one drink',
    options: [
      {
        name: 'Warm Collagen Water',
        emoji: '♨️',
        time: '3 min',
        steps: [
          'Boil 300ml of water, then cool to warm (not hot — heat degrades peptides).',
          'Add 1 scoop of unflavored collagen powder.',
          'Stir well until completely dissolved.',
          'Add a squeeze of calamansi — Vitamin C doubles collagen absorption.',
          'Drink slowly over 10–15 min.',
        ],
        tip: 'Vitamin C is required for collagen synthesis in your skin. Always pair your collagen with a citrus source.',
      },
      {
        name: 'Collagen Calamansi Cooler',
        emoji: '🍋',
        time: '3 min',
        steps: [
          'Fill a glass with 300ml room-temperature water.',
          'Add 1 scoop collagen powder and stir until dissolved.',
          'Squeeze 3–4 calamansi into the water.',
          'Add 1 tsp raw honey and stir.',
          'Add a few ice cubes if desired.',
        ],
        tip: 'The acidity from calamansi helps dissolve collagen peptides and enhances gut absorption — most bioavailable version.',
      },
      {
        name: 'Collagen Ginger Shot',
        emoji: '⚡',
        time: '5 min',
        steps: [
          'Juice or blend a small knob of ginger with 100ml water. Strain.',
          'Add 1 scoop collagen powder to the ginger water.',
          'Add a squeeze of calamansi and stir.',
          'Drink as a concentrated shot on an empty stomach.',
        ],
        tip: 'Taking collagen first thing in the morning on an empty stomach maximises absorption — nothing competing in the gut.',
      },
    ],
  },

  'spearmint-tea': {
    emoji: '🍵',
    color: 'rgba(60,200,140,0.07)',
    tagline: 'Natural anti-androgen — supports hormonal clarity',
    options: [
      {
        name: 'Classic Hot Brew',
        emoji: '♨️',
        time: '7 min',
        steps: [
          'Bring water to a gentle boil, then remove from heat and wait 1 min.',
          'Add 1 spearmint tea bag or 1 tsp dried spearmint leaves.',
          'Steep 5–7 min — spearmint needs full extraction, longer than green tea.',
          'Remove bag or strain. Drink plain or with a small drizzle of raw honey.',
        ],
        tip: 'Two cups of spearmint tea per day has been clinically shown to reduce androgens (male hormones) in women — supporting clearer skin and balanced hormones.',
      },
      {
        name: 'Iced Spearmint Tea',
        emoji: '🧊',
        time: '10 min + chill',
        steps: [
          'Brew 2 spearmint tea bags in 500ml of just-off-boil water for 5–7 min.',
          'Remove bags and stir in 1 tsp raw honey while warm.',
          'Add a squeeze of calamansi.',
          'Cool 15 min at room temperature, then pour over ice.',
          'Keep in fridge — stays fresh for 24 hours.',
        ],
        tip: 'Batch-brewing means you always have a hormone-balancing drink ready instead of reaching for something sugary.',
      },
      {
        name: 'Spearmint Ginger Blend',
        emoji: '🫚',
        time: '10 min',
        steps: [
          'Slice 3 thin rounds of fresh ginger.',
          'Simmer ginger in 300ml water for 5 min on low heat.',
          'Remove from heat, cool slightly, add 1 spearmint tea bag.',
          'Steep 5 min. Remove bag. Add calamansi and optional honey.',
          'Drink warm in the evening.',
        ],
        tip: 'Ginger + spearmint in the evening — ginger settles digestion, spearmint lowers androgens, both reduce overnight inflammation.',
      },
    ],
  },

  'ginger-juice': {
    emoji: '🫚',
    color: 'rgba(255,160,30,0.08)',
    tagline: 'Metabolism fire starter — three anti-bloat shots',
    options: [
      {
        name: 'Ginger Lemon Beet Shot',
        emoji: '⚡',
        time: '10 min',
        steps: [
          'Blend: 1 small knob ginger (2cm) + ½ small beet + juice of ½ lemon.',
          'Add ½ cup water and blend until smooth.',
          'Strain through a fine sieve, pressing all the liquid out.',
          'Add calamansi for extra citrus brightness.',
          'Drink as a shot or sip slowly on an empty stomach.',
        ],
        tip: 'Beet boosts nitric oxide (improves blood flow). Combined with ginger thermogenesis, this is one of the most powerful pre-workout drinks.',
      },
      {
        name: 'Classic Ginger Shot',
        emoji: '🔥',
        time: '5 min',
        steps: [
          'Blend a 3cm knob of fresh ginger with 100ml water.',
          'Strain thoroughly through a fine sieve.',
          'Add juice of 1 calamansi and ½ tsp raw honey.',
          'Stir and drink in one or two sips.',
          'Chase with a full glass of plain water.',
        ],
        tip: 'A ginger shot first thing in the morning triggers thermogenesis within 20 minutes — body temperature rises and fat burning begins.',
      },
      {
        name: 'Ginger Lemon Water',
        emoji: '💧',
        time: '5 min',
        steps: [
          'Slice 4–5 thin rounds of fresh ginger.',
          'Muddle (press and twist) ginger slices in a glass.',
          'Add 300ml warm (not hot) water.',
          'Squeeze half a lemon or 3 calamansi.',
          'Stir and drink immediately before eating.',
        ],
        tip: 'Warm lemon-ginger water before your first meal stimulates stomach acid production — improving digestion of everything you eat that day.',
      },
    ],
  },

  /* ── Fruits ──────────────────────────────────────────────────── */

  papaya: {
    emoji: '🍈',
    color: 'rgba(255,160,60,0.08)',
    tagline: 'The digestive enzyme fruit — three Filipino ways',
    options: [
      {
        name: 'Plain Sliced',
        emoji: '🔪',
        time: '3 min',
        steps: [
          'Halve the papaya lengthwise and scoop out the black seeds.',
          'Peel the skin or eat directly from the skin with a spoon.',
          'Slice into cubes or long strips.',
          'Squeeze calamansi over the top for brightness.',
          'Eat immediately — papaya oxidises quickly once cut.',
        ],
        tip: 'The black seeds are edible and peppery — they contain papain enzyme too. Try eating a few as a natural digestive aid.',
      },
      {
        name: 'Atchara-Style Salad',
        emoji: '🥗',
        time: '10 min',
        steps: [
          'Julienne or grate 1 cup of unripe (green) papaya into thin strips.',
          'Soak in salted water for 5 min to reduce bitterness, then rinse.',
          'Dressing: 2 calamansi + 1 tsp coconut aminos + pinch of chili.',
          'Toss papaya with dressing, sliced tomato, and thin onion rings.',
          'Rest 5 min before eating for flavors to meld.',
        ],
        tip: 'Unripe (green) papaya has the highest papain concentration — the enzyme that breaks down protein and actively reduces bloating after meals.',
      },
      {
        name: 'Papaya Smoothie',
        emoji: '🥤',
        time: '5 min',
        steps: [
          'Scoop 1 cup ripe papaya flesh into a blender.',
          'Add ½ banana for creaminess.',
          'Pour in ½ cup coconut water.',
          'Add a squeeze of calamansi and a pinch of cinnamon.',
          'Blend until completely smooth. Drink immediately.',
        ],
        tip: 'Papaya + coconut water is a natural electrolyte + enzyme combo — ideal after a workout or on a hot day.',
      },
    ],
  },

  watermelon: {
    emoji: '🍉',
    color: 'rgba(255,80,80,0.07)',
    tagline: '92% water, natural citrulline — three refreshing options',
    options: [
      {
        name: 'Plain Chilled',
        emoji: '🧊',
        time: '2 min',
        steps: [
          'Slice watermelon into triangles or cube it.',
          'Remove visible seeds if desired.',
          'Refrigerate 30 min before eating — cold watermelon is significantly sweeter.',
          'Sprinkle a tiny pinch of salt on top before eating.',
        ],
        tip: 'A pinch of salt on watermelon is a Filipino classic — it contrasts the sweetness and makes it taste even riper.',
      },
      {
        name: 'Watermelon Juice',
        emoji: '🥤',
        time: '5 min',
        steps: [
          'Cube 2 cups of seedless watermelon.',
          'Blend until smooth.',
          'Do not strain — the fibre slows sugar absorption.',
          'Add a squeeze of calamansi and pour over ice.',
          'Drink immediately — do not store, it separates quickly.',
        ],
        tip: 'Watermelon is naturally high in citrulline — an amino acid that improves blood flow and reduces muscle soreness after workouts.',
      },
      {
        name: 'Watermelon Mint Bowl',
        emoji: '🌿',
        time: '5 min',
        steps: [
          'Cube 1.5 cups of watermelon into bite-sized pieces.',
          'Tear 4–5 fresh mint leaves and mix in.',
          'Add a squeeze of calamansi.',
          'Top with a small handful of blueberries or strawberries.',
          'Serve cold.',
        ],
        tip: 'Mint + watermelon activates the cool receptors in the mouth — makes you feel even more refreshed, especially useful on hot days.',
      },
    ],
  },

  berries: {
    emoji: '🫐',
    color: 'rgba(100,80,200,0.07)',
    tagline: 'Antioxidant powerhouses — three delicious options',
    options: [
      {
        name: 'Plain Fresh',
        emoji: '✨',
        time: '1 min',
        steps: [
          'Rinse berries under cold running water in a colander.',
          'Pat dry gently with a paper towel.',
          'Eat immediately at room temperature — cold blunts the flavour.',
          'Mix blueberries, strawberries, and raspberries for maximum antioxidant variety.',
        ],
        tip: 'Different coloured berries contain different antioxidants — eating a mix gives broader skin and inflammation protection.',
      },
      {
        name: 'Berry Compote',
        emoji: '🍓',
        time: '8 min',
        steps: [
          'Add ½ cup mixed berries to a small saucepan.',
          'Add 1 tsp raw honey and a squeeze of calamansi.',
          'Cook on low heat 5–6 min, gently stirring, until berries break down and thicken.',
          'Remove from heat and cool slightly.',
          'Spoon over banana nice cream, chia pudding, or eat plain.',
        ],
        tip: 'Warm compote releases more anthocyanins (the anti-inflammatory pigment) than raw berries — a rare case where cooking increases nutrients.',
      },
      {
        name: 'Berry Smoothie',
        emoji: '🥤',
        time: '5 min',
        steps: [
          'Add ½ cup frozen mixed berries to a blender.',
          'Add ½ banana (fresh or frozen).',
          'Pour in ½ cup coconut water or unsweetened almond milk.',
          'Blend until thick and smooth.',
          'Drink immediately — do not store.',
        ],
        tip: 'Frozen berries retain 90% of their antioxidants — freezing after peak ripeness locks in all the nutrients.',
      },
    ],
  },

  pineapple: {
    emoji: '🍍',
    color: 'rgba(255,200,50,0.08)',
    tagline: 'Bromelain enzyme for digestion and anti-inflammation',
    options: [
      {
        name: 'Fresh Sliced',
        emoji: '🔪',
        time: '5 min',
        steps: [
          'Lay pineapple on its side. Slice off top and bottom.',
          'Stand upright. Slice off the skin in downward strips.',
          'Quarter lengthwise and cut out the tough core from each quarter.',
          'Slice into triangles or bite-sized chunks.',
          'Serve immediately or refrigerate for up to 2 days.',
        ],
        tip: 'The core has the highest concentration of bromelain — chew it even if it feels tough, it is worth it.',
      },
      {
        name: 'Pineapple Ginger Juice',
        emoji: '🥤',
        time: '7 min',
        steps: [
          'Cube 1 cup of fresh pineapple.',
          'Blend with a 1cm knob of fresh ginger and ½ cup water.',
          'Strain through a fine sieve, pressing the pulp.',
          'Add a squeeze of calamansi.',
          'Drink on an empty stomach for maximum bromelain effect.',
        ],
        tip: 'Pineapple-ginger juice on an empty stomach is one of the most powerful natural digestive tonics — reduces bloating for hours.',
      },
      {
        name: 'Grilled Pineapple',
        emoji: '🔥',
        time: '10 min',
        steps: [
          'Cut pineapple into 1cm-thick rings or long wedges.',
          'Sprinkle a tiny pinch of cinnamon on each piece.',
          'Heat a dry grill pan or non-stick pan on medium-high.',
          'Grill 2–3 min per side until caramelized lines form.',
          'Serve warm — the heat intensifies the sweetness dramatically.',
        ],
        tip: 'Grilling pineapple caramelises the natural sugars and reduces acidity — it tastes sweeter than raw with zero added sugar.',
      },
    ],
  },

  apple: {
    emoji: '🍎',
    color: 'rgba(255,80,60,0.07)',
    tagline: 'Pectin fibre for gut health and sustained energy',
    options: [
      {
        name: 'Plain with Cinnamon',
        emoji: '🌀',
        time: '2 min',
        steps: [
          'Wash the apple thoroughly — eat with the skin on for maximum fibre.',
          'Core and slice into wedges.',
          'Sprinkle a pinch of cinnamon over the slices.',
          'Optional: dip in a small amount of almond butter.',
          'Eat at room temperature — cold dulls the flavour.',
        ],
        tip: 'The skin contains the majority of quercetin — an antioxidant that reduces histamine response and supports clear skin.',
      },
      {
        name: 'Warm Baked Apple',
        emoji: '🫙',
        time: '20 min',
        steps: [
          'Core the apple but do not peel.',
          'Stuff the cavity with a pinch of cinnamon and 1 tsp raw honey.',
          'Place in a small baking dish with 2 tbsp water at the bottom.',
          'Bake at 180°C for 15–18 min until tender and slightly caramelised.',
          'Eat warm — the cinnamon and honey melt through the apple.',
        ],
        tip: 'A baked apple tastes like dessert — sweet, warm, and satisfying with zero guilt and full digestive benefit.',
      },
      {
        name: 'Apple Ginger Juice',
        emoji: '🥤',
        time: '5 min',
        steps: [
          'Core 1 apple (no need to peel).',
          'Blend with a small knob of fresh ginger and ½ cup water.',
          'Add a squeeze of calamansi.',
          'Do not strain — blend smooth to keep all the fibre.',
          'Drink immediately.',
        ],
        tip: 'Apple pectin directly feeds good gut bacteria — this is prebiotic fibre that actively builds a healthier microbiome with every cup.',
      },
    ],
  },

  /* ── Vegetables ──────────────────────────────────────────────── */

  broccoli: {
    emoji: '🥦',
    color: 'rgba(80,180,80,0.07)',
    tagline: 'The anti-bloat, anti-estrogen vegetable',
    options: [
      {
        name: 'Steamed',
        emoji: '♨️',
        time: '5 min',
        steps: [
          'Cut broccoli into even-sized florets.',
          'Place in a steamer basket over boiling water.',
          'Cover and steam exactly 4–5 min — keep it bright green and firm.',
          'Remove immediately. Do not let it sit in steam or it turns mushy.',
          'Season with a squeeze of calamansi and a tiny pinch of salt.',
        ],
        tip: 'Steamed broccoli retains the most sulforaphane — the compound that actively lowers estrogen.',
      },
      {
        name: 'Roasted',
        emoji: '🔥',
        time: '22 min',
        steps: [
          'Preheat oven to 200°C.',
          'Toss florets with a light coating of olive oil and a pinch of salt.',
          'Spread in a single layer on a baking sheet. Do not crowd.',
          'Roast 18–20 min until edges are slightly crispy and caramelized.',
          'Finish with calamansi and optional garlic powder.',
        ],
        tip: 'Roasting creates crispy, nutty-flavoured edges. If you do not love steamed broccoli, you will love this.',
      },
      {
        name: 'Stir-fried',
        emoji: '🥢',
        time: '6 min',
        steps: [
          'Cut broccoli into small florets, pat dry.',
          'Heat a pan or wok on high heat until very hot.',
          'Add a drop of coconut oil and a thin slice of fresh ginger.',
          'Add broccoli and toss constantly for 4–5 min.',
          'Finish with a splash of water and calamansi — let it steam off for 1 min.',
        ],
        tip: 'High heat for stir-fry means the vegetable chars slightly rather than steaming. The slight char adds flavour.',
      },
    ],
  },

  'sweet potato': {
    emoji: '🍠',
    color: 'rgba(255,160,60,0.08)',
    tagline: 'Slow energy, high fibre, anti-bloat carbs',
    options: [
      {
        name: 'Roasted',
        emoji: '🔥',
        time: '28 min',
        steps: [
          'Peel and cube sweet potato into 2cm pieces.',
          'Toss with a light drizzle of olive oil and a pinch of cinnamon and salt.',
          'Spread on a lined baking sheet in a single layer.',
          'Roast at 200°C for 25–28 min, flipping once halfway.',
          'They are ready when golden and slightly caramelized at the edges.',
        ],
        tip: 'Roasting converts more starch to sugar than steaming, giving a naturally sweeter flavour without adding anything.',
      },
      {
        name: 'Steamed',
        emoji: '♨️',
        time: '15 min',
        steps: [
          'Peel and cut into even-sized chunks.',
          'Place in a steamer basket over boiling water.',
          'Cover and steam 12–15 min until completely fork-tender.',
          'Season lightly with salt or eat plain.',
        ],
        tip: 'Steamed sweet potato has a lower glycaemic response than roasted — digests more slowly and keeps you fuller longer.',
      },
      {
        name: 'Mashed',
        emoji: '🥣',
        time: '18 min',
        steps: [
          'Steam or boil sweet potato chunks until very soft, about 15 min.',
          'Drain and mash thoroughly with a fork.',
          'Add a pinch of cinnamon, a tiny pinch of salt, and a small splash of unsweetened almond milk.',
          'Mash until smooth. No butter or sugar needed.',
        ],
        tip: 'Mashed sweet potato with cinnamon tastes sweet and dessert-like naturally — great comfort food without the guilt.',
      },
    ],
  },

  salad: {
    emoji: '🥗',
    color: 'rgba(80,200,120,0.07)',
    tagline: 'Three tasty salad builds — tap to see ingredients & how to make them',
    options: [
      {
        name: 'Classic Calamansi Salad',
        emoji: '🌸',
        time: '5 min',
        steps: [
          'Slice ½ cucumber into thin rounds.',
          'Halve 5–6 cherry tomatoes.',
          'Thinly slice ¼ bell pepper (any colour).',
          'Dressing: squeeze 2 calamansi + ½ tsp olive oil + pinch of salt + pinch of pepper. Whisk.',
          'Toss everything together and serve immediately.',
        ],
        tip: 'Calamansi dressing acts as a natural digestive enzyme — reduces bloating when eaten with protein.',
      },
      {
        name: 'Mango Honey Salad',
        emoji: '🥭',
        time: '7 min',
        steps: [
          'Slice ½ ripe mango into cubes.',
          'Slice ½ banana into coins.',
          'Halve 4–5 cherry tomatoes.',
          'Slice ½ cucumber.',
          'Shred a handful of lettuce and purple cabbage.',
          'Thinly slice ¼ onion and ¼ bell pepper.',
          'Dressing: 1 tsp honey + squeeze of calamansi or lemon + pinch of salt. Mix well.',
          'Add a small handful of walnuts on top. Toss and serve.',
        ],
        tip: 'Mango and honey give a natural sweetness that makes this salad feel like a treat — great for light fruit-and-salad days.',
      },
      {
        name: 'Sweet Bell Pepper Salad',
        emoji: '🫑',
        time: '6 min',
        steps: [
          'Halve 6–7 cherry tomatoes.',
          'Slice ½ cucumber.',
          'Thinly slice ½ bell pepper (red or yellow for sweetness).',
          'Peel and segment 1 small orange.',
          'Dressing: squeeze of calamansi + 1 tsp honey + pinch of salt. Whisk.',
          'Toss all ingredients together and serve fresh.',
        ],
        tip: 'The orange and bell pepper together give a natural Vitamin C boost — great for collagen support on training days.',
      },
    ],
  },

  avocado: {
    emoji: '🥑',
    color: 'rgba(80,160,80,0.07)',
    tagline: 'Hormone-healthy fat — three ways to enjoy it',
    options: [
      {
        name: 'Plain with Calamansi',
        emoji: '🍋',
        time: '2 min',
        steps: [
          'Halve the avocado lengthwise and remove the pit.',
          'Score the flesh in a crosshatch pattern with a knife (do not cut through skin).',
          'Squeeze calamansi generously over the top.',
          'Eat directly from the skin with a spoon.',
        ],
        tip: 'Calamansi prevents browning and adds Vitamin C — which helps your body absorb the fat-soluble nutrients in avocado.',
      },
      {
        name: 'Mashed',
        emoji: '🥣',
        time: '3 min',
        steps: [
          'Scoop avocado flesh into a small bowl.',
          'Mash with a fork until your desired consistency — chunky or smooth.',
          'Add squeeze of calamansi, pinch of salt, optional pinch of ginger powder.',
          'Eat with cucumber slices as natural dippers.',
        ],
        tip: 'Mashing breaks the cell walls slightly, making the healthy fats easier to absorb.',
      },
      {
        name: 'Chocolate Mousse',
        emoji: '🍫',
        time: '5 min',
        steps: [
          'Scoop ½ avocado into a blender or bowl.',
          'Add 1 tsp raw cacao powder and 1 tsp raw honey.',
          'Add a pinch of sea salt and a splash of unsweetened almond milk.',
          'Blend until perfectly smooth — or whisk vigorously.',
          'Taste and adjust — more cacao for bitterness, more honey for sweetness.',
        ],
        tip: 'This mousse has the same creamy texture as chocolate mousse but with healthy fats and zero processed sugar.',
      },
    ],
  },

  banana: {
    emoji: '🍌',
    color: 'rgba(255,220,50,0.08)',
    tagline: 'Natural sweetness — three dessert options',
    options: [
      {
        name: 'Banana Nice Cream',
        emoji: '🍦',
        time: '10 min + freeze',
        steps: [
          'Peel and slice 2 ripe bananas. Freeze overnight or at least 4 hours.',
          'Add frozen banana chunks to a blender.',
          'Blend until smooth and creamy — stop and scrape sides as needed.',
          'Serve immediately for soft-serve texture, or refreeze 30 min for firmer.',
          'Optional: add 1 tsp raw cacao, or cinnamon, or a few frozen berries.',
        ],
        tip: 'Fully frozen bananas are key. Partially frozen gives a lumpy result. Use very ripe bananas for the best sweetness.',
      },
      {
        name: 'Banana Pancakes',
        emoji: '🥞',
        time: '10 min',
        steps: [
          'Mash 1 very ripe banana in a bowl until completely smooth.',
          'Add 2 eggs and a pinch of cinnamon. Mix well.',
          'Heat a non-stick pan on medium-low heat. No oil needed.',
          'Pour small circles of batter (about 2 tbsp each).',
          'Cook 2 min until bubbles form on top, flip gently, cook 1 min more.',
        ],
        tip: 'Only 2 ingredients, naturally sweet, no flour. Works best with very ripe (spotted) bananas.',
      },
      {
        name: 'Banana Chia Bowl',
        emoji: '🥣',
        time: '5 min + set',
        steps: [
          'Mash 1 ripe banana in a bowl.',
          'Add 2 tbsp chia seeds and 1 cup unsweetened almond milk.',
          'Mix thoroughly, then add a pinch of cinnamon.',
          'Refrigerate for at least 2 hours or overnight until thick and pudding-like.',
          'Top with kiwi or papaya before eating.',
        ],
        tip: 'The banana replaces any need for sweetener. The chia adds fibre and omega-3.',
      },
    ],
  },

  chia: {
    emoji: '🫙',
    color: 'rgba(100,80,220,0.07)',
    tagline: 'Fibre, omega-3, and naturally sweet — three pudding builds',
    options: [
      {
        name: 'Classic Chia Pudding',
        emoji: '✨',
        time: '5 min + overnight',
        steps: [
          'Add 3 tbsp chia seeds to a jar or bowl.',
          'Pour in 1 cup unsweetened almond milk.',
          'Add ½ tsp cinnamon and stir well.',
          'Stir again after 10 min to break up any clumps.',
          'Refrigerate overnight. It is ready when thick and pudding-like.',
        ],
        tip: 'Make this the night before — 5 min of prep means a full, nutritious breakfast is waiting in the morning.',
      },
      {
        name: 'Mango Chia Pudding',
        emoji: '🥭',
        time: '8 min + overnight',
        steps: [
          'Make the classic base: 3 tbsp chia + 1 cup almond milk + cinnamon.',
          'Blend ½ ripe mango (or use 3 tbsp mango puree).',
          'Swirl the mango puree into the chia base — do not fully mix. Keep swirls.',
          'Refrigerate overnight.',
          'Top with fresh mango slices before serving.',
        ],
        tip: 'Mango is high in digestive enzymes (amylase and lipase) — naturally improves digestion and reduces bloating.',
      },
      {
        name: 'Chocolate Chia Pudding',
        emoji: '🍫',
        time: '6 min + overnight',
        steps: [
          'Add 3 tbsp chia seeds to a jar.',
          'Add 1 tsp raw cacao powder and mix dry first.',
          'Pour in 1 cup unsweetened almond milk and ½ tsp cinnamon.',
          'Optional: add 1 tsp raw honey for sweetness.',
          'Stir well, refrigerate overnight.',
        ],
        tip: 'Raw cacao is not the same as cocoa powder — it is unprocessed and rich in magnesium, which supports sleep and hormone balance.',
      },
    ],
  },

  oats: {
    emoji: '🌾',
    color: 'rgba(200,160,60,0.08)',
    tagline: 'Slow-releasing energy — three oat builds',
    options: [
      {
        name: 'Warm Oatmeal',
        emoji: '☕',
        time: '7 min',
        steps: [
          'Add ½ cup rolled oats (not instant) to a small pot.',
          'Pour in 1 cup water. Bring to a gentle boil.',
          'Reduce heat and simmer, stirring occasionally, for 4–5 min until thick.',
          'Remove from heat. Stir in ¼ cup unsweetened almond milk, ½ tsp cinnamon.',
          'Top with sliced banana. Eat immediately.',
        ],
        tip: 'Rolled oats have a lower glycaemic index than instant oats — they digest more slowly and keep you fuller for hours.',
      },
      {
        name: 'Overnight Oats',
        emoji: '🌙',
        time: '5 min + overnight',
        steps: [
          'Add ½ cup rolled oats to a jar.',
          'Pour in ¾ cup unsweetened almond milk.',
          'Add 1 tsp chia seeds and ½ tsp cinnamon. Stir well.',
          'Seal jar and refrigerate overnight.',
          'In the morning, top with kiwi or banana slices and eat cold.',
        ],
        tip: 'Soaking oats overnight increases their resistant starch content — which feeds good gut bacteria and reduces bloating.',
      },
      {
        name: 'Oat Porridge',
        emoji: '🥥',
        time: '10 min',
        steps: [
          'Add ½ cup rolled oats to a pot.',
          'Pour in 1 cup light coconut milk (from a can — diluted with water).',
          'Simmer on low heat, stirring constantly, until very thick, about 7–8 min.',
          'Season with a pinch of salt to balance the coconut sweetness.',
          'Top with sliced banana and a drizzle of raw honey.',
        ],
        tip: 'Coconut milk adds medium-chain fatty acids (MCTs) which are metabolised quickly for energy — not stored as fat.',
      },
    ],
  },

  /* ── Snack / Dessert items ───────────────────────────────────── */

  'banana-nice-cream': {
    emoji: '🍦',
    color: 'rgba(255,220,50,0.1)',
    tagline: 'One-ingredient ice cream — sweet, creamy, guilt-free',
    options: [
      {
        name: 'Classic',
        emoji: '🍌',
        time: '5 min + freeze',
        steps: [
          'Freeze 2 ripe (spotted) bananas overnight.',
          'Break into chunks and blend until completely smooth.',
          'Serve immediately for soft-serve, or freeze 30 min for scoopable.',
          'Top with a pinch of cinnamon.',
        ],
        tip: 'The riper the banana, the sweeter the result. Spotted bananas are ideal.',
      },
      {
        name: 'Cacao Nice Cream',
        emoji: '🍫',
        time: '5 min + freeze',
        steps: [
          'Freeze 2 bananas overnight.',
          'Blend with 1 tsp raw cacao powder until silky smooth.',
          'Taste and add a pinch of salt to bring out the chocolate flavour.',
          'Serve immediately or freeze 30 min for a firmer scoop.',
        ],
        tip: 'Raw cacao + banana hits the same pleasure centre as chocolate ice cream — without the sugar crash.',
      },
      {
        name: 'Cinnamon Swirl',
        emoji: '🌀',
        time: '5 min + freeze',
        steps: [
          'Freeze 2 bananas overnight.',
          'Blend until smooth. Add ½ tsp cinnamon and a tiny drizzle of raw honey.',
          'Swirl in rather than fully blending for a marbled effect.',
          'Serve or refreeze 30 min.',
        ],
        tip: 'Cinnamon stabilises blood sugar — meaning this snack satisfies a sweet craving without spiking insulin.',
      },
    ],
  },

  'chia-mango-pudding': {
    emoji: '🥭',
    color: 'rgba(255,180,50,0.1)',
    tagline: 'Tropical dessert with omega-3 and digestive enzymes',
    options: [
      {
        name: 'Sweet Mango Chia',
        emoji: '✨',
        time: '5 min + 4h',
        steps: [
          'Blend ½ ripe mango into a smooth puree.',
          'Mix 3 tbsp chia seeds + ¾ cup almond milk + mango puree.',
          'Stir every 10 min for the first 30 min to prevent clumping.',
          'Refrigerate 4h or overnight until set.',
          'Top with fresh mango slices before eating.',
        ],
        tip: 'Fresh mango contains amylase — a digestive enzyme that breaks down starches and reduces bloating.',
      },
      {
        name: 'Layered Mango Chia',
        emoji: '🌅',
        time: '8 min + overnight',
        steps: [
          'Make plain chia pudding: 3 tbsp chia + 1 cup almond milk. Set overnight.',
          'Blend ½ mango into puree.',
          'In a glass, add a layer of chia pudding, then mango puree, then chia pudding.',
          'Finish with a thick layer of mango puree on top.',
          'Refrigerate at least 1h before eating for clean layers.',
        ],
        tip: 'Layering creates a beautiful gradient effect — this is dessert that also looks like dessert.',
      },
      {
        name: 'Coconut Mango Chia',
        emoji: '🥥',
        time: '5 min + overnight',
        steps: [
          'Mix 3 tbsp chia seeds with ¾ cup light coconut milk (diluted from can).',
          'Add 3 tbsp mango puree and ½ tsp cinnamon. Stir thoroughly.',
          'Refrigerate overnight.',
          'Top with toasted desiccated coconut and fresh mango in the morning.',
        ],
        tip: 'Coconut milk makes the pudding richer and creamier — closer to a restaurant-style dessert.',
      },
    ],
  },

  'cacao-banana-bites': {
    emoji: '🍫',
    color: 'rgba(100,60,20,0.09)',
    tagline: 'No-bake energy bites — chocolate flavour, zero guilt',
    options: [
      {
        name: 'Classic Bites',
        emoji: '⚡',
        time: '15 min + freeze',
        steps: [
          'Mash 1 very ripe banana thoroughly in a bowl.',
          'Mix in ½ cup rolled oats and 1 tsp raw cacao powder.',
          'Add a pinch of sea salt. Mix until a sticky dough forms.',
          'Roll into 8–10 balls using wet hands.',
          'Freeze 30 min until firm. Store in the freezer.',
        ],
        tip: 'Make a batch on Sunday. They keep in the freezer for 2 weeks — grab one at 2 PM without thinking.',
      },
      {
        name: 'Coconut Cacao Bites',
        emoji: '🥥',
        time: '15 min + freeze',
        steps: [
          'Mash 1 banana + ½ cup rolled oats + 1 tsp raw cacao. Mix well.',
          'Add 1 tbsp desiccated (unsweetened) coconut to the mix.',
          'Roll into balls, then roll each ball in more desiccated coconut to coat.',
          'Freeze 30 min until firm.',
        ],
        tip: 'Rolling in coconut adds texture contrast — crisp outside, chewy inside.',
      },
      {
        name: 'Almond Cacao Bites',
        emoji: '🌰',
        time: '15 min + freeze',
        steps: [
          'Mash 1 banana + ½ cup rolled oats + 1 tsp cacao. Mix.',
          'Stir in 1 tbsp almond butter until fully combined.',
          'Roll into balls. Press a small almond into the top of each one.',
          'Freeze 30 min.',
        ],
        tip: 'Almond butter adds healthy fat and protein, turning this into a complete mini-meal.',
      },
    ],
  },

  'sweet-potato-brownie': {
    emoji: '🍫',
    color: 'rgba(180,80,30,0.08)',
    tagline: 'Fudgy, sweet, and actually good for you',
    options: [
      {
        name: 'Baked Brownies',
        emoji: '🫙',
        time: '35 min',
        steps: [
          'Steam or boil 1 medium sweet potato until very soft. Mash completely.',
          'Mix in 2 tbsp raw cacao powder, 2 eggs, 2 tbsp almond flour, and a pinch of salt.',
          'Stir in 1 tsp raw honey for sweetness.',
          'Pour into a small lined baking dish.',
          'Bake at 180°C for 18–20 min. Cool fully before cutting — they set as they cool.',
        ],
        tip: 'They will look underdone when hot. Let them cool completely — they firm up into a fudgy texture.',
      },
      {
        name: 'No-Bake Fudge Bites',
        emoji: '❄️',
        time: '15 min + freeze',
        steps: [
          'Steam ½ sweet potato until very soft. Mash well.',
          'Mix in 1 tsp raw cacao + 1 tsp raw honey + pinch of cinnamon.',
          'Roll the mixture into small balls.',
          'Freeze 1 hour until firm.',
          'Dust with raw cacao powder before serving.',
        ],
        tip: 'No-bake is the fastest option. Keep them frozen and grab one directly from the freezer.',
      },
      {
        name: 'Cinnamon Oat Bites',
        emoji: '🌾',
        time: '25 min',
        steps: [
          'Steam ½ sweet potato, mash well.',
          'Mix with ¼ cup rolled oats + ½ tsp cinnamon + 1 tsp honey.',
          'Form into small rounds and place on a lined baking sheet.',
          'Bake at 175°C for 15 min until slightly golden.',
          'Cool on a rack — they crisp up as they cool.',
        ],
        tip: 'These have a cookie-like texture when cooled. Great as a grab-and-go sweet treat.',
      },
    ],
  },

  'coconut-chia-balls': {
    emoji: '🥥',
    color: 'rgba(255,255,255,0.06)',
    tagline: 'No-bake energy balls — creamy coconut, sweet centre',
    options: [
      {
        name: 'Classic Coconut Chia Balls',
        emoji: '✨',
        time: '15 min + 30 min',
        steps: [
          'Mix 2 tbsp chia seeds + 3 tbsp desiccated coconut + 1 tbsp almond butter.',
          'Add 1 tsp raw honey. Mix until everything comes together.',
          'Refrigerate the mixture 15 min so the chia absorbs moisture and it firms up.',
          'Roll into 6–8 small balls.',
          'Roll each ball in extra desiccated coconut. Refrigerate 30 min.',
        ],
        tip: 'Keep these in the fridge — they stay fresh for 5 days and taste better cold.',
      },
      {
        name: 'Cacao Coconut Balls',
        emoji: '🍫',
        time: '15 min + 30 min',
        steps: [
          'Mix 2 tbsp chia + 3 tbsp desiccated coconut + 1 tsp raw cacao + 1 tbsp almond butter.',
          'Add 1 tsp honey and mix until sticky.',
          'Chill mixture 15 min, then roll into balls.',
          'Roll in a mix of cacao powder and desiccated coconut to coat.',
          'Refrigerate 30 min before eating.',
        ],
        tip: 'The cacao-coconut coating makes these taste and look like expensive truffles.',
      },
      {
        name: 'Tropical Coconut Balls',
        emoji: '🌺',
        time: '15 min + 30 min',
        steps: [
          'Mix 2 tbsp chia + 3 tbsp desiccated coconut + 1 tbsp almond butter + 1 tsp honey.',
          'Stir in 1 tbsp finely chopped dried mango or pineapple.',
          'Chill 15 min, roll into balls.',
          'Coat in desiccated coconut.',
          'Refrigerate 30 min.',
        ],
        tip: 'The dried fruit adds natural sweetness and a tropical chew. Pick mango for extra Vitamin C.',
      },
    ],
  },

  'avocado-choc-mousse': {
    emoji: '🍫',
    color: 'rgba(40,100,40,0.08)',
    tagline: 'Silky chocolate mousse — avocado base, zero dairy',
    options: [
      {
        name: 'Classic Mousse',
        emoji: '✨',
        time: '5 min',
        steps: [
          'Scoop ½ ripe avocado into a blender.',
          'Add 1 tsp raw cacao powder, 1 tsp raw honey, a pinch of sea salt.',
          'Add 2 tbsp unsweetened almond milk.',
          'Blend until perfectly silky smooth — scrape sides once.',
          'Taste and adjust: more cacao for bitter, more honey for sweet.',
        ],
        tip: 'The avocado gives it the exact same texture as a classic mousse — no one will guess the base.',
      },
      {
        name: 'Mint Chocolate Mousse',
        emoji: '🌿',
        time: '6 min',
        steps: [
          'Scoop ½ avocado into a blender.',
          'Add 1 tsp cacao, 1 tsp honey, pinch of salt, 2 tbsp almond milk.',
          'Add 3–4 fresh mint leaves.',
          'Blend until completely smooth.',
          'Taste for mint level — add 1 more leaf if you want it stronger.',
        ],
        tip: 'Mint + chocolate is a classic combination. The fresh mint is cleaner and more vivid than mint extract.',
      },
      {
        name: 'Berry Swirl Mousse',
        emoji: '🫐',
        time: '8 min',
        steps: [
          'Make classic mousse: blend ½ avocado + cacao + honey + salt + almond milk.',
          'Mash or blend 6–8 fresh or frozen berries (blueberries or strawberries) separately.',
          'Spoon mousse into a small bowl.',
          'Drizzle berry puree on top in a swirl pattern — do not mix.',
          'The berry swirl adds tartness that balances the rich chocolate.',
        ],
        tip: 'Blueberries add anthocyanins — potent antioxidants that reduce inflammation and support skin collagen.',
      },
    ],
  },

  'banana-oat-cookies': {
    emoji: '🍪',
    color: 'rgba(200,150,60,0.08)',
    tagline: 'Two-ingredient cookies — naturally sweet, actually filling',
    options: [
      {
        name: 'Classic Banana Oat Cookies',
        emoji: '🍌',
        time: '18 min',
        steps: [
          'Preheat oven to 180°C. Line a baking sheet.',
          'Mash 1 very ripe banana completely smooth in a bowl.',
          'Stir in ½ cup rolled oats until combined.',
          'Spoon small rounds onto the baking sheet (about 1 tbsp each).',
          'Bake 12–14 min until lightly golden. Cool on the tray — they firm as they cool.',
        ],
        tip: 'These are the entire recipe — 2 ingredients. They taste sweet from the banana alone.',
      },
      {
        name: 'Chocolate Chip Oat Cookies',
        emoji: '🍫',
        time: '18 min',
        steps: [
          'Preheat oven to 180°C.',
          'Mash 1 banana + ½ cup oats + a pinch of cinnamon.',
          'Stir in 1 tbsp dark chocolate chips (70%+ cacao only).',
          'Spoon onto lined baking sheet.',
          'Bake 12–14 min. Cool fully before eating.',
        ],
        tip: '70%+ dark chocolate has significantly less sugar than milk chocolate and adds magnesium and antioxidants.',
      },
      {
        name: 'Cinnamon Raisin Cookies',
        emoji: '🌀',
        time: '18 min',
        steps: [
          'Preheat oven to 180°C.',
          'Mash 1 banana + ½ cup oats + ½ tsp cinnamon.',
          'Add a small handful of raisins (about 1 tbsp) and mix.',
          'Spoon onto lined baking sheet.',
          'Bake 12–14 min. Cool before eating.',
        ],
        tip: 'Raisins add iron and natural fructose — sweet but with a lower glycaemic impact than sugar.',
      },
    ],
  },

};
