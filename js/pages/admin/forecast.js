// ============================================
// VLU SmartEdu — Admin Forecast Page
// ============================================

const AdminForecast = {
    render() {
        return `
            <div class="page-header">
                <div>
                    <h2 class="page-title">Dự báo Nhu cầu học tập</h2>
                    <p class="page-subtitle">Dữ liệu dự báo dựa trên lộ trình cá nhân hóa của sinh viên</p>
                </div>
                <div class="header-actions">
                    <select class="form-control" style="width: 200px" id="forecast-semester">
                        <option value="HK1 2026-2027">HK1 2026-2027</option>
                        <option value="HK2 2026-2027">HK2 2026-2027</option>
                    </select>
                    <button class="btn btn-primary" onclick="AdminForecast.exportData()">
                        <i data-lucide="download"></i> Xuất dữ liệu
                    </button>
                </div>
            </div>

            <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 24px;">
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(59,130,246,0.1); color: var(--primary)">
                        <i data-lucide="users"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">3,450</div>
                        <div class="stat-label">Sinh viên đã chốt lộ trình</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(16,185,129,0.1); color: var(--success)">
                        <i data-lucide="book-open"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">120</div>
                        <div class="stat-label">Môn học có nhu cầu cao</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(245,158,11,0.1); color: var(--warning)">
                        <i data-lucide="alert-triangle"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">15</div>
                        <div class="stat-label">Lớp có nguy cơ quá tải</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Danh sách môn học dự báo</h3>
                    <div class="header-actions">
                        <div class="search-box">
                            <i data-lucide="search"></i>
                            <input type="text" id="search-forecast" placeholder="Tìm kiếm môn học..." class="form-control">
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table" id="forecast-table">
                            <thead>
                                <tr>
                                    <th>Mã HP</th>
                                    <th>Tên học phần</th>
                                    <th>Khoa</th>
                                    <th>SL SV dự kiến</th>
                                    <th>Số lớp đề xuất</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Data will be loaded here -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    init() {
        this.loadData();
        const searchInput = document.getElementById('search-forecast');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.loadData(e.target.value);
            });
        }
        if (window.lucide) lucide.createIcons();
    },

    loadData(search = '') {
        const tbody = document.querySelector('#forecast-table tbody');
        if (!tbody) return;

        // Mock data based on courses
        let mockForecast = [
            { code: 'CS101', name: 'Nhập môn Lập trình', faculty: 'CNTT', count: 450, recommended: 12, status: 'Bình thường' },
            { code: 'CS201', name: 'Lập trình Hướng đối tượng', faculty: 'CNTT', count: 320, recommended: 9, status: 'Nguy cơ thiếu lớp' },
            { code: 'CS302', name: 'Phát triển Ứng dụng Web', faculty: 'CNTT', count: 280, recommended: 7, status: 'Bình thường' },
            { code: 'GE101', name: 'Toán Cao cấp 1', faculty: 'CNTT', count: 600, recommended: 15, status: 'Nhu cầu cao' },
            { code: 'CS401', name: 'Trí tuệ Nhân tạo', faculty: 'CNTT', count: 150, recommended: 4, status: 'Bình thường' },
            { code: 'BA101', name: 'Kinh tế Vi mô', faculty: 'QTKD', count: 380, recommended: 10, status: 'Nguy cơ thiếu lớp' },
        ];

        if (search) {
            search = search.toLowerCase();
            mockForecast = mockForecast.filter(f => 
                f.code.toLowerCase().includes(search) || 
                f.name.toLowerCase().includes(search)
            );
        }

        tbody.innerHTML = mockForecast.map(item => `
            <tr>
                <td style="font-weight: 500">${item.code}</td>
                <td>${item.name}</td>
                <td><span class="badge badge-info">${item.faculty}</span></td>
                <td style="font-weight: 600; color: var(--primary)">${item.count}</td>
                <td>${item.recommended}</td>
                <td>
                    <span class="badge ${this.getStatusBadge(item.status)}">${item.status}</span>
                </td>
            </tr>
        `).join('');
    },

    getStatusBadge(status) {
        if (status === 'Nguy cơ thiếu lớp') return 'badge-danger';
        if (status === 'Nhu cầu cao') return 'badge-warning';
        return 'badge-success';
    },

    exportData() {
        alert('Đã xuất dữ liệu dự báo thành công!');
    }
};

window.AdminForecast = AdminForecast;
