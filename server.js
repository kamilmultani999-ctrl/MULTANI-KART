
const express = require("express");
const path = require("path");
const session = require("express-session");
const crypto = require("crypto");
const { Pool } = require("pg");
const PgSession = require("connect-pg-simple")(session);

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET) {
  console.error("Render Environment માં DATABASE_URL અને SESSION_SECRET જરૂરી છે.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE === "disable" ? false : { rejectUnauthorized: false },
  max: 5,
  connectionTimeoutMillis: 15000
});

app.set("trust proxy", 1);
app.use(express.json({ limit: "100kb" }));

app.use(session({
  store: new PgSession({
    pool,
    tableName: "user_sessions",
    createTableIfMissing: true
  }),
  name: "multani_kart_session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 4 * 60 * 60 * 1000
  }
}));

app.use(express.static(path.join(__dirname, "public")));

const seedProducts = [
  ["Amul Taaza Milk 500ml","Dairy",30,40,"Nandasan Dairy"],
  ["Amul Gold Milk 500ml","Dairy",35,30,"Nandasan Dairy"],
  ["Curd 500g","Dairy",35,20,"Nandasan Dairy"],
  ["Paneer 200g","Dairy",85,15,"Nandasan Dairy"],
  ["Amul Butter 100g","Dairy",62,20,"Nandasan Dairy"],
  ["Cheese Slices 200g","Dairy",125,12,"Nandasan Dairy"],
  ["Potato 1kg","Vegetables",30,60,"Fresh Veg Corner"],
  ["Tomato 1kg","Vegetables",35,50,"Fresh Veg Corner"],
  ["Onion 1kg","Vegetables",40,60,"Fresh Veg Corner"],
  ["Green Chilli 100g","Vegetables",12,35,"Fresh Veg Corner"],
  ["Coriander Bunch","Vegetables",10,30,"Fresh Veg Corner"],
  ["Lemon 4 pcs","Vegetables",20,30,"Fresh Veg Corner"],
  ["Cucumber 500g","Vegetables",25,20,"Fresh Veg Corner"],
  ["Carrot 500g","Vegetables",30,18,"Fresh Veg Corner"],
  ["Cauliflower 1 pc","Vegetables",35,15,"Fresh Veg Corner"],
  ["Banana 6 pcs","Fruits",35,20,"Fruit Shop"],
  ["Apple 4 pcs","Fruits",120,15,"Fruit Shop"],
  ["Orange 1kg","Fruits",80,15,"Fruit Shop"],
  ["Papaya 1 pc","Fruits",50,10,"Fruit Shop"],
  ["Wheat Flour 5kg","Grocery",220,15,"Shree Kirana"],
  ["Basmati Rice 1kg","Grocery",95,25,"Shree Kirana"],
  ["Regular Rice 5kg","Grocery",280,18,"Shree Kirana"],
  ["Sugar 1kg","Grocery",46,30,"Shree Kirana"],
  ["Toor Dal 1kg","Grocery",155,20,"Shree Kirana"],
  ["Moong Dal 1kg","Grocery",125,20,"Shree Kirana"],
  ["Chana Dal 1kg","Grocery",85,20,"Shree Kirana"],
  ["Besan 500g","Grocery",55,20,"Shree Kirana"],
  ["Poha 500g","Grocery",35,25,"Shree Kirana"],
  ["Sooji 500g","Grocery",32,25,"Shree Kirana"],
  ["Cooking Oil 1L","Grocery",145,24,"Shree Kirana"],
  ["Groundnut Oil 1L","Grocery",175,15,"Shree Kirana"],
  ["Salt 1kg","Grocery",22,40,"Shree Kirana"],
  ["Tea 250g","Grocery",115,15,"Shree Kirana"],
  ["Coffee 100g","Grocery",95,12,"Shree Kirana"],
  ["Turmeric Powder 200g","Grocery",48,15,"Shree Kirana"],
  ["Red Chilli Powder 200g","Grocery",65,15,"Shree Kirana"],
  ["Garam Masala 100g","Grocery",55,12,"Shree Kirana"],
  ["Jeera 100g","Grocery",38,15,"Shree Kirana"],
  ["Parle-G Biscuits","Snacks",10,100,"Daily Needs Store"],
  ["Good Day Biscuits","Snacks",30,40,"Daily Needs Store"],
  ["Potato Chips","Snacks",20,45,"Daily Needs Store"],
  ["Namkeen 200g","Snacks",45,20,"Daily Needs Store"],
  ["Chocolate Bar","Snacks",20,30,"Daily Needs Store"],
  ["Cold Drink 750ml","Beverages",40,24,"Daily Needs Store"],
  ["Packaged Water 1L","Beverages",20,60,"Daily Needs Store"],
  ["Fruit Juice 1L","Beverages",110,12,"Daily Needs Store"],
  ["Dishwash Bar","Home Care",25,35,"Daily Needs Store"],
  ["Detergent Powder 1kg","Home Care",95,20,"Daily Needs Store"],
  ["Bath Soap","Personal Care",35,35,"Daily Needs Store"],
  ["Shampoo Sachet Pack","Personal Care",45,20,"Daily Needs Store"],
  ["Toothpaste 150g","Personal Care",95,15,"Daily Needs Store"],
  ["Toilet Paper Roll","Home Care",35,18,"Daily Needs Store"],
  ["Incense Sticks","Household",25,25,"Daily Needs Store"],
  ["Disposable Plates 10 pcs","Household",40,15,"Daily Needs Store"],
  ["Veg Gujarati Thali","Hotel Food",120,20,"Nandasan Food Corner"],
  ["Full Gujarati Thali","Hotel Food",160,20,"Nandasan Food Corner"],
  ["Dal Rice","Hotel Food",80,20,"Nandasan Food Corner"],
  ["Jeera Rice","Hotel Food",90,15,"Nandasan Food Corner"],
  ["Veg Pulao","Hotel Food",110,15,"Nandasan Food Corner"],
  ["Paneer Butter Masala","Hotel Food",180,12,"Nandasan Food Corner"],
  ["Sev Tameta Shaak","Hotel Food",100,15,"Nandasan Food Corner"],
  ["Mix Veg Shaak","Hotel Food",130,15,"Nandasan Food Corner"],
  ["Butter Roti","Hotel Food",18,100,"Nandasan Food Corner"],
  ["Tandoori Roti","Hotel Food",15,100,"Nandasan Food Corner"],
  ["Butter Naan","Hotel Food",35,60,"Nandasan Food Corner"],
  ["Plain Paratha","Hotel Food",35,40,"Nandasan Food Corner"],
  ["Masala Dosa","Hotel Food",90,15,"South Indian Cafe"],
  ["Idli Sambhar 4 pcs","Hotel Food",70,15,"South Indian Cafe"],
  ["Vada Pav","Hotel Food",25,40,"Nandasan Snacks"],
  ["Samosa 2 pcs","Hotel Food",30,40,"Nandasan Snacks"],
  ["Dabeli","Hotel Food",25,40,"Nandasan Snacks"],
  ["Pav Bhaji","Hotel Food",100,15,"Nandasan Snacks"],
  ["Veg Sandwich","Hotel Food",70,15,"Nandasan Snacks"],
  ["Cheese Pizza","Hotel Food",180,10,"Nandasan Pizza Point"],
  ["Veg Burger","Hotel Food",80,15,"Nandasan Pizza Point"],
  ["French Fries","Hotel Food",90,15,"Nandasan Pizza Point"],
  ["Manchurian Dry","Hotel Food",120,12,"Nandasan Chinese Corner"],
  ["Veg Hakka Noodles","Hotel Food",110,12,"Nandasan Chinese Corner"],
  ["Veg Fried Rice","Hotel Food",110,12,"Nandasan Chinese Corner"],
  ["Masala Chai","Hotel Food",15,100,"Nandasan Tea Stall"],
  ["Coffee","Hotel Food",25,60,"Nandasan Tea Stall"],
  ["Cold Coffee","Hotel Food",70,15,"Nandasan Tea Stall"],
  ["Gulab Jamun 2 pcs","Sweets",40,20,"Nandasan Sweets"],
  ["Jalebi 250g","Sweets",70,15,"Nandasan Sweets"],
  ["Kaju Katli 250g","Sweets",220,8,"Nandasan Sweets"]
];

