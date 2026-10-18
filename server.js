const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");
const session = require("express-session");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
app.set("trust proxy", 1);
app.use(express.json({ limit: "100kb" }));
app.use(session({
  name: "multani_kart_admin",
  secret: process.env.SESSION_SECRET || "development-only-change-this-before-live-" + crypto.randomBytes(16).toString("hex"),
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 4 * 60 * 60 * 1000 }
}));
const db = new Database("multani-kart.db");
app.use(express.static(path.join(__dirname, "public")));

db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category TEXT NOT NULL,
  price REAL NOT NULL, stock INTEGER NOT NULL DEFAULT 0, shop TEXT NOT NULL DEFAULT 'Local Store',
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT, customer TEXT NOT NULL, phone TEXT NOT NULL,
  address TEXT NOT NULL, payment TEXT NOT NULL, payment_status TEXT NOT NULL DEFAULT 'Pending',
  total REAL NOT NULL, status TEXT NOT NULL DEFAULT 'New', items_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);
`);

const count = db.prepare("SELECT COUNT(*) n FROM products").get().n;
if (!count) {
  const seed = db.prepare("INSERT INTO products (name,category,price,stock,shop) VALUES (?,?,?,?,?)");
  [
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
  ].forEach(x => seed.run(...x));
}

function safeEqual(a, b) {
  const aa = Buffer.from(String(a || ""));
  const bb = Buffer.from(String(b || ""));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}
function requireAdmin(req, res, next) {
  if (req.session && req.session.role === "admin") return next();
  return res.status(401).json({ error: "Admin login જરૂરી છે. પહેલાં Admin Login કરો." });
}
app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword || !process.env.SESSION_SECRET) {
    return res.status(503).json({ error: "Render માં ADMIN_USERNAME, ADMIN_PASSWORD અને SESSION_SECRET સેટ કરો." });
  }
  if (!safeEqual(username, expectedUser) || !safeEqual(password, expectedPassword)) {
    return res.status(401).json({ error: "Username અથવા Password ખોટો છે." });
  }
  req.session.regenerate(err => {
    if (err) return res.status(500).json({ error: "Login session બનાવી શકાયો નહીં." });
    req.session.role = "admin";
    req.session.save(err2 => {
      if (err2) return res.status(500).json({ error: "Login session સાચવી શકાયો નહીં." });
      res.json({ ok: true, role: "admin" });
    });
  });
});
app.post("/api/logout", (req, res) => req.session.destroy(() => {
  res.clearCookie("multani_kart_admin");
  res.json({ ok: true });
}));
app.get("/api/me", (req, res) => res.json({ authenticated: req.session?.role === "admin", role: req.session?.role || null }));

const safeStatuses = ["New","Accepted","Packed","Out for Delivery","Delivered","Cancelled"];
app.get("/api/health", (req,res) => res.json({ok:true, app:"MULTANI KART", area:"Nandasan"}));
app.get("/api/products", (req,res) => {
  const q = String(req.query.q || "").trim();
  const rows = q
    ? db.prepare("SELECT * FROM products WHERE active=1 AND (name LIKE ? OR category LIKE ? OR shop LIKE ?) ORDER BY category,name").all(`%${q}%`,`%${q}%`,`%${q}%`)
    : db.prepare("SELECT * FROM products WHERE active=1 ORDER BY category,name").all();
  res.json(rows);
});
app.post("/api/products", requireAdmin, (req,res) => {
  const {name,category,price,stock,shop} = req.body || {};
  if (!name || !category || !Number.isFinite(Number(price)) || Number(price)<0) return res.status(400).json({error:"Name, category and valid price are required."});
  const info = db.prepare("INSERT INTO products (name,category,price,stock,shop) VALUES (?,?,?,?,?)").run(String(name),String(category),Number(price),Math.max(0,Number(stock)||0),String(shop||"Local Store"));
  res.json(db.prepare("SELECT * FROM products WHERE id=?").get(info.lastInsertRowid));
});
app.patch("/api/products/:id", requireAdmin, (req,res) => {
  const p = db.prepare("SELECT * FROM products WHERE id=?").get(req.params.id);
  if (!p) return res.status(404).json({error:"Product not found"});
  const b=req.body||{};
  db.prepare("UPDATE products SET name=?,category=?,price=?,stock=?,shop=?,active=? WHERE id=?")
    .run(b.name ?? p.name,b.category ?? p.category,Number(b.price ?? p.price),Math.max(0,Number(b.stock ?? p.stock)),b.shop ?? p.shop,Number(b.active ?? p.active),p.id);
  res.json(db.prepare("SELECT * FROM products WHERE id=?").get(p.id));
});
app.post("/api/orders", (req,res) => {
  const {customer,phone,address,payment,items} = req.body || {};
  if (!customer || !phone || !address || !Array.isArray(items) || !items.length) return res.status(400).json({error:"Please provide customer, phone, address and cart items."});
  if (!["COD","ONLINE"].includes(payment)) return res.status(400).json({error:"Invalid payment method"});
  const normalized=[];
  let total=0;
  const updateStock=db.prepare("UPDATE products SET stock=stock-? WHERE id=? AND stock>=?");
  const getProduct=db.prepare("SELECT * FROM products WHERE id=? AND active=1");
  const transaction=db.transaction(() => {
    for (const item of items) {
      const p=getProduct.get(Number(item.id));
      const qty=Math.floor(Number(item.qty));
      if (!p || !Number.isFinite(qty) || qty<1 || p.stock<qty) throw new Error(`Stock unavailable for ${p ? p.name : "a product"}`);
      updateStock.run(qty,p.id,qty);
      normalized.push({id:p.id,name:p.name,price:p.price,qty,shop:p.shop});
      total += p.price*qty;
    }
    const info=db.prepare("INSERT INTO orders (customer,phone,address,payment,payment_status,total,items_json) VALUES (?,?,?,?,?,?,?)")
      .run(String(customer),String(phone),String(address),payment,payment==="COD"?"Pay on delivery":"Not paid — gateway not connected",total,JSON.stringify(normalized));
    return info.lastInsertRowid;
  });
  try {
    const id=transaction();
    res.json(db.prepare("SELECT * FROM orders WHERE id=?").get(id));
  } catch(e) { res.status(400).json({error:e.message}); }
});
app.get("/api/orders", requireAdmin, (req,res) => {
  const rows=db.prepare("SELECT * FROM orders ORDER BY id DESC").all();
  res.json(rows.map(o=>({...o,items:JSON.parse(o.items_json)})));
});
app.patch("/api/orders/:id/status", requireAdmin, (req,res) => {
  const status=String((req.body||{}).status||"");
  if (!safeStatuses.includes(status)) return res.status(400).json({error:"Invalid status"});
  const info=db.prepare("UPDATE orders SET status=? WHERE id=?").run(status,req.params.id);
  if (!info.changes) return res.status(404).json({error:"Order not found"});
  res.json(db.prepare("SELECT * FROM orders WHERE id=?").get(req.params.id));
});
app.get("/api/admin/summary", requireAdmin, (req,res) => {
  const orders=db.prepare("SELECT COUNT(*) n FROM orders").get().n;
  const revenue=db.prepare("SELECT COALESCE(SUM(total),0) n FROM orders WHERE status!='Cancelled'").get().n;
  const pending=db.prepare("SELECT COUNT(*) n FROM orders WHERE status NOT IN ('Delivered','Cancelled')").get().n;
  const products=db.prepare("SELECT COUNT(*) n FROM products WHERE active=1").get().n;
  res.json({orders,revenue,pending,products});
});
app.get("*", (req,res) => res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT, () => console.log(`MULTANI KART running at http://localhost:${PORT}`));
