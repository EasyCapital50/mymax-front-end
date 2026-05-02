import React, { useState } from 'react';

const labelMap = {
  applicationNumber: "APPLICATION NUMBER",
  name: "NAME",
  mobile1: "MOBILE 1",
  mobile2: "MOBILE 2",
  mobile3: "MOBILE 3",
  landMark: "LAND MARK",
  residenceAddress: "RESIDENCE ADDRESS",
  officeAddress: "OFFICE ADDRESS",
  bankName: "BANK NAME",
  accountNo: "ACCOUNT NO",
  gstNo: "GST NO",
  noOfCv: "NO OF CV",
  noOfCars: "NO OF CARS",
  landArea: "LAND AREA",
  building: "BUILDING",
  businessNature: "BUSINESS NATURE",
  turnOver: "TURN OVER (LAST 12 MONTH)",
  creditPeriod: "CREDIT PERIOD",
  cibil: "CIBIL",
  ccLimit: "CC LIMIT",
  mainAccounts: "MAIN ACCOUNTS",
  businessRef1: "BUSINESS REFERENCE 1",
  businessRef2: "BUSINESS REFERENCE 2",
  spouseName: "SPOUSE NAME",
  chequeRtnCcAc: "CHEQUE RTN CC A/C",
  chequeRtnCurrentAc: "CHEQUE RTN CURRENT A/C",
  chequeRtnSbAc: "CHEQUE RTN SB A/C",
  propertySyNo: "PROPERTY SY NO",
  propertyTitleDeedNo: "PROPERTY TITLE DEED NO",
  propertyArea: "PROPERTY AREA",
  buildingArea: "BUILDING AREA",
  emiClearingAccount: "EMI CLEARING ACCOUNT",
  securityCheque: "SECURITY CHEQUE",
  purposeOfLoans: "PURPOSE OF LOANS",
  docCollected: "DOC COLLECTED",
  pendings: "PENDINGS",
  negative: "NEGATIVE",
  pdComments: "PD COMMENTS",
  remarks: "REMARKS",
};


function DataTable({ data, searchTerm, user, apiUrl, token, onDeleteSuccess, onEditSuccess }) {
  const excludedFields = ['_id', '__v', 'createdAt', 'updatedAt'];

  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({});

  const filteredData = data.filter(row =>
    Object.values(row).some(val =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Show table only:
  // - If superadmin: always show
  // - If staff/user: only show if search has results
const shouldShowTable =
  user.role === 'superadmin' ||
  (filteredData.length > 0 || data.length > 0);

if (!shouldShowTable) return null;


  const canEdit = (row) =>
    user.role === 'superadmin' || (user.role === 'staff' && row.createdBy?._id === user._id);

  const handleDeleteRow = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this record?`)) return;

    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();
      alert(result.message || "✅ Record deleted.");
      onDeleteSuccess?.();
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Delete failed. Please try again.");
    }
  };

  const handleEditRow = (row) => {
    setEditingRow(row._id);
    setEditValues(row);
  };

  const handleEditChange = (e) => {
    setEditValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editValues),
      });

      const result = await res.json();
      alert(result.message || "✅ Record updated.");
      setEditingRow(null);
      onEditSuccess?.();
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("Update failed. Try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditValues({});
  };

  return (
  <div className="bg-white shadow-md rounded-xl p-4 md:p-6 mb-8 border border-gray-200">
    {/* Desktop Table */}
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full text-sm border border-gray-300">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-2 border text-left whitespace-nowrap">#</th>
            {data[0] &&
              Object.keys(labelMap)
                .filter((key) => !excludedFields.includes(key) && key !== 'createdBy')
                .map((key, i) => (
                  <th key={i} className="px-4 py-2 border text-left whitespace-nowrap">
                    {labelMap[key] || key}
                  </th>
                ))}
            {user.role === 'superadmin' && (
              <th className="px-4 py-2 border text-left whitespace-nowrap">Created By</th>
            )}
            {(user.role === 'superadmin' || user.role === 'staff') && (
              <th className="px-4 py-2 border text-left whitespace-nowrap">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {filteredData.map((row, i) => (
            <tr key={i} className="even:bg-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-3 py-2 border whitespace-nowrap font-semibold text-gray-700 text-center">{i + 1}</td>
              {Object.keys(labelMap).map((key, j) => (
                <td key={j} className="px-3 py-2 border whitespace-nowrap">
                  {editingRow === row._id ? (
                    <input
                      type="text"
                      name={key}
                      value={editValues[key] || ''}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full text-sm"
                    />
                  ) : (
                    row[key] || '—'
                  )}
                </td>
              ))}

              {user.role === 'superadmin' && (
                <td className="px-3 py-2 border text-gray-500 whitespace-nowrap">
                  {row.createdBy?.username || '—'}
                </td>
              )}

              {(user.role === 'superadmin' || user.role === 'staff') && (
                <td className="px-3 py-2 border space-x-2 whitespace-nowrap">
                  {editingRow === row._id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(row._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditRow(row)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      {user.role === 'superadmin' && (
                        <button
                          onClick={() => handleDeleteRow(row._id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile Card Layout */}
    <div className="md:hidden flex flex-col gap-4">
      {filteredData.map((row, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col gap-2"
        >
          <div className="flex justify-between items-start border-b pb-2 mb-1">
            <span className="font-bold text-gray-800 text-sm">
              #{i + 1}
            </span>
          </div>
          {Object.keys(labelMap).map(
            (key, j) =>
              row[key] && (
                <div key={j} className="flex justify-between items-start">
                  <span className="font-medium text-gray-600 text-sm">
                    {labelMap[key]}:
                  </span>
                  <span className="text-gray-800 text-sm text-right max-w-[60%]">
                    {row[key]}
                  </span>
                </div>
              )
          )}

          {user.role === 'superadmin' && (
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-600 text-sm">Created By:</span>
              <span className="text-gray-800 text-sm">
                {row.createdBy?.username || '—'}
              </span>
            </div>
          )}

          {/* Mobile Actions */}
          {(user.role === 'superadmin' || user.role === 'staff') && (
            <div className="flex justify-end gap-2 pt-2">
              {editingRow === row._id ? (
                <>
                  <button
                    onClick={() => handleSaveEdit(row._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEditRow(row)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  {user.role === 'superadmin' && (
                    <button
                      onClick={() => handleDeleteRow(row._id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

}

export default DataTable;