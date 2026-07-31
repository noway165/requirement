const AdminStudents = {
    render: function() {
        document.getElementById('page-content').innerHTML = `
            <div class="page-header mb-6">
                <h2 class="text-2xl font-bold">Quản lý sinh viên</h2>
            </div>
            <div class="card p-4 data-table-wrapper" id="students-table-container"></div>
        `;
        if (window.lucide) lucide.createIcons();
        this.renderTable();
    },
    
    renderTable: function() {
        const students = Store.getStudents();
        const faculties = Store.getFaculties ? Store.getFaculties().map(f => ({value: f.name || f, label: f.name || f})) : [];
        
        DataTable.render({
            containerId: 'students-table-container',
            title: 'Danh sách sinh viên',
            data: students,
            searchFields: ['mssv', 'name', 'email'],
            filters: [
                { field: 'faculty', label: 'Khoa', options: faculties },
                { field: 'status', label: 'Trạng thái', options: [
                    {value: 'active', label: 'Đang học'},
                    {value: 'locked', label: 'Khóa'},
                    {value: 'graduated', label: 'Đã tốt nghiệp'}
                ]}
            ],
            addBtn: {
                label: 'Thêm sinh viên',
                onClick: () => this.showAddModal()
            },
            columns: [
                { field: 'mssv', label: 'MSSV' },
                { field: 'name', label: 'Họ tên' },
                { field: 'email', label: 'Email' },
                { field: 'faculty', label: 'Khoa' },
                { field: 'gpa', label: 'GPA', render: val => Utils.formatNumber(val) },
                { field: 'status', label: 'Trạng thái', render: val => Utils.getStudentStatusBadge(val) }
            ],
            actions: [
                {
                    icon: 'eye',
                    label: 'Xem chi tiết',
                    onClick: (row) => this.showDetailModal(row.id)
                },
                {
                    icon: 'edit',
                    label: 'Sửa',
                    onClick: (row) => this.showEditModal(row.id)
                },
                {
                    icon: 'lock',
                    label: 'Khóa/Mở khóa',
                    onClick: (row) => this.toggleStatus(row.id)
                },
                {
                    icon: 'trash-2',
                    label: 'Xóa',
                    className: 'text-error',
                    onClick: (row) => this.deleteStudent(row.id)
                }
            ],
            pageSize: 10
        });
    },

    showAddModal: function() {
        Modal.form({
            title: 'Thêm sinh viên mới',
            fields: [
                { name: 'mssv', label: 'MSSV', type: 'text', required: true },
                { name: 'name', label: 'Họ tên', type: 'text', required: true },
                { name: 'email', label: 'Email', type: 'email', required: true },
                { name: 'faculty', label: 'Khoa', type: 'select', options: Store.getFaculties ? Store.getFaculties().map(f => ({value: f.name || f, label: f.name || f})) : [], required: true },
                { name: 'gpa', label: 'GPA', type: 'number', required: true }
            ],
            onSubmit: async (data) => {
                const students = Store.getStudents();
                if (students.find(s => s.mssv === data.mssv)) {
                    Toast.error('Lỗi', 'MSSV đã tồn tại');
                    return false;
                }
                data.status = 'active';
                await Store.addStudent(data);
                Toast.success('Thành công', 'Đã thêm sinh viên');
                this.renderTable();
                return true;
            }
        });
    },

    showEditModal: function(id) {
        const student = Store.getStudentById(id);
        Modal.form({
            title: 'Sửa thông tin sinh viên',
            fields: [
                { name: 'mssv', label: 'MSSV', type: 'text', value: student.mssv, required: true },
                { name: 'name', label: 'Họ tên', type: 'text', value: student.name, required: true },
                { name: 'email', label: 'Email', type: 'email', value: student.email, required: true },
                { name: 'faculty', label: 'Khoa', type: 'select', value: student.faculty, options: Store.getFaculties ? Store.getFaculties().map(f => ({value: f.name || f, label: f.name || f})) : [], required: true },
                { name: 'gpa', label: 'GPA', type: 'number', value: student.gpa, required: true }
            ],
            onSubmit: async (data) => {
                const students = Store.getStudents();
                if (students.find(s => s.mssv === data.mssv && s.id !== id)) {
                    Toast.error('Lỗi', 'MSSV đã tồn tại');
                    return false;
                }
                await Store.updateStudent(id, data);
                Toast.success('Thành công', 'Đã cập nhật sinh viên');
                this.renderTable();
                return true;
            }
        });
    },

    showDetailModal: function(id) {
        const student = Store.getStudentById(id);
        const content = `
            <div class="space-y-3">
                <p><strong>MSSV:</strong> ${student.mssv}</p>
                <p><strong>Họ tên:</strong> ${student.name}</p>
                <p><strong>Email:</strong> ${student.email}</p>
                <p><strong>Khoa:</strong> ${student.faculty}</p>
                <p><strong>GPA:</strong> ${Utils.formatNumber(student.gpa)}</p>
                <p><strong>Trạng thái:</strong> <span class="inline-block mt-1">${Utils.getStudentStatusBadge(student.status)}</span></p>
            </div>
        `;
        Modal.confirm({
            title: 'Chi tiết sinh viên',
            message: content,
            onConfirm: () => {}
        });
    },

    toggleStatus: async function(id) {
        const student = Store.getStudentById(id);
        const newStatus = student.status === 'locked' ? 'active' : 'locked';
        await Store.updateStudent(id, { ...student, status: newStatus });
        Toast.success('Thành công', 'Đã thay đổi trạng thái');
        this.renderTable();
    },

    deleteStudent: function(id) {
        Modal.confirm({
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc chắn muốn xóa sinh viên này?',
            onConfirm: async () => {
                await Store.deleteStudent(id);
                Toast.success('Thành công', 'Đã xóa sinh viên');
                this.renderTable();
            }
        });
    }
};