const safeStatuses = [
  "New", "Accepted", "Packed",
  "Out for Delivery", "Delivered", "Cancelled"
];

function safeEqual(a, b) {
  const x = Buffer.from(String(a || ""));
  const y = Buffer.from(String(b || ""));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function normalizePhone(value) {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  return digits;
}

function hashPassword(password, salt) {
  return crypto.scryptSync(String(password), salt, 64).toString("hex");
}

function requireAdmin(req, res, next) {
  if (req.session?.role === "admin") return next();
  res.status(401).json({ error: "Admin login જરૂરી છે." });
}

function requireCustomer(req, res, next) {
  if (req.session?.role === "customer" && req.session.customerId) return next();
  res.status(401).json({ error: "પહેલાં Customer Login કરો." });
}

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.products (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
      stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
      shop TEXT NOT NULL DEFAULT 'Local Store',
      active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1))
    );

    CREATE TABLE IF NOT EXISTS public.customers (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public.orders (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      customer_id BIGINT REFERENCES public.customers(id),
      customer TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      payment TEXT NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'Pending',
      total NUMERIC(12,2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'New',
      items_json JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE public.orders
      ADD COLUMN IF NOT EXISTS customer_id BIGINT REFERENCES public.customers(id);
    ALTER TABLE public.orders
      ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'Pending';
    ALTER TABLE public.orders
      ADD COLUMN IF NOT EXISTS items_json JSONB;
  `);

  const count = await pool.query("SELECT COUNT(*)::int AS n FROM public.products");
  if (count.rows[0].n === 0) {
    for (const p of seedProducts) {
      await pool.query(
        "INSERT INTO public.products (name,category,price,stock,shop) VALUES ($1,$2,$3,$4,$5)",
        p
      );
    }
  }
}

app.get("/api/health", (req, res) =>
  res.json({ ok: true, app: "MULTANI KART", area: "Nandasan" })
);

app.get("/api/payment-config", (req, res) => res.json({
  upiId: process.env.UPI_ID || "",
  payeeName: process.env.PAYMENT_NAME || "MULTANI KART",
  whatsappNumber: String(process.env.ORDER_WHATSAPP_NUMBER || "").replace(/\D/g, "")
}));

app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    return res.status(503).json({ error: "Render માં ADMIN_USERNAME અને ADMIN_PASSWORD સેટ કરો." });
  }
  if (!safeEqual(username, process.env.ADMIN_USERNAME) ||
      !safeEqual(password, process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ error: "Username અથવા Password ખોટો છે." });
  }
  req.session.regenerate(err => {
    if (err) return res.status(500).json({ error: "Session બનાવી શકાયું નહીં." });
    req.session.role = "admin";
    req.session.save(err2 => {
      if (err2) return res.status(500).json({ error: "Login સાચવી શકાયું નહીં." });
      res.json({ ok: true, role: "admin" });
    });
  });
});

app.post("/api/logout", (req, res) => req.session.destroy(() => {
  res.clearCookie("multani_kart_session");
  res.clearCookie("multani_kart_admin");
  res.json({ ok: true });
}));

app.get("/api/me", (req, res) => res.json({
  authenticated: req.session?.role === "admin",
  role: req.session?.role || null
}));

app.post("/api/customer/register", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const phone = normalizePhone(req.body?.phone);
  const password = String(req.body?.password || "");

  if (name.length < 2 || name.length > 80)
    return res.status(400).json({ error: "તમારું સાચું નામ દાખલ કરો." });
  if (!/^[6-9]\d{9}$/.test(phone))
    return res.status(400).json({ error: "10 અંકનો મોબાઇલ નંબર દાખલ કરો." });
  if (password.length < 8 || password.length > 128)
    return res.status(400).json({ error: "પાસવર્ડ ઓછામાં ઓછા 8 અક્ષરનો હોવો જોઈએ." });

  const salt = crypto.randomBytes(16).toString("hex");
  try {
    const result = await pool.query(
      `INSERT INTO public.customers (name,phone,password_hash,password_salt)
       VALUES ($1,$2,$3,$4) RETURNING id,name,phone,created_at`,
      [name, phone, hashPassword(password, salt), salt]
    );
    const c = result.rows[0];
    req.session.regenerate(err => {
      if (err) return res.status(500).json({ error: "Session બનાવી શકાયું નહીં." });
      req.session.role = "customer";
      req.session.customerId = Number(c.id);
      req.session.save(err2 => {
        if (err2) return res.status(500).json({ error: "Session સાચવી શકાયું નહીં." });
        res.status(201).json({ ok: true, customer: c });
      });
    });
  } catch (err) {
    if (err.code === "23505")
      return res.status(409).json({ error: "આ મોબાઇલ નંબરનું એકાઉન્ટ પહેલેથી છે." });
    console.error(err);
    res.status(500).json({ error: "એકાઉન્ટ બનાવી શકાયું નહીં." });
  }
});

app.post("/api/customer/login", async (req, res) => {
  const phone = normalizePhone(req.body?.phone);
  const password = String(req.body?.password || "");
  if (!/^[6-9]\d{9}$/.test(phone))
    return res.status(400).json({ error: "યોગ્ય મોબાઇલ નંબર દાખલ કરો." });

  try {
    const result = await pool.query(
      "SELECT id,name,phone,password_hash,password_salt FROM public.customers WHERE phone=$1",
      [phone]
    );
    const c = result.rows[0];
    const hash = hashPassword(password, c ? c.password_salt : "unknown-salt");
    if (!c || !safeEqual(hash, c.password_hash))
      return res.status(401).json({ error: "મોબાઇલ નંબર અથવા પાસવર્ડ ખોટો છે." });

    req.session.regenerate(err => {
      if (err) return res.status(500).json({ error: "Session બનાવી શકાયું નહીં." });
      req.session.role = "customer";
      req.session.customerId = Number(c.id);
      req.session.save(err2 => {
        if (err2) return res.status(500).json({ error: "Session સાચવી શકાયું નહીં." });
        res.json({ ok: true, customer: { id: Number(c.id), name: c.name, phone: c.phone } });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login થઈ શક્યું નહીં." });
  }
});

app.post("/api/customer/logout", (req, res) => {
  if (req.session?.role !== "customer")
    return res.status(401).json({ error: "Customer Login નથી." });
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "Logout થઈ શક્યું નહીં." });
    res.clearCookie("multani_kart_session");
    res.json({ ok: true });
  });
});

app.get("/api/customer/me", requireCustomer, async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT id,name,phone,created_at FROM public.customers WHERE id=$1",
      [req.session.customerId]
    );
    if (!r.rows[0]) return res.status(401).json({ error: "Customer account મળ્યું નહીં." });
    res.json({ authenticated: true, customer: r.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Customer વિગતો મળી નહીં." });
  }
});

app.get("/api/customer/orders", requireCustomer, async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT * FROM public.orders WHERE customer_id=$1 ORDER BY id DESC",
      [req.session.customerId]
    );
    res.json(r.rows.map(o => ({
      ...o,
      total: Number(o.total),
      items: typeof o.items_json === "string" ? JSON.parse(o.items_json) : o.items_json
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "તમારા ઓર્ડર મળી શક્યા નહીં." });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const all = req.query.all === "1" && req.session?.role === "admin";
    let sql = "SELECT * FROM public.products";
    const params = [];
    if (!all) sql += " WHERE active=1";
    if (q) {
      sql += all
        ? " WHERE (name ILIKE $1 OR category ILIKE $1 OR shop ILIKE $1)"
        : " AND (name ILIKE $1 OR category ILIKE $1 OR shop ILIKE $1)";
      params.push(`%${q}%`);
    }
    sql += " ORDER BY category,name";
    const r = await pool.query(sql, params);
    res.json(r.rows.map(p => ({ ...p, price: Number(p.price) })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "વસ્તુઓ લોડ થઈ શકી નહીં." });
  }
});

app.post("/api/products", requireAdmin, async (req, res) => {
  const { name, category, price, stock, shop } = req.body || {};
  if (!String(name || "").trim() || !String(category || "").trim() ||
      !Number.isFinite(Number(price)) || Number(price) < 0 ||
      !Number.isFinite(Number(stock)) || Number(stock) < 0)
    return res.status(400).json({ error: "વસ્તુ, કેટેગરી, ભાવ અને સ્ટોક તપાસો." });

  try {
    const r = await pool.query(
      `INSERT INTO public.products (name,category,price,stock,shop)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [String(name).trim(), String(category).trim(), Number(price),
       Math.floor(Number(stock)), String(shop || "Local Store").trim()]
    );
    res.json({ ...r.rows[0], price: Number(r.rows[0].price) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "વસ્તુ ઉમેરી શકાઈ નહીં." });
  }
});

