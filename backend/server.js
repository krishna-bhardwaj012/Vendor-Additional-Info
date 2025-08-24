// backend/server.js  (ESM)

import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// --- __dirname in ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- ensure uploads dir exists ---
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// --- static /uploads ---
app.use("/uploads", express.static(uploadsDir));

// --- Multer setup (store filenames, not full absolute paths) ---
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* =========================================================
   Helpers
========================================================= */
const toYYYYMMDD = (val) => {
  if (!val) return null;
  const d = val instanceof Date ? val : new Date(val);
  if (Number.isNaN(d.getTime())) return null;
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// VEND_STATUS is enum('0','1') in DB. Normalize any input to '0' or '1'
const normalizeVendStatus = (v) => {
  if (v === null || v === undefined || v === "") return "0";
  const s = String(v).trim().toLowerCase();

  // direct matches first
  if (s === "0" || s === "1") return s;

  // truthy/falsey mapping
  if (["1", "true", "yes", "y", "active", "a"].includes(s)) return "1";
  if (["0", "false", "no", "n", "inactive", "i"].includes(s)) return "0";

  // numeric fallbacks
  if (!Number.isNaN(Number(s))) {
    return Number(s) ? "1" : "0";
  }
  return "0";
};

// STATUS is enum('ACTIVE','INACTIVE') in DB. Normalize accordingly
const normalizeStatus = (v) => {
  if (v === null || v === undefined || v === "") return "ACTIVE";
  const s = String(v).trim().toUpperCase();
  if (s === "ACTIVE" || s === "INACTIVE") return s;

  if (["1", "TRUE", "YES", "Y", "A"].includes(s)) return "ACTIVE";
  if (["0", "FALSE", "NO", "N", "I"].includes(s)) return "INACTIVE";
  return "ACTIVE";
};

/* =========================================================
   /api/kf_vendor  (multipart: logo, image + fields)
   Uses only REAL columns from your table (list below)
========================================================= */

const KF_VENDOR_COLUMNS = new Set([
  "VEND_ID",
  "VEND_TITL",
  "PORTAL_ID",
  "MEMBERID",
  "PARENTPORTALID",
  "VEND_DESC",
  "VEND_DET",
  "VEND_CON_ADDR",
  "VEND_STATUS",
  "VEND_LOGO",
  "VEND_URL",
  "VEND_KEY1",
  "VEND_KEY2",
  "VEND_SOURCE",
  "VEND_IND_INF",
  "VEND_SDATE",
  "INSRT_DTM",
  "VEND_CNTR",
  "VEND_EDATE",
  "VEND_KEY_PLE",
  "VEND_COMPT",
  "VEND_KEY_NO",
  "VEND_FINAN_OVIEW",
  "IMAGE",
  "PORTALID_LEVEL1",
  "PORTALID_LEVEL2",
  "PORTALID_LEVEL3",
  "pincode",
  "phone",
  "other_phones",
  "email",
  "other_emails",
  "address",
  "VEND_CATEGRY",
  "CATEGORY_ID",
  "PORTAL_RANKING",
  "STATE_RANKING",
  "REVENUE",
  "REVENUE_GROWTH",
  "EMPLOYEE_COUNT",
  "EMP_GROWTH",
  "JOB_OPENINGS",
  "FOUNDED_YEAR",
  "CITY_RANKING",
  "VALUATION",
  "FUNDING",
  "COMPANY_NAME",
  "CITY",
  "STATE",
  "COUNTRY",
  "LINKEDIN_URL",
  "INDUSTRY_TYPE",
  "MYBLOCK_RANKING_TYPE",
  "MYBLOCK_RANKING_NUMBER",
  "PREVIOUS_RANKING",
  "ESTIMATED_REVENUES",
  "KEYWORDS",
  "LEAD_INVESTORS",
  "ACCELERATOR",
  "BUSINESS_TYPE",
  "TOTAL_FUNDING",
  "PRODUCT_URL",
  "INDEED_URL",
  "DOC_PRICE",
  "RANKING",
  "FB_FOLLOWER_COUNT",
  "VENDOR_LEVEL",
  "FB_PAGE_URL",
  "INSTA_PAGE_URL",
  "INSTA_FOLLOWER_COUNT",
  "LINKEDIN_PAGE_URL",
  "LINKEDIN_FOLLOWER_COUNT",
  "GOOGLE_RVW_LINK",
  "GOOGLE_RVW_COUNT",
  "MOBILE_PHONE",
  "PRIMARY_CONTACT_PERSON",
  "SCRAPPER_VERSION",
  "COMMENTS_SUMMARY",
  "SP_COPY_IGNORE",
  "UPDATE_DTM",
  "STATUS",
]);

app.post(
  "/api/kf_vendor",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // short relative paths (so they fit varchar(200))
      const logoFile = req.files?.logo?.[0]?.filename
        ? `/uploads/${req.files.logo[0].filename}`
        : null;
      const imageFile = req.files?.image?.[0]?.filename
        ? `/uploads/${req.files.image[0].filename}`
        : null;

      // Build row ONLY with real columns
      const insertRow = {};

      // 1) Copy body fields that match table columns
      for (const [key, value] of Object.entries(req.body || {})) {
        if (KF_VENDOR_COLUMNS.has(key)) {
          insertRow[key] = value;
        }
      }

      // 2) Add/override file columns
      if (logoFile !== null && KF_VENDOR_COLUMNS.has("VEND_LOGO")) {
        insertRow.VEND_LOGO = logoFile;
      }
      if (imageFile !== null && KF_VENDOR_COLUMNS.has("IMAGE")) {
        insertRow.IMAGE = imageFile;
      }

      // 3) Normalize fields that cause errors or are required

      // PORTAL_ID & MEMBERID are NOT NULL (fallback defaults)
      if (insertRow.PORTAL_ID == null || insertRow.PORTAL_ID === "") insertRow.PORTAL_ID = 1;
      if (insertRow.MEMBERID == null || insertRow.MEMBERID === "") insertRow.MEMBERID = 1;

      // VEND_SDATE is NOT NULL (DATE) -> default to today if missing/invalid
      const vendSdate = toYYYYMMDD(insertRow.VEND_SDATE) || toYYYYMMDD(new Date());
      insertRow.VEND_SDATE = vendSdate;

      // INSRT_DTM is NOT NULL (DATETIME)
      insertRow.INSRT_DTM = new Date();

      // VEND_STATUS: enum('0','1')
      insertRow.VEND_STATUS = normalizeVendStatus(insertRow.VEND_STATUS);

      // STATUS: enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE'
      insertRow.STATUS = normalizeStatus(insertRow.STATUS);

      // Optional numeric booleans often sent as 'true'/'false' — keep safe for SP_COPY_IGNORE tinyint(1)
      if ("SP_COPY_IGNORE" in insertRow) {
        const v = String(insertRow.SP_COPY_IGNORE).trim().toLowerCase();
        insertRow.SP_COPY_IGNORE = ["1", "true", "yes", "y"].includes(v) ? 1 : 0;
      }

      // Guard: If nothing valid
      if (Object.keys(insertRow).length === 0) {
        return res.status(400).json({ error: "No valid fields supplied for kf_vendor." });
      }

      // INSERT using SET ? to map object keys to columns
      const [result] = await pool.query("INSERT INTO kf_vendor SET ?", insertRow);

      return res.json({
        message: "✅ Vendor Data inserted successfully",
        insertId: result.insertId,
      });
    } catch (err) {
      console.error("❌ Error inserting Vendor Data:", err.sqlMessage || err.message);
      return res.status(500).send("❌ Error inserting Vendor Data");
    }
  }
);

