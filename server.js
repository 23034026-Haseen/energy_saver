const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Render ENV variables (you set these in Render dashboard)
const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // ✅ Aiven requires SSL
  ssl: {
    rejectUnauthorized: false
  }
};


// Quick health check
app.get("/", (req, res) => res.send("Energy Saver API running ✅"));

// READ ALL (GET /tracker)
app.get("/tracker", async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute(
      `SELECT 
        id,
        name AS item,
        category,
        monthlyGoal AS goal,
        usedThisMonth AS used,
        unit,
        costPerUnit
       FROM household_items
       ORDER BY id ASC`
    );
    await conn.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE (POST /tracker)
app.post("/tracker", async (req, res) => {
  try {
    const { item, category, goal, used, unit, costPerUnit } = req.body;

    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.execute(
      `INSERT INTO household_items (name, category, monthlyGoal, usedThisMonth, unit, costPerUnit)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [item, category, goal, used ?? 0, unit, costPerUnit]
    );
    await conn.end();

    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE (PUT /tracker/:id)
app.put("/tracker/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { item, category, goal, used, unit, costPerUnit } = req.body;

    const conn = await mysql.createConnection(dbConfig);
    await conn.execute(
      `UPDATE household_items
       SET name=?, category=?, monthlyGoal=?, usedThisMonth=?, unit=?, costPerUnit=?
       WHERE id=?`,
      [item, category, goal, used, unit, costPerUnit, id]
    );
    await conn.end();

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE (DELETE /tracker/:id)
app.delete("/tracker/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const conn = await mysql.createConnection(dbConfig);
    await conn.execute(`DELETE FROM household_items WHERE id=?`, [id]);
    await conn.end();

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API running on port", PORT));
