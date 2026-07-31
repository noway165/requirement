const AdvisorStudents = {
    render: function() {
        const user = Store.getCurrentUser() || { id: 1 };
        const myStudents = Store.getStudentsByAdvisor ? Store.getStudentsByAdvisor(user.id) : [];
        
        const html = `
            <div class="page-header mb-4">
                <h2>Quản lý Sinh viên</h2>
            </div>
            
            <div class="card p-4">
                <div class="filter-bar flex gap-3 mb-4">
                    <input type="text" id="search-student" class="form-control" placeholder="Tìm theo MSSV, tên..." style="flex: 1;">
                    <select id="filter-status" class="form-select" style="width: 200px;">
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Bình thường</option>
                        <option value="warning">Cảnh báo học vụ</option>
                        <option value="behind">Trễ tiến độ</option>
                    </select>
                </div>
                
                <div class="data-table-wrapper" id="students-table-container"></div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = html;
        
        this.renderTable(myStudents);
        
        // Event listeners
        document.getElementById('search-student').addEventListener('input', () => this.handleFilter(myStudents));
        document.getElementById('filter-status').addEventListener('change', () => this.handleFilter(myStudents));
        
        if (window.lucide) lucide.createIcons();
    },
    
    handleFilter: function(students) {
        const term = document.getElementById('search-student').value.toLowerCase();
        const status = document.getElementById('filter-status').value;
        
        const filtered = students.filter(st => {
            const matchSearch = st.mssv.toLowerCase().includes(term) || st.name.toLowerCase().includes(term);
            let stStatus = 'active';
            if (st.gpa < 2.0) stStatus = 'warning';
            else if (st.status === 'behind') stStatus = 'behind';
            
            const matchStatus = status === 'all' || stStatus === status;
            return matchSearch && matchStatus;
        });
        
        this.renderTable(filtered);
    },
    
    renderTable: function(data) {
        if (typeof DataTable === 'undefined') return;
        
        const columns = [
            { key: 'mssv', label: 'MSSV' },
            { key: 'name', label: 'Họ tên' },
            { key: 'faculty', label: 'Khoa' },
            { key: 'gpa', label: 'GPA', render: (val) => `<span class="${val < 2.0 ? 'text-red-500 font-bold' : ''}">${val.toFixed(2)}</span>` },
            { key: 'credits', label: 'Tín chỉ', render: (_, row) => `${row.creditsCompleted}/${row.creditsTotal || 120}` },
            { key: 'status', label: 'Trạng thái', render: (_, row) => {
                let badge = 'active';
                if (row.gpa < 2.0) badge = 'warning';
                else if (row.status === 'behind') badge = 'behind';
                return Utils.getStudentStatusBadge ? Utils.getStudentStatusBadge(badge) : badge;
            }},
            { key: 'actions', label: 'Thao tác', render: (_, row) => `
                <button class="btn btn-sm btn-outline-primary" onclick="AdvisorStudents.viewStudent('${row.id}')">
                    <i data-lucide="eye" class="w-4 h-4"></i> Chi tiết
                </button>
            `}
        ];
        
        DataTable.render({
            containerId: 'students-table-container',
            data: data,
            columns: columns,
            onRowClick: (row) => this.viewStudent(row.id)
        });
        if (window.lucide) lucide.createIcons();
    },
    
    viewStudent: function(id) {
        const student = Store.getStudentById ? Store.getStudentById(id) : null;
        if (!student) return;
        
        const grades = Store.getGradesByStudent ? Store.getGradesByStudent(student.id) : [];
        let gpaStatus = student.gpa < 2.0 ? 'Cảnh báo học vụ' : (student.status === 'behind' ? 'Trễ tiến độ' : 'Bình thường');
        
        const progress = Math.round((student.creditsCompleted / (student.creditsTotal || 120)) * 100);
        
        // Mock prereqs
        const remainingCourses = [
            { id: 'CS101', name: 'Nhập môn LT', prereqMet: true },
            { id: 'CS201', name: 'CTDL', prereqMet: false }
        ];

        const html = `
            <div class="student-profile-header flex gap-4 items-center mb-4 border-b pb-4">
                <div class="avatar w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                    ${student.name.charAt(0)}
                </div>
                <div>
                    <h3 class="text-xl font-bold">${student.name}</h3>
                    <p class="text-gray-600">${student.mssv} | ${student.major || student.faculty}</p>
                    <p class="text-sm text-gray-500">${student.email || student.mssv + '@vlu.edu.vn'}</p>
                </div>
            </div>
            
            <div class="grid-4 gap-3 mb-4" style="display: grid; grid-template-columns: repeat(4, 1fr);">
                <div class="card p-2 text-center bg-gray-50">
                    <div class="text-sm text-gray-500">GPA</div>
                    <div class="font-bold ${student.gpa < 2.0 ? 'text-red-500' : ''}">${student.gpa.toFixed(2)}</div>
                </div>
                <div class="card p-2 text-center bg-gray-50">
                    <div class="text-sm text-gray-500">Tín chỉ</div>
                    <div class="font-bold">${student.creditsCompleted}</div>
                </div>
                <div class="card p-2 text-center bg-gray-50">
                    <div class="text-sm text-gray-500">Tiến độ</div>
                    <div class="font-bold">${progress}%</div>
                </div>
                <div class="card p-2 text-center bg-gray-50">
                    <div class="text-sm text-gray-500">Trạng thái</div>
                    <div class="font-bold ${student.gpa < 2.0 ? 'text-red-500' : ''}">${gpaStatus}</div>
                </div>
            </div>
            
            <h4 class="font-bold mb-2 mt-4">Lịch sử học tập</h4>
            <div class="table-responsive max-h-60 overflow-y-auto mb-4">
                <table class="table w-full text-sm">
                    <thead><tr><th>Mã HP</th><th>Tên HP</th><th>Tín chỉ</th><th>Điểm</th></tr></thead>
                    <tbody>
                        ${grades.map(g => `
                            <tr>
                                <td>${g.courseId}</td>
                                <td>${g.courseName}</td>
                                <td>${g.credits}</td>
                                <td class="font-bold">${g.grade}</td>
                            </tr>
                        `).join('') || '<tr><td colspan="4" class="text-center">Chưa có dữ liệu điểm</td></tr>'}
                    </tbody>
                </table>
            </div>
            
            <h4 class="font-bold mb-2">Học phần chưa tích lũy (Kiểm tra điều kiện)</h4>
            <ul class="list-disc pl-5 text-sm">
                ${remainingCourses.map(c => `
                    <li class="mb-1">
                        ${c.id} - ${c.name}: 
                        ${c.prereqMet 
                            ? '<span class="badge bg-green-100 text-green-700">Đủ điều kiện</span>' 
                            : '<span class="badge bg-red-100 text-red-700">Chưa đủ ĐK tiên quyết</span>'}
                    </li>
                `).join('')}
            </ul>
        `;
        
        if (window.Modal) {
            Modal.show({
                title: 'Chi tiết Sinh viên',
                content: html,
                size: 'modal-lg',
                actions: [
                    { label: 'Đóng', class: 'btn-secondary', onClick: () => Modal.close() }
                ]
            });
            if (window.lucide) lucide.createIcons();
        }
    }
};
