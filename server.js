const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const User = require('./models/User');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

const app = express();
const port = process.env.PORT || 3000;

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ✅ Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secretKey123',
  resave: false,
  saveUninitialized: false
}));

// ✅ Sample Product Data
const products = [
  {
    productId: "1",
    name: "beetroot malt",
    price: 1000,
    image: ["/images/beet.webp", "/images/beetbox.webp"],
    category: "malt",
    description: `Beetroot Malt is a delicious and nutritious health drink mix made from carefully dried and powdered organic beetroot.`,
    benefits: [
      "Boosts blood circulation due to high nitrate content",
      "Helps maintain healthy blood pressure levels",
      "Improves stamina and athletic performance"
    ]

  }, { productId: "2", name: "Honey", price: 700, image:[ "/images/honey.jpg","/images/honeyharvest.webp","/images/honey1.webp"], category: "sweetener", description: `Honey is a natural sweetener produced by bees from the nectar of flowers. It has been used for centuries for its nutritional, medicinal, and culinary benefits.`
 ,benefits: [
    "Rich in antioxidants that protect cells from damage",
    "Contains antibacterial and antifungal properties",
    "Promotes healing of wounds and burns",
    "Boosts energy levels and immunity",
    "Relieves sore throat and cough",
    "Improves digestion and gut health",
    "Helps manage seasonal allergies"
  ]},
  { productId: "3", name: "Gulkanth", price: 600, image: ["/images/Gulkand.jpg","/images/gulkrose.jpg"], category: "sweetener", description: "Traditional rose petal preserve, good for digestion and cooling the body.",benefits:["Cools the body internally and reduces heat.",
  "Improves digestion and relieves constipation.",
  "Boosts energy and reduces fatigue.",
  "Purifies blood and improves skin health.",
  "Helps relieve menstrual discomfort.",
  "Freshens breath naturally.",
  "Enhances memory and promotes better sleep.",
  "Soothes mouth ulcers.",
  "Supports hormonal balance and reproductive health.",
  "Rich in antioxidants and supports immunity."] },
  { productId: "4", name: "ABC malt", price: 1200, image: ["/images/abc.webp","/images/ABC1.jpg"], category: "malt" , description: "ABC Malt is crafted with 100% organic ingredients that nourish your body and respect the planet. From organically grown barley to naturally sourced sweeteners, every sip reflects our commitment to purity, sustainability, and taste",benefits:[ "Boosts immunity with vitamins and antioxidants.",
  "Improves hemoglobin and fights anemia.",
  "Promotes clear, glowing skin.",
  "Supports vision and eye health.",
  "Detoxifies liver and flushes out toxins.",
  "Aids digestion and improves gut health.",
  "Enhances brain function and memory.",
  "Provides natural energy without caffeine.",
  "Improves heart health and circulation.",
  "Reduces internal inflammation naturally."]},
  { productId: "5", name: "Palmsugar", price: 700, image: ["/images/palmsugar.webp","/images/palmclimb.webp"], category: "sweetener", description: `Palm sugar is a traditional natural sweetener derived from the sap of various palm trees such as coconut palm, date palm, or palmyra palm. It is unrefined, chemical-free, and retains many nutrients that are usually stripped away in white sugar processing. With its rich, caramel-like flavor and a deep golden-brown color, palm sugar is not only a healthier alternative but also adds a delightful taste to your dishes.
Prepared using age-old methods without artificial preservatives, palm sugar is ideal for sweetening beverages, desserts, traditional sweets, and even savory sauces.`,benefits:[ "Has a low glycemic index, making it suitable for people with blood sugar concerns.",
  "Contains essential minerals like iron, zinc, calcium, and potassium.",
  "Rich in antioxidants that help fight free radicals and boost immunity.",
  "Supports healthy digestion due to its unrefined natural composition.",
  "Acts as a natural energy booster without causing sudden sugar crashes.",
  "Helps in improving metabolism and reducing fatigue.",
  "Less processed than white sugar, retaining more nutrients and fiber.",
  "Promotes better gut health by acting as a prebiotic."] },
  { productId: "6", name: "Coconutsugar", price: 500, image: ["/images/coconut sugar.jpeg","/images/coconutclimb.webp"], category: "sweetener", description: `Coconut sugar is a natural sweetener derived from the sap of coconut palm flowers. It has a rich, caramel-like flavor and is considered a healthier alternative to refined white sugar. Unlike highly processed sugars, coconut sugar retains many nutrients found in the coconut palm, making it a popular choice for health-conscious individuals. It blends well in teas, coffee, baking, and desserts.`,benefits:[ "Low glycemic index, helps manage blood sugar levels.",
  "Contains minerals like iron, zinc, calcium, and potassium.",
  "Rich in antioxidants that help fight oxidative stress.",
  "Retains natural vitamins due to minimal processing.",
  "Supports sustained energy levels without sugar crashes.",
  "Contains inulin, a prebiotic fiber that supports gut health.",
  "Natural and unrefined—no artificial chemicals or additives.",
  "Suitable for vegan, paleo, and whole-food diets."] },
  { productId: "7", name: "Maapilai samba rice", price: 120, image: ["/images/mapilaisamba.jpg","/images/ms.webp","/images/mapilairice.webp"], category: "rice" , description: `Mapillai Samba, also known as “Bridegroom’s Rice,” is a traditional red rice variety grown in Tamil Nadu, India. It gets its name from ancient customs where newly married men were given this rice to boost strength and stamina. This rice is unpolished, rich in iron and nutrients, and is known for its deep red color and earthy flavor. Mapillai Samba is a staple in organic diets and is commonly used in porridge, idlis, dosas, and rice bowls.`,benefits:[  "Rich in iron, improves hemoglobin and combats anemia.",
  "High fiber content aids digestion and prevents constipation.",
  "Boosts stamina, strength, and endurance—traditionally given to bridegrooms.",
  "Low glycemic index helps manage blood sugar levels.",
  "Packed with antioxidants, supports overall immunity.",
  "Strengthens muscles and bones due to natural minerals.",
  "Helps in weight management by keeping you full for longer.",
  "Gluten-free and suitable for people with gluten intolerance."]},
  { productId: "8", name: "thooyamalli rice", price: 90, image: ["/images/thooyamalli.webp","/images/TM.webp"], category: "rice", description: `Thooya Malli rice, named after its jasmine-like appearance (Thooya = pure, Malli = jasmine), is a traditional rice variety from Tamil Nadu. This short-grain rice is aromatic, soft in texture, and easy to cook. It is highly regarded for its natural taste, quick cooking time, and suitability for daily consumption. Free from polishing and chemical treatments, Thooya Malli retains its natural nutrients and is an excellent choice for those seeking a healthier alternative to modern white rice.`,benefits:[ "Easily digestible and gentle on the stomach—ideal for all age groups.",
  "Rich in fiber, supports better digestion and gut health.",
  "Contains essential minerals like iron and magnesium.",
  "Helps maintain steady energy levels throughout the day.",
  "Aromatic and naturally tasty—no need for excess spices or ghee.",
  "Free from polishing—retains natural nutrients.",
  "Suitable for preparing daily meals like pongal, idli, dosa, and plain rice.",
    "Supports healthy metabolism and strengthens immunity over time."]
  },
  { productId: "9", name: "Coconutoil soap", price: 80, image: ["/images/coconutoilsoap.jpg"], category: "soap", description:`Indulge in the pure essence of tropical wellness with our Coconut Oil Soap. Handcrafted with cold-pressed coconut oil and other natural ingredients, it gently cleanses while deeply nourishing your skin. The rich lather pampers you with moisturizing goodness, leaving your skin feeling soft, refreshed, and delicately scented.`,benefits:["🥥 Deep Hydration: Coconut oil penetrates deeply for long-lasting moisture",

"🌿 Gentle & Natural: Free from harsh chemicals and synthetic additives",

"✨ Antibacterial & Antifungal: Supports healthy, blemish-free skin",

"🌸 Delicate Fragrance: Light tropical aroma for a refreshing experience",

"🍃 Eco-Friendly & Biodegradable: Kind to your skin and the environment",

    "💆 Suitable for All Skin Types: Even sensitive and baby-soft skin",]
  },
  { productId: "10", name: "Multani soap", price: 80, image:["/images/multanimittisoap.webp"],category:"soap",description:`Multani Mitti Soap is a natural skincare solution made with the goodness of Fuller's Earth (Multani Mitti), known for its deep-cleansing and oil-absorbing properties. This herbal soap gently removes dirt, excess oil, and dead skin cells, leaving your skin refreshed, soft, and smooth. Ideal for oily and acne-prone skin, it helps maintain a healthy, clear complexion without harsh chemicals. Crafted with natural ingredients, this soap is free from parabens, artificial fragrances, and sulfates, making it safe for daily use.`,benefits:[ "Deeply cleanses skin and unclogs pores.",
  "Absorbs excess oil and reduces greasiness.",
  "Helps prevent acne, pimples, and blackheads.",
  "Removes dead skin cells for a natural glow.",
  "Soothes skin irritation and inflammation.",
  "Improves skin texture and clarity.",
  "Gives a cooling and refreshing effect after use.",
  "Free from parabens, sulfates, and artificial fragrances."]},
  { productId: "11", name: "charcoal soap", price: 80, image: ["/images/charcoal.jpg"], category: "soap", description:`Indulge in the pure essence of tropical wellness with our Coconut Oil Soap. Handcrafted with cold-pressed coconut oil and other natural ingredients, it gently cleanses while deeply nourishing your skin. The rich lather pampers you with moisturizing goodness, leaving your skin feeling soft, refreshed, and delicately scented.`,benefits:["🥥 Deep Hydration: Coconut oil penetrates deeply for long-lasting moisture",

"🌿 Gentle & Natural: Free from harsh chemicals and synthetic additives",

"✨ Antibacterial & Antifungal: Supports healthy, blemish-free skin",

"🌸 Delicate Fragrance: Light tropical aroma for a refreshing experience",

"🍃 Eco-Friendly & Biodegradable: Kind to your skin and the environment",

    "💆 Suitable for All Skin Types: Even sensitive and baby-soft skin",]
  },
   { productId: "11", name: "Bio-enzyme", price: 80, image: ["/images/bioenzyme.jpg"], category: "soap", description:`Indulge in the pure essence of tropical wellness with our Coconut Oil Soap. Handcrafted with cold-pressed coconut oil and other natural ingredients, it gently cleanses while deeply nourishing your skin. The rich lather pampers you with moisturizing goodness, leaving your skin feeling soft, refreshed, and delicately scented.`,benefits:["🥥 Deep Hydration: Coconut oil penetrates deeply for long-lasting moisture",

"🌿 Gentle & Natural: Free from harsh chemicals and synthetic additives",

"✨ Antibacterial & Antifungal: Supports healthy, blemish-free skin",

"🌸 Delicate Fragrance: Light tropical aroma for a refreshing experience",

"🍃 Eco-Friendly & Biodegradable: Kind to your skin and the environment",

    "💆 Suitable for All Skin Types: Even sensitive and baby-soft skin",]
  }
];