/* =========================================================
   Your existing Vendor Additional Info API (unchanged)
========================================================= */

app.get("/api/vendor/:id", async (req, res) => {
  const vendorId = req.params.id;
  try {
    const [rows] = await pool.query(
      `SELECT ADD_INFO_ID, INFO_TYPE,
              IFNULL(INFO_TITLE, '')  AS INFO_TITLE,
              IFNULL(INFO_VALUE, '')  AS INFO_VALUE
       FROM KF_VENDOR_ADDITIONAL_INFO
       WHERE VEND_ID = ?
       ORDER BY CREATED_AT ASC`,
      [vendorId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching vendor info:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.get("/api/vendors/search", async (req, res) => {
  const searchTerm = req.query.q || "";
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT VEND_ID
       FROM KF_VENDOR_ADDITIONAL_INFO
       WHERE CAST(VEND_ID AS CHAR) LIKE ?
       ORDER BY VEND_ID ASC
       LIMIT 20`,
      [`%${searchTerm}%`]
    );
    res.json(rows.map((r) => r.VEND_ID));
  } catch (err) {
    console.error("Error searching vendor IDs:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

app.post("/api/vendor", async (req, res) => {
  const { VEND_ID, INFO_TYPE, INFO_TITLE, INFO_VALUE } = req.body;
  if (!VEND_ID || !INFO_TYPE || !INFO_TITLE || !INFO_VALUE) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    await pool.query(
      `INSERT INTO KF_VENDOR_ADDITIONAL_INFO
       (VEND_ID, INFO_TYPE, INFO_TITLE, INFO_VALUE, CREATED_AT)
       VALUES (?, ?, ?, ?, NOW())`,
      [VEND_ID, INFO_TYPE, INFO_TITLE, INFO_VALUE]
    );
    res.json({ message: "Vendor info added successfully" });
  } catch (err) {
    console.error("Error adding vendor info:", err);
    res.status(500).json({ error: "Database insert failed" });
  }
});

app.put("/api/vendor/:id", async (req, res) => {
  const infoId = req.params.id;
  const { INFO_TYPE, INFO_TITLE, INFO_VALUE } = req.body;
  if (!INFO_TYPE || !INFO_TITLE || !INFO_VALUE) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    await pool.query(
      `UPDATE KF_VENDOR_ADDITIONAL_INFO
       SET INFO_TYPE = ?, INFO_TITLE = ?, INFO_VALUE = ?
       WHERE ADD_INFO_ID = ?`,
      [INFO_TYPE, INFO_TITLE, INFO_VALUE, infoId]
    );
    res.json({ message: "Vendor info updated successfully" });
  } catch (err) {
    console.error("Error updating vendor info:", err);
    res.status(500).json({ error: "Database update failed" });
  }
});

app.delete("/api/vendor/:id", async (req, res) => {
  const infoId = req.params.id;
  try {
    await pool.query(
      `DELETE FROM KF_VENDOR_ADDITIONAL_INFO WHERE ADD_INFO_ID = ?`,
      [infoId]
    );
    res.json({ message: "Vendor info deleted successfully" });
  } catch (err) {
    console.error("Error deleting vendor info:", err);
    res.status(500).json({ error: "Database delete failed" });
  }
});

/* =========================================================
   Start server
========================================================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
