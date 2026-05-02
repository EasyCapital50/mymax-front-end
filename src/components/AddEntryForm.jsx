import { useState } from 'react';

const FIELDS = [
  { name: 'applicationNumber', label: 'APPLICATION NUMBER' },
  { name: 'name', label: 'NAME' },
  { name: 'mobile1', label: 'MOBILE 1' },
  { name: 'mobile2', label: 'MOBILE 2' },
  { name: 'mobile3', label: 'MOBILE 3' },
  { name: 'landMark', label: 'LAND MARK' },
  { name: 'residenceAddress', label: 'RESIDENCE ADDRESS' },
  { name: 'officeAddress', label: 'OFFICE ADDRESS' },
  { name: 'bankName', label: 'BANK NAME' },
  { name: 'accountNo', label: 'ACCOUNT NO' },
  { name: 'gstNo', label: 'GST NO' },
  { name: 'noOfCv', label: 'NO OF CV' },
  { name: 'noOfCars', label: 'NO OF CARS' },
  { name: 'landArea', label: 'LAND AREA' },
  { name: 'building', label: 'BUILDING' },
  { name: 'businessNature', label: 'BUSINESS NATURE' },
  { name: 'turnOver', label: 'TURN OVER (LAST 12 MONTH)' },
  { name: 'creditPeriod', label: 'CREDIT PERIOD' },
  { name: 'cibil', label: 'CIBIL' },
  { name: 'ccLimit', label: 'CC LIMIT' },
  { name: 'mainAccounts', label: 'MAIN ACCOUNTS' },
  { name: 'businessRef1', label: 'BUSINESS REFERENCE 1' },
  { name: 'businessRef2', label: 'BUSINESS REFERENCE 2' },
  { name: 'spouseName', label: 'SPOUSE NAME' },
  { name: 'chequeRtnCcAc', label: 'CHEQUE RTN CC A/C' },
  { name: 'chequeRtnCurrentAc', label: 'CHEQUE RTN CURRENT A/C' },
  { name: 'chequeRtnSbAc', label: 'CHEQUE RTN SB A/C' },
  { name: 'propertySyNo', label: 'PROPERTY SY NO' },
  { name: 'propertyTitleDeedNo', label: 'PROPERTY TITLE DEED NO' },
  { name: 'propertyArea', label: 'PROPERTY AREA' },
  { name: 'buildingArea', label: 'BUILDING AREA' },
  { name: 'emiClearingAccount', label: 'EMI CLEARING ACCOUNT' },
  { name: 'securityCheque', label: 'SECURITY CHEQUE' },
  { name: 'purposeOfLoans', label: 'PURPOSE OF LOANS' },
  { name: 'docCollected', label: 'DOC COLLECTED' },
  { name: 'pendings', label: 'PENDINGS' },
  { name: 'negative', label: 'NEGATIVE' },
  { name: 'pdComments', label: 'PD COMMENTS' },
  { name: 'remarks', label: 'REMARKS' },
];

function AddEntryForm({ apiUrl, token, onSuccess }) {
  const [newEntry, setNewEntry] = useState({});

  const handleChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  const handleAddContent = async () => {
    try {
      const res = await fetch(`${apiUrl}/records/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newEntry),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`❌ Error: ${errorData.error}`);
        return;
      }

      const created = await res.json();
      console.log('✅ Record created:', created);

      if (onSuccess) onSuccess();
      setNewEntry({});
    } catch (error) {
      console.error('❌ Failed to add entry:', error);
      alert('Something went wrong. Try again.');
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 mb-10">
      <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-3">
        ➕ Add New Entry
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {FIELDS.map(({ name, label }) => (
          <div key={name} className="flex flex-col gap-1">
            <label
              htmlFor={`field-${name}`}
              className="text-xs font-bold text-gray-900 uppercase tracking-wide"
            >
              {label}
            </label>
            <input
              id={`field-${name}`}
              name={name}
              value={newEntry[name] || ''}
              onChange={handleChange}
              placeholder={`Enter ${label.toLowerCase()}`}
              className="bg-white border border-gray-900 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition w-full"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleAddContent}
        className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold px-8 py-2.5 rounded-lg transition-all duration-150 shadow-sm"
      >
        Add Row
      </button>
    </div>
  );
}

export default AddEntryForm;