// ---------------------- Product API ----------------------
app.get('/api/products', (req, res) => {
  res.json(products);
});

// ---------------------- Cart API ----------------------

// ✅ Add to Cart (defaults quantity to 1)
app.post('/api/cart', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Not logged in" });

  const { name, price } = req.body;
  const quantity = 1;

  try {
    let cart = await Cart.findOne({ userId: req.session.userId });
    if (!cart) cart = new Cart({ userId: req.session.userId, items: [] });

    const item = cart.items.find(i => i.name === name);
    if (item) item.quantity += quantity;
    else cart.items.push({ name, price, quantity });

    await cart.save();
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Add to cart error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get Cart
app.get('/api/cart', async (req, res) => {
  if (!req.session.userId) return res.json({ items: [] });

  const cart = await Cart.findOne({ userId: req.session.userId });
  res.json({ items: cart?.items || [] });
});

// ✅ Remove Item by Index
app.delete('/api/cart/remove/:index', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Not logged in" });

  const cart = await Cart.findOne({ userId: req.session.userId });
  if (!cart) return res.status(400).json({ error: "No cart" });

  cart.items.splice(req.params.index, 1);
  await cart.save();
  res.json({ message: "Item removed" });
});

// ---------------------- User Auth ----------------------
app.post('/api/register', async (req, res) => {
  const { username, email, password, mobile, address, pincode } = req.body;

  if (!username || !email || !password || !mobile || !address || !pincode) {
    return res.json({ success: false, message: "All fields are required." });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.json({ success: false, message: "User already exists" });

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hash, mobile, address, pincode });

  await user.save();
  req.session.userId = user._id;
  res.json({ success: true });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false, message: "Not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ success: false, message: "Wrong password" });

  req.session.userId = user._id;
  res.json({ success: true });
});