app.patch("/api/products/:id", requireAdmin, async (req, res) => {
  const b = req.body || {};
  try {
    const old = await pool.query("SELECT * FROM public.products WHERE id=$1", [req.params.id]);
    const p = old.rows[0];
    if (!p) return res.status(404).json({ error: "Product not found" });

    const name = String(b.name ?? p.name).trim();
    const category = String(b.category ?? p.category).trim();
    const price = Number(b.price ?? p.price);
    const stock = Number(b.stock ?? p.stock);
    const active = Number(b.active ?? p.active);
    const shop = String(b.shop ?? p.shop).trim();

    if (!name || !category || !Number.isFinite(price) || price < 0 ||
        !Number.isFinite(stock) || stock < 0 || ![0,1].includes(active))
      return res.status(400).json({ error: "વસ્તુની વિગતો તપાસો." });

    const r = await pool.query(
      `UPDATE public.products SET name=$1,category=$2,price=$3,stock=$4,
       shop=$5,active=$6 WHERE id=$7 RETURNING *`,
      [name, category, price, Math.floor(stock), shop, active, p.id]
    );
    res.json({ ...r.rows[0], price: Number(r.rows[0].price) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "વસ્તુ અપડેટ થઈ શકી નહીં." });
  }
});

app.post("/api/orders", requireCustomer, async (req, res) => {
  const { address, payment, items } = req.body || {};
  if (!String(address || "").trim() || String(address).trim().length < 4 ||
      String(address).length > 500 || !Array.isArray(items) || !items.length || items.length > 50)
    return res.status(400).json({ error: "સરનામું અને કાર્ટની વસ્તુઓ તપાસો." });
  if (!["COD","ONLINE"].includes(payment))
    return res.status(400).json({ error: "Invalid payment method" });
  if (payment === "ONLINE" && !process.env.UPI_ID)
    return res.status(503).json({ error: "હાલ Cash on Delivery પસંદ કરો." });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const cr = await client.query(
      "SELECT id,name,phone FROM public.customers WHERE id=$1 FOR SHARE",
      [req.session.customerId]
    );
    const c = cr.rows[0];
    if (!c) throw new Error("Customer Login ફરી કરો.");

    const normalized = [];
    let total = 0;

    for (const item of items) {
      const qty = Math.floor(Number(item.qty));
      if (!Number.isFinite(qty) || qty < 1 || qty > 99)
        throw new Error("વસ્તુની quantity તપાસો.");

      const pr = await client.query(
        "SELECT * FROM public.products WHERE id=$1 AND active=1 FOR UPDATE",
        [Number(item.id)]
      );
      const p = pr.rows[0];
      if (!p || Number(p.stock) < qty)
        throw new Error(`Stock unavailable for ${p ? p.name : "a product"}`);

      await client.query("UPDATE public.products SET stock=stock-$1 WHERE id=$2", [qty,p.id]);
      normalized.push({
        id: Number(p.id), name: p.name, price: Number(p.price), qty, shop: p.shop
      });
      total += Number(p.price) * qty;
    }

    const r = await client.query(
      `INSERT INTO public.orders
       (customer_id,customer,phone,address,payment,payment_status,total,status,items_json)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'New',$8::jsonb) RETURNING *`,
      [c.id,c.name,c.phone,String(address).trim(),payment,
       payment === "COD" ? "Pay on delivery" : "Awaiting UPI payment confirmation",
       total,JSON.stringify(normalized)]
    );

    await client.query("COMMIT");
    res.status(201).json({ ...r.rows[0], total: Number(r.rows[0].total), items: normalized });
  } catch (err) {
    await client.query("ROLLBACK");
    if (String(err.message).includes("Stock unavailable") ||
        String(err.message).includes("quantity") ||
        String(err.message).includes("Login"))
      return res.status(400).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: "ઓર્ડર સાચવી શકાયો નહીં." });
  } finally {
    client.release();
  }
});

