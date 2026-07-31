const AdminPrerequisites = {
    render: function() {
        document.getElementById('page-content').innerHTML = `
            <div class="page-header mb-6">
                <h2 class="text-2xl font-bold">Quản lý Môn tiên quyết</h2>
            </div>
            <div class="card p-4 data-table-wrapper" id="prerequisites-table-container"></div>
        `;
        if (window.lucide) lucide.createIcons();
        this.renderTable();
    },
    
    renderTable: function() {
        const preReqs = Store.getPrerequisites();
        
        DataTable.render({
            containerId: 'prerequisites-table-container',
            title: 'Danh sách môn tiên quyết',
            data: preReqs,
            searchFields: ['courseCode', 'courseName', 'prerequisiteCode', 'prerequisiteName'],
            filters: [
                { field: 'type', label: 'Loại tiên quyết', options: [
                    {value: 'mandatory', label: 'Bắt buộc'},
                    {value: 'recommended', label: 'Khuyến nghị'}
                ]}
            ],
            addBtn: {
                label: 'Thêm môn tiên quyết',
                onClick: () => this.showAddModal()
            },
            columns: [
                { field: 'courseCode', label: 'Môn học', render: (val, row) => `${row.courseCode} - ${row.courseName}` },
                { field: 'prerequisiteCode', label: 'Môn tiên quyết', render: (val, row) => `${row.prerequisiteCode} - ${row.prerequisiteName}` },
                { field: 'type', label: 'Loại', render: val => val === 'mandatory' ? '<span class="badge badge-error">Bắt buộc</span>' : '<span class="badge badge-info">Khuyến nghị</span>' }
            ],
            actions: [
                {
                    icon: 'trash-2',
                    label: 'Xóa',
                    className: 'text-error',
                    onClick: (row) => this.deletePrerequisite(row.id)
                }
            ],
            pageSize: 10
        });
    },

    showAddModal: function() {
        const courses = Store.getCourses();
        const courseOptions = courses.map(c => ({ value: c.code, label: `${c.code} - ${c.name}` }));
        
        Modal.form({
            title: 'Thêm Môn tiên quyết',
            fields: [
                { name: 'courseCode', label: 'Môn học', type: 'select', options: courseOptions, required: true },
                { name: 'prerequisiteCode', label: 'Môn tiên quyết', type: 'select', options: courseOptions, required: true },
                { name: 'type', label: 'Loại', type: 'select', options: [
                    {value: 'mandatory', label: 'Bắt buộc'},
                    {value: 'recommended', label: 'Khuyến nghị'}
                ], required: true }
            ],
            onSubmit: (data) => {
                if (data.courseCode === data.prerequisiteCode) {
                    Toast.error('Lỗi', 'Môn học và môn tiên quyết không được trùng nhau');
                    return false;
                }
                const c1 = Store.getCourseByCode(data.courseCode);
                const c2 = Store.getCourseByCode(data.prerequisiteCode);
                const newData = {
                    ...data,
                    courseName: c1 ? c1.name : '',
                    prerequisiteName: c2 ? c2.name : ''
                };
                
                Store.addPrerequisite(newData);
                Toast.success('Thành công', 'Đã thêm môn tiên quyết');
                this.renderTable();
                return true;
            }
        });
    },

    deletePrerequisite: function(id) {
        Modal.confirm({
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc chắn muốn xóa quan hệ tiên quyết này?',
            onConfirm: () => {
                Store.deletePrerequisite(id);
                Toast.success('Thành công', 'Đã xóa môn tiên quyết');
                this.renderTable();
            }
        });
    }
};