app.get('/api/user', async (req, res) => {
  if (!req.session.userId) return res.json({ loggedIn: false });

  const user = await User.findById(req.session.userId);
  res.json({ loggedIn: true, email: user.email });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

app.get('/api/user-details', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });

  const user = await User.findById(req.session.userId).lean();
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { username, email, mobile, address, pincode } = user;
  res.json({ username, email, mobile, address, pincode });
});

// ---------------------- Fake Payment (Order) ----------------------
app.post("/api/fake-payment", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ success: false, message: "Not logged in" });

  const { amount } = req.body;
  const cart = await Cart.findOne({ userId: req.session.userId });

  if (!cart || cart.items.length === 0) {
    return res.json({ success: false, message: "Cart is empty" });
  }

  const order = new Order({
    userId: req.session.userId,
    items: cart.items,
    amount,
    paidAt: new Date()
  });

  await order.save();
  await Cart.deleteOne({ userId: req.session.userId });
  res.json({ success: true, message: "Order placed successfully" });
});

// ---------------------- Admin Cart View ----------------------
app.get('/api/cart/admin-view', async (req, res) => {
  try {
    const carts = await Cart.find().populate('userId');
    const result = carts.map(cart => ({
      username: cart.userId.username,
      mobile: cart.userId.mobile,
      address: cart.userId.address,
      pincode: cart.userId.pincode,
      items: cart.items
    }));

    res.json(result);
  } catch (err) {
    console.error('Error fetching admin cart:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------------------- Start Server ----------------------
app.listen(port, () => console.log(`🚀 Server running at: http://localhost:${port}`));
