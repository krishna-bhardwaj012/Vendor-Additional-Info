import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

/* ===========================
   GET Vendor Info by ID
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
   SEARCH Vendor IDs
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
   ADD Vendor Info
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
   UPDATE Vendor Info
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
   DELETE Vendor Info
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
