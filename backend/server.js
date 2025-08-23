// backend/server.js (ESM, single backend)

import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

// __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===========================
   Static uploads + Multer
=========================== */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

/* ===========================
   Vendor Book submit (kf_vendor)
   POST /api/kf_vendor
   - accepts multipart/form-data (logo, image + fields)
=========================== */
app.post(
  '/api/kf_vendor',
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'image', maxCount: 1 }]),
  async (req, res) => {
    try {
      const {
        VEND_TITL, VEND_CON_ADDR, VEND_CATEGRY, VEND_DET, VEND_STATUS, VEND_SOURCE,
        email, phone, COUNTRY, STATE, CITY, pincode,
        VEND_IND_INF, RANKING, DOC_PRICE, INDUSTRY_TYPE, BUSINESS_TYPE, KEYWORDS,
        PORTAL_RANKING, STATE_RANKING, CITY_RANKING, MYBLOCK_RANKING_TYPE, MYBLOCK_RANKING_NUMBER, PREVIOUS_RANKING,
        REVENUE, REVENUE_GROWTH, EMPLOYEE_COUNT, EMP_GROWTH, JOB_OPENINGS,
        COMPANY_NAME, VENDOR_LEVEL, LEAD_INVESTORS, ESTIMATED_REVENUES, ACCELERATOR,
        FUNDING, TOTAL_FUNDING, SP_COPY_IGNORE, COMMENTS_SUMMARY, VEND_DESC, VEND_KEY_NO,
        VEND_COMPT, VEND_FINAN_OVIEW, other_emails, other_phones, address, MOBILE_PHONE,
        PRIMARY_CONTACT_PERSON, VALUATION, VEND_URL, LINKEDIN_URL, PRODUCT_URL,
        INDEED_URL, VEND_CNTR, FOUNDED_YEAR, FB_PAGE_URL, INSTA_PAGE_URL, LINKEDIN_PAGE_URL,
        FB_FOLLOWER_COUNT, INSTA_FOLLOWER_COUNT, LINKEDIN_FOLLOWER_COUNT, TYPE_SELECTION
      } = req.body ?? {};

      const VEND_LOGO = req.files?.logo?.[0]?.path ?? null;
      const IMAGE     = req.files?.image?.[0]?.path ?? null;
      const INSRT_DTM = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const sql = `
        INSERT INTO kf_vendor 
        (PORTAL_ID, MEMBERID, PARENTPORTALID, VEND_SDATE, VEND_EDATE, VEND_LOGO, IMAGE, VEND_TITL, VEND_CON_ADDR, VEND_CATEGRY, VEND_DET, VEND_STATUS, VEND_SOURCE,
         email, phone, COUNTRY, STATE, CITY, pincode, VEND_IND_INF, RANKING, DOC_PRICE, INDUSTRY_TYPE, BUSINESS_TYPE, KEYWORDS, PORTAL_RANKING, STATE_RANKING, CITY_RANKING,
         MYBLOCK_RANKING_TYPE, MYBLOCK_RANKING_NUMBER, PREVIOUS_RANKING, REVENUE, REVENUE_GROWTH, EMPLOYEE_COUNT, EMP_GROWTH, JOB_OPENINGS, COMPANY_NAME, VENDOR_LEVEL,
         LEAD_INVESTORS, ESTIMATED_REVENUES, ACCELERATOR, FUNDING, TOTAL_FUNDING, SP_COPY_IGNORE, COMMENTS_SUMMARY, VEND_DESC, VEND_KEY_NO, VEND_COMPT, VEND_FINAN_OVIEW,
         other_emails, other_phones, address, MOBILE_PHONE, PRIMARY_CONTACT_PERSON, VALUATION, VEND_URL, LINKEDIN_URL, PRODUCT_URL, INDEED_URL, VEND_CNTR, FOUNDED_YEAR,
         FB_PAGE_URL, INSTA_PAGE_URL, LINKEDIN_PAGE_URL, FB_FOLLOWER_COUNT, INSTA_FOLLOWER_COUNT, LINKEDIN_FOLLOWER_COUNT, TYPE_SELECTION, INSRT_DTM)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `;

      const values = [
        // First five fixed values (as per your vendor_book_server)
        1, 1, 1, '2025-01-01', '2025-12-31',
        // Files + fields
        VEND_LOGO, IMAGE, VEND_TITL, VEND_CON_ADDR, VEND_CATEGRY, VEND_DET, VEND_STATUS, VEND_SOURCE,
        email, phone, COUNTRY, STATE, CITY, pincode,
        VEND_IND_INF, RANKING, DOC_PRICE, INDUSTRY_TYPE, BUSINESS_TYPE, KEYWORDS,
        PORTAL_RANKING, STATE_RANKING, CITY_RANKING, MYBLOCK_RANKING_TYPE, MYBLOCK_RANKING_NUMBER, PREVIOUS_RANKING,
        REVENUE, REVENUE_GROWTH, EMPLOYEE_COUNT, EMP_GROWTH, JOB_OPENINGS,
        COMPANY_NAME, VENDOR_LEVEL, LEAD_INVESTORS, ESTIMATED_REVENUES, ACCELERATOR,
        FUNDING, TOTAL_FUNDING, SP_COPY_IGNORE, COMMENTS_SUMMARY, VEND_DESC, VEND_KEY_NO,
        VEND_COMPT, VEND_FINAN_OVIEW, other_emails, other_phones, address, MOBILE_PHONE,
        PRIMARY_CONTACT_PERSON, VALUATION, VEND_URL, LINKEDIN_URL, PRODUCT_URL,
        INDEED_URL, VEND_CNTR, FOUNDED_YEAR, FB_PAGE_URL, INSTA_PAGE_URL, LINKEDIN_PAGE_URL,
        FB_FOLLOWER_COUNT, INSTA_FOLLOWER_COUNT, LINKEDIN_FOLLOWER_COUNT, TYPE_SELECTION, INSRT_DTM
      ];

      await pool.query(sql, values);
      return res.status(200).send('✅ Vendor Data inserted successfully');
    } catch (err) {
      console.error('❌ Error inserting Vendor Data:', err);
      return res.status(500).send('❌ Error inserting Vendor Data');
    }
  }
);

