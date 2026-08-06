const AdminCurriculum = {
    render: function() {
        document.getElementById('page-content').innerHTML = `
            <div class="page-header mb-6">
                <h2 class="text-2xl font-bold">Quản lý Chương trình đào tạo</h2>
            </div>
            <div class="card p-4 data-table-wrapper" id="curriculum-table-container"></div>
        `;
        if (window.lucide) lucide.createIcons();
        this.renderTable();
    },
    
    renderTable: function() {
        const curricula = Store.getCurricula();
        const faculties = Store.getFaculties ? Store.getFaculties().map(f => ({value: f.name || f, label: f.name || f})) : [];
        
        DataTable.render({
            containerId: 'curriculum-table-container',
            title: 'Danh sách CTĐT',
            data: curricula,
            searchFields: ['code', 'name'],
            filters: [
                { field: 'faculty', label: 'Khoa', options: faculties },
                { field: 'status', label: 'Trạng thái', options: [
                    {value: 'active', label: 'Đang áp dụng'},
                    {value: 'draft', label: 'Bản nháp'},
                    {value: 'archived', label: 'Đã lưu trữ'}
                ]}
            ],
            addBtn: {
                label: 'Thêm CTĐT',
                onClick: () => this.showAddModal()
            },
            columns: [
                { field: 'code', label: 'Mã CTĐT' },
                { field: 'name', label: 'Tên chương trình' },
                { field: 'faculty', label: 'Khoa' },
                { field: 'totalCredits', label: 'Tổng tín chỉ' },
                { field: 'status', label: 'Trạng thái', render: val => Utils.getCurriculumStatusBadge(val) }
            ],
            actions: [
                {
                    icon: 'eye',
                    label: 'Xem chi tiết',
                    onClick: (row) => this.showDetailModal(row.id)
                },
                {
                    icon: 'edit',
                    label: 'Cập nhật trạng thái',
                    onClick: (row) => this.showEditStatusModal(row.id)
                }
            ],
            pageSize: 10
        });
    },

    showAddModal: function() {
        Modal.form({
            title: 'Thêm Chương trình đào tạo',
            fields: [
                { name: 'code', label: 'Mã CTĐT', type: 'text', required: true },
                { name: 'name', label: 'Tên chương trình', type: 'text', required: true },
                { name: 'faculty', label: 'Khoa', type: 'select', options: Store.getFaculties ? Store.getFaculties().map(f => ({value: f.name || f, label: f.name || f})) : [], required: true },
                { name: 'mandatoryCredits', label: 'Tín chỉ bắt buộc', type: 'number', required: true },
                { name: 'electiveCredits', label: 'Tín chỉ tự chọn', type: 'number', required: true }
            ],
            onSubmit: async (data) => {
                const curricula = Store.getCurricula();
                if (curricula.find(c => c.code === data.code)) {
                    Toast.error('Lỗi', 'Mã CTĐT đã tồn tại');
                    return false;
                }
                data.totalCredits = parseInt(data.mandatoryCredits) + parseInt(data.electiveCredits);
                data.status = 'draft';
                data.courses = [];
                await Store.addCurriculum(data);
                Toast.success('Thành công', 'Đã thêm CTĐT');
                this.renderTable();
                return true;
            }
        });
    },

    showEditStatusModal: function(id) {
        const curriculum = Store.getCurriculumById(id);
        Modal.form({
            title: 'Cập nhật trạng thái',
            fields: [
                { name: 'status', label: 'Trạng thái', type: 'select', value: curriculum.status, options: [
                    {value: 'active', label: 'Đang áp dụng'},
                    {value: 'draft', label: 'Bản nháp'},
                    {value: 'archived', label: 'Đã lưu trữ'}
                ], required: true }
            ],
            onSubmit: async (data) => {
                await Store.updateCurriculum(id, { ...curriculum, status: data.status });
                Toast.success('Thành công', 'Đã cập nhật trạng thái');
                this.renderTable();
                return true;
            }
        });
    },

    showDetailModal: function(id) {
        const curriculum = Store.getCurriculumById(id);
        const coursesHtml = curriculum.courses && curriculum.courses.length > 0 
            ? curriculum.courses.map(c => `<li>${c.code} - ${c.name} (${c.credits} TC)</li>`).join('') 
            : '<li>Chưa có môn học</li>';
            
        const content = `
            <div class="space-y-3">
                <p><strong>Mã:</strong> ${curriculum.code}</p>
                <p><strong>Tên:</strong> ${curriculum.name}</p>
                <p><strong>Khoa:</strong> ${curriculum.faculty}</p>
                <p><strong>Tổng tín chỉ:</strong> ${curriculum.totalCredits}</p>
                <p><strong>Trạng thái:</strong> <span class="inline-block mt-1">${Utils.getCurriculumStatusBadge(curriculum.status)}</span></p>
                <div class="mt-4">
                    <strong class="block mb-2">Danh sách môn học:</strong>
                    <ul class="list-disc pl-5 max-h-40 overflow-y-auto">
                        ${coursesHtml}
                    </ul>
                </div>
            </div>
        `;
        Modal.confirm({
            title: 'Chi tiết Chương trình đào tạo',
            message: content,
            onConfirm: () => {}
        });
    }
};

