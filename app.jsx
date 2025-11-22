const { useState, useEffect } = React;

// Component App chính
function App() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Fetch users từ API
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setUsers(data);
            setFilteredUsers(data);
        } catch (err) {
            setError(`Lỗi khi tải dữ liệu: ${err.message}`);
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load users khi component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users theo search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
        setCurrentPage(1); // Reset về trang 1 khi search
    }, [searchTerm, users]);

    // Tính toán pagination
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    // Reset page khi filtered users thay đổi
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [totalPages]);

    // Create user
    const handleCreate = async (formData) => {
        try {
            setError('');
            setSuccess('');
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    username: formData.name.toLowerCase().replace(/\s+/g, ''),
                    website: 'example.com'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newUser = await response.json();
            
            // Cập nhật UI thủ công (thêm user mới vào danh sách)
            // JSONPlaceholder trả về ID 11, nhưng chúng ta sẽ tạo ID tạm thời
            const userWithId = {
                ...newUser,
                id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
            };
            
            const updatedUsers = [...users, userWithId];
            setUsers(updatedUsers);
            setSuccess('Thêm user thành công!');
            
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(`Lỗi khi thêm user: ${err.message}`);
            throw err;
        }
    };

    // Update user
    const handleUpdate = async (formData) => {
        try {
            setError('');
            setSuccess('');
            
            const response = await fetch(`${API_URL}/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...editingUser,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedUser = await response.json();
            
            // Cập nhật UI thủ công
            const updatedUsers = users.map(user =>
                user.id === editingUser.id
                    ? { ...updatedUser, phone: formData.phone }
                    : user
            );
            setUsers(updatedUsers);
            setSuccess('Cập nhật user thành công!');
            
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(`Lỗi khi cập nhật user: ${err.message}`);
            throw err;
        }
    };

    // Delete user
    const handleDelete = async (userId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa user này?')) {
            return;
        }

        try {
            setError('');
            setSuccess('');
            
            const response = await fetch(`${API_URL}/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Cập nhật UI thủ công (xóa user khỏi danh sách)
            const updatedUsers = users.filter(user => user.id !== userId);
            setUsers(updatedUsers);
            setSuccess('Xóa user thành công!');
            
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(`Lỗi khi xóa user: ${err.message}`);
        }
    };

    // Handle form save
    const handleSave = async (formData) => {
        if (editingUser) {
            await handleUpdate(formData);
        } else {
            await handleCreate(formData);
        }
    };

    // Handle edit
    const handleEdit = (user) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    // Handle add new
    const handleAddNew = () => {
        setEditingUser(null);
        setIsFormOpen(true);
    };

    // Handle close form
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingUser(null);
    };

    return (
        <div className="app">
            <div className="header">
                <h1>Quản lý Users</h1>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm theo tên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleAddNew}>
                        + Thêm User
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {loading ? (
                <div className="loading">Đang tải dữ liệu...</div>
            ) : (
                <>
                    <UserTable
                        users={currentUsers}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}

            <UserForm
                user={editingUser}
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSave={handleSave}
            />
        </div>
    );
}

// Render ứng dụng
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
