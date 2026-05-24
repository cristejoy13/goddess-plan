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
