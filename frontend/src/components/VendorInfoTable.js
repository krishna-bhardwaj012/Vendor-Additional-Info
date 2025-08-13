import React, { useState } from "react";
import axios from "axios";

const VendorInfoTable = ({ data, vendorId, refreshData }) => {
  const [newRow, setNewRow] = useState({ INFO_TYPE: "", INFO_TITLE: "", INFO_VALUE: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [editRow, setEditRow] = useState({});

  // Handle Add
  const handleAdd = () => {
    if (!newRow.INFO_TYPE || !newRow.INFO_TITLE || !newRow.INFO_VALUE) {
      alert("Please fill all fields before adding.");
      return;
    }

    axios
      .post(`http://localhost:5000/api/vendor`, {
        VEND_ID: vendorId,
        ...newRow,
      })
      .then(() => {
        setNewRow({ INFO_TYPE: "", INFO_TITLE: "", INFO_VALUE: "" });
        refreshData(vendorId);
      })
      .catch((err) => console.error("Error adding vendor info:", err));
  };

  // Handle Update
  const handleUpdate = (addInfoId) => {
    axios
      .put(`http://localhost:5000/api/vendor/${addInfoId}`, {
        INFO_TYPE: editRow.INFO_TYPE,
        INFO_TITLE: editRow.INFO_TITLE,
        INFO_VALUE: editRow.INFO_VALUE,
      })
      .then(() => {
        setEditIndex(null);
        refreshData(vendorId);
      })
      .catch((err) => console.error("Error updating vendor info:", err));
  };

  // Handle Delete
  const handleDelete = (addInfoId) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      axios
        .delete(`http://localhost:5000/api/vendor/${addInfoId}`)
        .then(() => refreshData(vendorId))
        .catch((err) => console.error("Error deleting vendor info:", err));
    }
  };

  return (
    <div>
      {/* Add New Row */}
      <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Type"
          value={newRow.INFO_TYPE}
          onChange={(e) => setNewRow({ ...newRow, INFO_TYPE: e.target.value })}
        />
        <input
          type="text"
          placeholder="Title"
          value={newRow.INFO_TITLE}
          onChange={(e) => setNewRow({ ...newRow, INFO_TITLE: e.target.value })}
        />
        <input
          type="text"
          placeholder="Value"
          value={newRow.INFO_VALUE}
          onChange={(e) => setNewRow({ ...newRow, INFO_VALUE: e.target.value })}
        />
        <button onClick={handleAdd}>ADD</button>
      </div>

      {/* Table */}
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Info Type</th>
            <th>Info Title</th>
            <th>Info Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4">No vendor information found.</td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.ADD_INFO_ID}>
                {editIndex === index ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editRow.INFO_TYPE}
                        onChange={(e) => setEditRow({ ...editRow, INFO_TYPE: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editRow.INFO_TITLE}
                        onChange={(e) => setEditRow({ ...editRow, INFO_TITLE: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editRow.INFO_VALUE}
                        onChange={(e) => setEditRow({ ...editRow, INFO_VALUE: e.target.value })}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleUpdate(row.ADD_INFO_ID)}>Save</button>
                      <button onClick={() => setEditIndex(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{row.INFO_TYPE}</td>
                    <td>{row.INFO_TITLE}</td>
                    <td>{row.INFO_VALUE}</td>
                    <td>
                      <button
                        onClick={() => {
                          setEditIndex(index);
                          setEditRow(row);
                        }}
                      >
                        Update
                      </button>
                      <button onClick={() => handleDelete(row.ADD_INFO_ID)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VendorInfoTable;
