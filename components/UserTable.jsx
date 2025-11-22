// Component UserTable
function UserTable({ users, onEdit, onDelete }) {
    if (users.length === 0) {
        return (
            <div className="empty-state">
                <h3>Không có dữ liệu</h3>
                <p>Không tìm thấy user nào</p>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>
                                <div className="action-buttons">
                                    <button
                                        className="btn btn-secondary btn-small"
                                        onClick={() => onEdit(user)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn btn-danger btn-small"
                                        onClick={() => onDelete(user.id)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

