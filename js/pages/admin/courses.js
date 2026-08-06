const AdminCourses = {
    render: function() {
        document.getElementById('page-content').innerHTML = `
            <div class="page-header mb-6">
                <h2 class="text-2xl font-bold">Quản lý môn học</h2>
            </div>
            <div class="card p-4 data-table-wrapper" id="courses-table-container"></div>
        `;
        if (window.lucide) lucide.createIcons();
        this.renderTable();
    },
    
    renderTable: function() {
        const courses = Store.getCourses();
        const faculties = Store.getFaculties ? Store.getFaculties().map(f => ({value: f.name || f, label: f.name || f})) : [];
        
        DataTable.render({
            containerId: 'courses-table-container',
            title: 'Danh sách môn học',
            data: courses,
            searchFields: ['code', 'name'],
            filters: [
                { field: 'faculty', label: 'Khoa', options: faculties },
                { field: 'type', label: 'Loại môn học', options: [
                    {value: 'mandatory', label: 'Bắt buộc'},
                    {value: 'elective', label: 'Tự chọn'}
                ]}
            ],
            addBtn: {
                label: 'Thêm môn học',
                onClick: () => this.showAddModal()
            },
            columns: [
                { field: 'code', label: 'Mã môn' },
                { field: 'name', label: 'Tên môn học' },
                { field: 'credits', label: 'Số tín chỉ' },
                { field: 'faculty', label: 'Khoa' },
                { field: 'type', label: 'Loại', render: val => val === 'mandatory' ? '<span class="badge badge-primary">Bắt buộc</span>' : '<span class="badge badge-secondary">Tự chọn</span>' }
            ],
            actions: [
                {
                    icon: 'edit',
                    label: 'Sửa',
                    onClick: (row) => this.showEditModal(row.id)
                },
                {
                    icon: 'trash-2',
                    label: 'Xóa',
                    className: 'text-error',
                    onClick: (row) => this.deleteCourse(row.id)
                }
            ],
            pageSize: 10
        });
    },

    showAddModal: function() {
        Modal.form({
            title: 'Thêm môn học mới',
            fields: [
                { name: 'code', label: 'Mã môn', type: 'text', required: true },
                { name: 'name', label: 'Tên môn học', type: 'text', required: true },
                { name: 'credits', label: 'Số tín chỉ', type: 'number', required: true },
                { name: 'faculty', label: 'Khoa', type: 'select', options: Store.getFaculties ? Store.getFaculties().map(f => ({value: f.name || f, label: f.name || f})) : [], required: true },
                { name: 'type', label: 'Loại', type: 'select', options: [
                    {value: 'mandatory', label: 'Bắt buộc'},
                    {value: 'elective', label: 'Tự chọn'}
                ], required: true }
            ],
            onSubmit: async (data) => {
                const courses = Store.getCourses();
                if (courses.find(c => c.code === data.code)) {
                    Toast.error('Lỗi', 'Mã môn học đã tồn tại');
                    return false;
                }
                if (!Utils.validateCredits(parseInt(data.credits, 10))) {
                    Toast.error('Lỗi', 'Số tín chỉ phải lớn hơn 0');
                    return false;
                }
                data.credits = parseInt(data.credits, 10);
                await Store.addCourse(data);
                Toast.success('Thành công', 'Đã thêm môn học');
                this.renderTable();
                return true;
            }
        });
    },

    showEditModal: function(id) {
        const course = Store.getCourses().find(c => c.id === id);
        Modal.form({
            title: 'Sửa môn học',
            fields: [
                { name: 'code', label: 'Mã môn', type: 'text', value: course.code, required: true },
                { name: 'name', label: 'Tên môn học', type: 'text', value: course.name, required: true },
                { name: 'credits', label: 'Số tín chỉ', type: 'number', value: course.credits, required: true },
                { name: 'faculty', label: 'Khoa', type: 'select', value: course.faculty, options: Store.getFaculties ? Store.getFaculties().map(f => ({value: f.name || f, label: f.name || f})) : [], required: true },
                { name: 'type', label: 'Loại', type: 'select', value: course.type, options: [
                    {value: 'mandatory', label: 'Bắt buộc'},
                    {value: 'elective', label: 'Tự chọn'}
                ], required: true }
            ],
            onSubmit: async (data) => {
                const courses = Store.getCourses();
                if (courses.find(c => c.code === data.code && c.id !== id)) {
                    Toast.error('Lỗi', 'Mã môn học đã tồn tại');
                    return false;
                }
                if (!Utils.validateCredits(parseInt(data.credits, 10))) {
                    Toast.error('Lỗi', 'Số tín chỉ phải lớn hơn 0');
                    return false;
                }
                data.credits = parseInt(data.credits, 10);
                await Store.updateCourse(id, data);
                Toast.success('Thành công', 'Đã cập nhật môn học');
                this.renderTable();
                return true;
            }
        });
    },

    deleteCourse: function(id) {
        Modal.confirm({
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc chắn muốn xóa môn học này?',
            onConfirm: async () => {
                const course = Store.getCourses().find(c => c.id === id);
                
                // Business rule check (mock checks for curricula and sections)
                const inCurriculum = false; // should check real data if available
                const hasSections = false; // should check real data if available
                
                if (inCurriculum || hasSections) {
                    Toast.error('Lỗi', 'Không thể xóa môn học đang có trong CTĐT hoặc có lớp học phần');
                    return;
                }
                
                await Store.deleteCourse(id);
                Toast.success('Thành công', 'Đã xóa môn học');
                this.renderTable();
            }
        });
    }
};

