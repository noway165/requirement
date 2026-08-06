const AdminSections = {
    render: function() {
        document.getElementById('page-content').innerHTML = `
            <div class="page-header mb-6">
                <h2 class="text-2xl font-bold">Quản lý Lớp học phần</h2>
            </div>
            <div class="card p-4 data-table-wrapper" id="sections-table-container"></div>
        `;
        if (window.lucide) lucide.createIcons();
        this.renderTable();
    },
    
    renderTable: function() {
        const sections = Store.getSections();
        
        DataTable.render({
            containerId: 'sections-table-container',
            title: 'Danh sách Lớp học phần',
            data: sections,
            searchFields: ['code', 'courseName', 'instructor'],
            filters: [
                { field: 'semester', label: 'Học kỳ', options: [
                    {value: 'HK1_2023', label: 'HK1 2023-2024'},
                    {value: 'HK2_2023', label: 'HK2 2023-2024'},
                    {value: 'HKH_2023', label: 'HK Hè 2023-2024'},
                    {value: 'HK1_2024', label: 'HK1 2024-2025'}
                ]},
                { field: 'status', label: 'Trạng thái', options: [
                    {value: 'open', label: 'Đang mở'},
                    {value: 'closed', label: 'Đã đóng'},
                    {value: 'canceled', label: 'Đã hủy'}
                ]}
            ],
            addBtn: {
                label: 'Mở lớp mới',
                onClick: () => this.showAddModal()
            },
            columns: [
                { field: 'code', label: 'Mã LHP' },
                { field: 'courseId', label: 'Tên môn học', render: (val) => {
                    const c = Store.getCourseById(val);
                    return c ? c.name : '-';
                }},
                { field: 'instructor', label: 'Giảng viên' },
                { field: 'room', label: 'Phòng' },
                { field: 'schedule', label: 'Lịch học' },
                { field: 'enrolledCount', label: 'Sĩ số', render: (val, row) => {
                    const percent = (val / row.maxStudents) * 100;
                    const color = percent >= 100 ? 'bg-red-500' : (percent >= 80 ? 'bg-yellow-500' : 'bg-green-500');
                    return `
                        <div class="flex flex-col gap-1 w-full max-w-[100px]">
                            <div class="text-xs text-right">${val || 0}/${row.maxStudents}</div>
                            <div class="w-full bg-gray-200 rounded-full h-1.5">
                                <div class="${color} h-1.5 rounded-full" style="width: ${Math.min(percent || 0, 100)}%"></div>
                            </div>
                        </div>
                    `;
                } },
                { field: 'status', label: 'Trạng thái', render: val => Utils.getSectionStatusBadge(val) }
            ],
            actions: [
                {
                    icon: 'edit',
                    label: 'Sửa',
                    onClick: (row) => this.showEditModal(row.id)
                },
                {
                    icon: 'power',
                    label: 'Đóng/Mở lớp',
                    onClick: (row) => this.toggleStatus(row.id)
                },
                {
                    icon: 'trash-2',
                    label: 'Xóa',
                    class: 'text-red-500 hover:bg-red-50',
                    onClick: (row) => this.deleteSection(row.id)
                }
            ],
            pageSize: 10
        });
    },

    showAddModal: function() {
        const courses = Store.getCourses();
        const courseOptions = courses.map(c => ({ value: c.code, label: `${c.code} - ${c.name}` }));
        
        Modal.form({
            title: 'Mở Lớp học phần mới',
            fields: [
                { name: 'courseCode', label: 'Môn học', type: 'select', options: courseOptions, required: true },
                { name: 'code', label: 'Mã lớp (tùy chọn)', type: 'text' },
                { name: 'instructor', label: 'Giảng viên', type: 'text', required: true },
                { name: 'room', label: 'Phòng học', type: 'text', required: true },
                { name: 'schedule', label: 'Lịch học (VD: T2 1-3)', type: 'text', required: true },
                { name: 'maxStudents', label: 'Sĩ số tối đa', type: 'number', required: true },
                { name: 'semester', label: 'Học kỳ', type: 'select', options: [
                    {value: 'HK1_2023', label: 'HK1 2023-2024'},
                    {value: 'HK2_2023', label: 'HK2 2023-2024'},
                    {value: 'HK1_2024', label: 'HK1 2024-2025'},
                    {value: 'HKH_2024', label: 'HK Hè 2024-2025'}
                ], required: true }
            ],
            onSubmit: async (data) => {
                const course = Store.getCourseByCode(data.courseCode);
                data.courseId = course ? course.id : '';
                data.courseName = course ? course.name : '';
                data.code = data.code || `${data.courseCode}_${Math.floor(Math.random() * 1000)}`;
                data.enrolledCount = 0;
                data.maxStudents = parseInt(data.maxStudents, 10);
                data.status = 'open';
                
                await Store.addSection(data);
                Toast.success('Thành công', 'Đã mở lớp học phần');
                this.renderTable();
                return true;
            }
        });
    },

    showEditModal: function(id) {
        const section = Store.getSections().find(s => s.id === id);
        Modal.form({
            title: 'Sửa thông tin Lớp học phần',
            fields: [
                { name: 'instructor', label: 'Giảng viên', type: 'text', value: section.instructor, required: true },
                { name: 'room', label: 'Phòng học', type: 'text', value: section.room, required: true },
                { name: 'schedule', label: 'Lịch học', type: 'text', value: section.schedule, required: true },
                { name: 'maxStudents', label: 'Sĩ số tối đa', type: 'number', value: section.maxStudents, required: true }
            ],
            onSubmit: async (data) => {
                data.maxStudents = parseInt(data.maxStudents, 10);
                await Store.updateSection(id, { ...section, ...data });
                Toast.success('Thành công', 'Đã cập nhật lớp học phần');
                this.renderTable();
                return true;
            }
        });
    },

    toggleStatus: function(id) {
        const section = Store.getSections().find(s => s.id === id);
        const newStatus = section.status === 'open' ? 'closed' : 'open';
        
        Modal.confirm({
            title: 'Xác nhận',
            message: `Bạn có chắc chắn muốn ${newStatus === 'open' ? 'mở lại' : 'đóng'} lớp học phần này?`,
            onConfirm: async () => {
                await Store.updateSection(id, { ...section, status: newStatus });
                Toast.success('Thành công', 'Đã thay đổi trạng thái');
                this.renderTable();
            }
        });
    },

    deleteSection: function(id) {
        Modal.confirm({
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc chắn muốn xóa lớp học phần này? Thao tác này không thể hoàn tác.',
            onConfirm: async () => {
                const result = await Store.deleteSection(id);
                if (result.success) {
                    Toast.success('Thành công', 'Đã xóa lớp học phần');
                    this.renderTable();
                } else {
                    Toast.error('Lỗi', result.error);
                }
            }
        });
    }
};