/* ===========================
   GET Vendor Info by ID  (your existing)
=========================== */
app.get('/api/vendor/:id', async (req, res) => {
  const vendorId = req.params.id;
  try {
    const [rows] = await pool.query(
      `SELECT ADD_INFO_ID, INFO_TYPE, IFNULL(INFO_TITLE, '') AS INFO_TITLE, IFNULL(INFO_VALUE, '') AS INFO_VALUE
       FROM KF_VENDOR_ADDITIONAL_INFO
       WHERE VEND_ID = ?
       ORDER BY CREATED_AT ASC`,
      [vendorId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching vendor info:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

/* ===========================
   SEARCH Vendor IDs (your existing)
=========================== */
app.get('/api/vendors/search', async (req, res) => {
  const searchTerm = req.query.q || '';
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT VEND_ID
       FROM KF_VENDOR_ADDITIONAL_INFO
       WHERE CAST(VEND_ID AS CHAR) LIKE ?
       ORDER BY VEND_ID ASC
       LIMIT 20`,
      [`%${searchTerm}%`]
    );
    res.json(rows.map(row => row.VEND_ID));
  } catch (err) {
    console.error('Error searching vendor IDs:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

/* ===========================
   ADD Vendor Info (your existing)
=========================== */
app.post('/api/vendor', async (req, res) => {
  const { VEND_ID, INFO_TYPE, INFO_TITLE, INFO_VALUE } = req.body;
  if (!VEND_ID || !INFO_TYPE || !INFO_TITLE || !INFO_VALUE) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await pool.query(
      `INSERT INTO KF_VENDOR_ADDITIONAL_INFO (VEND_ID, INFO_TYPE, INFO_TITLE, INFO_VALUE, CREATED_AT)
       VALUES (?, ?, ?, ?, NOW())`,
      [VEND_ID, INFO_TYPE, INFO_TITLE, INFO_VALUE]
    );
    res.json({ message: 'Vendor info added successfully' });
  } catch (err) {
    console.error('Error adding vendor info:', err);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

/* ===========================
   UPDATE Vendor Info (your existing)
=========================== */
app.put('/api/vendor/:id', async (req, res) => {
  const infoId = req.params.id;
  const { INFO_TYPE, INFO_TITLE, INFO_VALUE } = req.body;
  if (!INFO_TYPE || !INFO_TITLE || !INFO_VALUE) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await pool.query(
      `UPDATE KF_VENDOR_ADDITIONAL_INFO
       SET INFO_TYPE = ?, INFO_TITLE = ?, INFO_VALUE = ?
       WHERE ADD_INFO_ID = ?`,
      [INFO_TYPE, INFO_TITLE, INFO_VALUE, infoId]
    );
    res.json({ message: 'Vendor info updated successfully' });
  } catch (err) {
    console.error('Error updating vendor info:', err);
    res.status(500).json({ error: 'Database update failed' });
  }
});

/* ===========================
   DELETE Vendor Info (your existing)
=========================== */
app.delete('/api/vendor/:id', async (req, res) => {
  const infoId = req.params.id;
  try {
    await pool.query(`DELETE FROM KF_VENDOR_ADDITIONAL_INFO WHERE ADD_INFO_ID = ?`, [infoId]);
    res.json({ message: 'Vendor info deleted successfully' });
  } catch (err) {
    console.error('Error deleting vendor info:', err);
    res.status(500).json({ error: 'Database delete failed' });
  }
});

/* ===========================
   Start server
=========================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
