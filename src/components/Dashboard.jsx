import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import DataTable from './DataTable';
import AddEntryForm from './AddEntryForm';
import UserForm from './UserForm';
import UserTable from './UserTable';

const API_URL = 'https://api.easycapitalsolution.com';

function Dashboard({ onLogout }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('sessionToken');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');
        return token && username && role ? { token, username, role } : null;
    });

    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [loading, setLoading] = useState({ records: true, users: true });
    const [error, setError] = useState({ records: null, users: null });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchRecords = async () => {
            try {
                const response = await fetch(`${API_URL}/records/get`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(response.status === 401 ? 'Session expired. Please login again.' : 'Failed to fetch records');
                }

                const json = await response.json();
                setData(Array.isArray(json) ? json : json.data || []);
            } catch (err) {
                console.error("Records fetch error:", err);
                setError(prev => ({ ...prev, records: err.message }));
                if (err.message.includes('401') || err.message.includes('expired')) {
                    handleForceLogout();
                }
            } finally {
                setLoading(prev => ({ ...prev, records: false }));
            }
        };

        fetchRecords();

        if (user.role === 'superadmin') {
            fetchUsers();
        }
    }, [user, navigate]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/users/get`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(response.status === 401 ? 'Session expired. Please login again.' : 'Failed to fetch users');
            }

            const json = await response.json();
            setUsers(Array.isArray(json) ? json : []);
        } catch (err) {
            console.error("Users fetch error:", err);
            setError(prev => ({ ...prev, users: err.message }));
            if (err.message.includes('401') || err.message.includes('expired')) {
                handleForceLogout();
            }
        } finally {
            setLoading(prev => ({ ...prev, users: false }));
        }
    };

    const refreshData = () => {
        fetch(`${API_URL}/records/get`, {
            headers: { Authorization: `Bearer ${user.token}` },
        })
            .then(res => res.json())
            .then(json => {
                if (Array.isArray(json)) {
                    setData(json);
                } else if (Array.isArray(json.data)) {
                    setData(json.data);
                }
            });
    };


    const handleForceLogout = () => {
        localStorage.clear();
        onLogout();
        navigate('/login');
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_URL}/users/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.message || 'Logout failed');
            }

            localStorage.clear();
            onLogout();
            navigate('/login');
        } catch (err) {
            console.error("Logout error:", err);
            alert(err.message);
        }
    };
    // Reset to page 1 whenever data or search term changes
useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, data]);


    if (!user) return null;
// Calculate which items to show
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const paginatedData = data.slice(startIndex, endIndex);



    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 lg:p-10 overflow-x-hidden">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Welcome, {user.username} <span className="text-gray-500 text-lg">({user.role})</span>
                    </h2>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors w-full sm:w-auto"
                    >
                        Logout
                    </button>
                </div>

                {error.records && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                        {error.records}
                    </div>
                )}

                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {loading.records ? (
                <div className="text-center py-8 text-gray-600">Loading records...</div>
                ) : (
                <>
                    <DataTable
                    data={paginatedData}
                    searchTerm={searchTerm}
                    user={user}
                    apiUrl={`${API_URL}/records`}
                    token={user.token}
                    onDeleteSuccess={refreshData}
                    onEditSuccess={refreshData}
                    />

                    {/* Pagination Controls */}
                    {data.length > itemsPerPage && (
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-8">
                        <div className="flex items-center gap-2 bg-white shadow-sm rounded-xl px-4 py-2 border border-gray-200">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 
                                    hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ← Prev
                        </button>

                        <span className="text-gray-700 font-semibold text-sm">
                            Page <span className="text-green-700">{currentPage}</span> of{" "}
                            <span className="text-green-700">{Math.ceil(data.length / itemsPerPage)}</span>
                        </span>

                        <button
                            onClick={() =>
                            setCurrentPage((prev) =>
                                prev < Math.ceil(data.length / itemsPerPage) ? prev + 1 : prev
                            )
                            }
                            disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
                            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 
                                    hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                        </div>

                        {/* Optional: Jump to Page Selector */}
                        <div className="flex items-center gap-2 text-sm">
                        <label htmlFor="pageSelect" className="text-gray-600">Go to:</label>
                        <select
                            id="pageSelect"
                            value={currentPage}
                            onChange={(e) => setCurrentPage(Number(e.target.value))}
                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Array.from({ length: Math.ceil(data.length / itemsPerPage) }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                            ))}
                        </select>
                        </div>
                    </div>
                    )}

                </>
                )}


                {(user.role === 'staff' || user.role === 'superadmin') && (
                    <AddEntryForm
dataHeaders={
  data[0]
    ? Array.from(new Set([...Object.keys(data[0]), "natureOfBsns", "styleOfBsns"]))
    : ["companyName", "customerName", "mobile", "place", "bank", "to", "appDate", "status", "remarks", "natureOfBsns", "styleOfBsns"]
}
                        apiUrl={API_URL}
                        token={user.token}
                        onSuccess={() => {
                            fetch(`${API_URL}/records/get`, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${user.token}`,
                                },
                            })
                                .then(res => res.json())
                                .then(json => {
                                    if (Array.isArray(json)) {
                                        setData(json); // superadmin or regular user will get appropriate data
                                    } else {
                                        alert("Unexpected response");
                                    }
                                })
                                .catch((err) => {
                                    console.error("❌ Failed to fetch updated records:", err);
                                    alert("Failed to refresh records");
                                });
                        }}
                    />

                )}

                {user.role === 'superadmin' && (
                    <>
                        {error.users && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                                {error.users}
                            </div>
                        )}

                        <UserForm
                            apiUrl={`${API_URL}/users/add`}
                            username={user.username}
                            token={user.token}
                            onSuccess={fetchUsers}
                        />

                        {loading.users ? (
                            <div className="text-center py-8 text-gray-600">Loading users...</div>
                        ) : (
                            <UserTable
                                users={users}
                                setUsers={setUsers}
                                apiUrl={API_URL}
                                token={user.token}
                                onUserUpdate={fetchUsers}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