app.get("/api/orders", requireAdmin, async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM public.orders ORDER BY id DESC");
    res.json(r.rows.map(o => ({
      ...o,
      total: Number(o.total),
      items: typeof o.items_json === "string" ? JSON.parse(o.items_json) : o.items_json
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ઓર્ડર લોડ થઈ શક્યા નહીં." });
  }
});

app.patch("/api/orders/:id/status", requireAdmin, async (req, res) => {
  const status = String(req.body?.status || "");
  if (!safeStatuses.includes(status))
    return res.status(400).json({ error: "Invalid status" });
  try {
    const r = await pool.query(
      "UPDATE public.orders SET status=$1 WHERE id=$2 RETURNING *",
      [status,req.params.id]
    );
    if (!r.rows[0]) return res.status(404).json({ error: "Order not found" });
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ઓર્ડર સ્ટેટસ અપડેટ થઈ શક્યું નહીં." });
  }
});

app.patch("/api/orders/:id/payment", requireAdmin, async (req, res) => {
  const status = String(req.body?.payment_status || "");
  if (!["Awaiting UPI payment confirmation","Paid","Failed","Pay on delivery"].includes(status))
    return res.status(400).json({ error: "Invalid payment status" });
  try {
    const r = await pool.query(
      "UPDATE public.orders SET payment_status=$1 WHERE id=$2 RETURNING *",
      [status,req.params.id]
    );
    if (!r.rows[0]) return res.status(404).json({ error: "Order not found" });
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment status અપડેટ થઈ શક્યો નહીં." });
  }
});

app.get("/api/admin/summary", requireAdmin, async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM public.orders) AS orders,
        (SELECT COALESCE(SUM(total),0)::numeric FROM public.orders WHERE status <> 'Cancelled') AS revenue,
        (SELECT COUNT(*)::int FROM public.orders WHERE status NOT IN ('Delivered','Cancelled')) AS pending,
        (SELECT COUNT(*)::int FROM public.products WHERE active=1) AS products
    `);
    const x = r.rows[0];
    res.json({
      orders: x.orders,
      revenue: Number(x.revenue),
      pending: x.pending,
      products: x.products
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Admin summary મળી શક્યું નહીં." });
  }
});

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

async function start() {
  try {
    await pool.query("SELECT 1");
    await initializeDatabase();
    app.listen(PORT, () => console.log("MULTANI KART running on port " + PORT));
  } catch (err) {
    console.error("Database startup failed:", err.message);
    process.exit(1);
  }
}

process.on("SIGTERM", async () => {
  await pool.end();
  process.exit(0);
});
process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});

start();
