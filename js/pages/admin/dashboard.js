// ============================================
// VLU SmartEdu — Admin Dashboard (Phòng Đào tạo)
// Premium UI Rewrite
// ============================================

const AdminDashboard = {
    render: function() {
        const students = Store.getStudents ? Store.getStudents() : [];
        const courses = Store.getCourses ? Store.getCourses() : [];
        const curricula = Store.getCurricula ? Store.getCurricula() : [];
        const sections = Store.getSections ? Store.getSections() : [];
        const user = Store.getCurrentUser();

        const activeStudents = students.filter(s => s.status === 'active').length;
        const warningStudents = students.filter(s => s.status === 'warning').length;
        const behindStudents = students.filter(s => s.status === 'behind').length;
        const openSections = sections.filter(s => s.status === 'open').length;
        const activeCurricula = curricula.filter(c => c.status === 'active').length;
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

        const html = `
        <div class="admin-dashboard">
            <!-- Hero Welcome Banner -->
            <div class="dashboard-hero">
                <div class="hero-content">
                    <div class="hero-text">
                        <div class="hero-greeting">
                            <i data-lucide="sun" class="hero-greeting-icon"></i>
                            <span>${greeting}, ${user?.name || 'Admin'}!</span>
                        </div>
                        <h1 class="hero-title">Bảng điều khiển <span class="hero-highlight">Phòng Đào tạo</span></h1>
                        <p class="hero-subtitle">Tổng quan hệ thống giáo dục — HK1 2025-2026</p>
                    </div>
                    <div class="hero-actions">
                        <button class="btn btn-primary hero-btn" onclick="Router.navigate('/admin/reports')">
                            <i data-lucide="bar-chart-3"></i> Xem báo cáo
                        </button>
                        <button class="btn btn-secondary hero-btn" onclick="Router.navigate('/admin/students')">
                            <i data-lucide="users"></i> Quản lý sinh viên
                        </button>
                    </div>
                </div>
                <div class="hero-decoration">
                    <div class="hero-orb hero-orb-1"></div>
                    <div class="hero-orb hero-orb-2"></div>
                </div>
            </div>

            <!-- KPI Stats Row -->
            <div class="kpi-grid">
                <div class="kpi-card kpi-blue" onclick="Router.navigate('/admin/students')">
                    <div class="kpi-icon-wrap">
                        <i data-lucide="users"></i>
                    </div>
                    <div class="kpi-info">
                        <div class="kpi-value">${students.length.toLocaleString('vi-VN')}</div>
                        <div class="kpi-label">Tổng sinh viên</div>
                        <div class="kpi-sub">${activeStudents} đang học · ${warningStudents} cảnh báo · ${behindStudents} chậm tiến độ</div>
                    </div>
                    <div class="kpi-trend kpi-trend-up">
                        <i data-lucide="trending-up"></i> +5%
                    </div>
                </div>

                <div class="kpi-card kpi-green" onclick="Router.navigate('/admin/courses')">
                    <div class="kpi-icon-wrap">
                        <i data-lucide="book-open"></i>
                    </div>
                    <div class="kpi-info">
                        <div class="kpi-value">${courses.length}</div>
                        <div class="kpi-label">Học phần</div>
                        <div class="kpi-sub">${courses.filter(c=>c.type==='mandatory').length} bắt buộc · ${courses.filter(c=>c.type==='elective').length} tự chọn</div>
                    </div>
                    <div class="kpi-trend kpi-trend-up">
                        <i data-lucide="trending-up"></i> +2%
                    </div>
                </div>

                <div class="kpi-card kpi-purple" onclick="Router.navigate('/admin/curriculum')">
                    <div class="kpi-icon-wrap">
                        <i data-lucide="graduation-cap"></i>
                    </div>
                    <div class="kpi-info">
                        <div class="kpi-value">${curricula.length}</div>
                        <div class="kpi-label">Chương trình ĐT</div>
                        <div class="kpi-sub">${activeCurricula} đang áp dụng · ${curricula.filter(c=>c.status==='draft').length} bản nháp</div>
                    </div>
                    <div class="kpi-trend kpi-trend-neutral">
                        <i data-lucide="minus"></i> 0%
                    </div>
                </div>

                <div class="kpi-card kpi-orange" onclick="Router.navigate('/admin/sections')">
                    <div class="kpi-icon-wrap">
                        <i data-lucide="calendar-plus"></i>
                    </div>
                    <div class="kpi-info">
                        <div class="kpi-value">${sections.length}</div>
                        <div class="kpi-label">Lớp học phần</div>
                        <div class="kpi-sub">${openSections} đang mở · ${sections.filter(s=>s.status==='closed').length} đã đóng</div>
                    </div>
                    <div class="kpi-trend kpi-trend-up">
                        <i data-lucide="trending-up"></i> +12%
                    </div>
                </div>
            </div>

            <!-- Alert Banner nếu có cảnh báo -->
            ${warningStudents > 0 || behindStudents > 0 ? `
            <div class="alert-banner">
                <div class="alert-banner-icon">
                    <i data-lucide="alert-triangle"></i>
                </div>
                <div class="alert-banner-text">
                    <strong>Chú ý:</strong> Có <strong>${warningStudents}</strong> sinh viên trong tình trạng cảnh báo học vụ và <strong>${behindStudents}</strong> sinh viên chậm tiến độ cần được theo dõi.
                </div>
                <button class="btn btn-sm alert-banner-btn" onclick="Router.navigate('/admin/students')">
                    Xem ngay <i data-lucide="arrow-right"></i>
                </button>
            </div>
            ` : ''}

            <!-- Main Content Grid -->
            <div class="dashboard-main-grid">
                <!-- Charts Column -->
                <div class="dashboard-charts-col">
                    <!-- Quick Nav -->
                    <div class="quick-nav-card card">
                        <div class="card-header-row">
                            <h3 class="card-title-lg"><i data-lucide="zap"></i> Truy cập nhanh</h3>
                        </div>
                        <div class="quick-nav-grid">
                            <button class="quick-nav-item" onclick="Router.navigate('/admin/students')">
                                <div class="qn-icon qn-blue"><i data-lucide="users"></i></div>
                                <span>Sinh viên</span>
                            </button>
                            <button class="quick-nav-item" onclick="Router.navigate('/admin/courses')">
                                <div class="qn-icon qn-green"><i data-lucide="book-open"></i></div>
                                <span>Học phần</span>
                            </button>
                            <button class="quick-nav-item" onclick="Router.navigate('/admin/curriculum')">
                                <div class="qn-icon qn-purple"><i data-lucide="graduation-cap"></i></div>
                                <span>CTĐT</span>
                            </button>
                            <button class="quick-nav-item" onclick="Router.navigate('/admin/prerequisites')">
                                <div class="qn-icon qn-teal"><i data-lucide="git-branch"></i></div>
                                <span>Tiên quyết</span>
                            </button>
                            <button class="quick-nav-item" onclick="Router.navigate('/admin/sections')">
                                <div class="qn-icon qn-orange"><i data-lucide="calendar-plus"></i></div>
                                <span>Mở lớp</span>
                            </button>
                            <button class="quick-nav-item" onclick="Router.navigate('/admin/reports')">
                                <div class="qn-icon qn-red"><i data-lucide="bar-chart-3"></i></div>
                                <span>Báo cáo</span>
                            </button>
                        </div>
                    </div>

                    <!-- Faculty Distribution Chart -->
                    <div class="card chart-card">
                        <div class="card-header-row">
                            <h3 class="card-title-lg"><i data-lucide="pie-chart"></i> Sinh viên theo khoa</h3>
                            <span class="card-badge">HK1 2025-2026</span>
                        </div>
                        <div class="chart-area-donut">
                            <canvas id="facultyChart"></canvas>
                        </div>
                        <div id="faculty-legend" class="chart-legend"></div>
                    </div>

                    <!-- GPA Distribution -->
                    <div class="card chart-card">
                        <div class="card-header-row">
                            <h3 class="card-title-lg"><i data-lucide="activity"></i> Phân bố điểm GPA</h3>
                            <span class="card-badge">Tất cả sinh viên</span>
                        </div>
                        <div class="chart-area-bar">
                            <canvas id="gpaChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Right Sidebar -->
                <div class="dashboard-sidebar-col">
                    <!-- Status Breakdown -->
                    <div class="card">
                        <div class="card-header-row">
                            <h3 class="card-title-lg"><i data-lucide="activity"></i> Tình trạng học vụ</h3>
                        </div>
                        <div class="status-breakdown">
                            <div class="status-item">
                                <div class="status-dot status-active"></div>
                                <div class="status-info">
                                    <span class="status-label">Đang học bình thường</span>
                                    <span class="status-count">${activeStudents}</span>
                                </div>
                                <div class="status-bar-wrap">
                                    <div class="status-bar status-bar-active" style="width:${students.length > 0 ? (activeStudents/students.length*100).toFixed(0) : 0}%"></div>
                                </div>
                            </div>
                            <div class="status-item">
                                <div class="status-dot status-warning"></div>
                                <div class="status-info">
                                    <span class="status-label">Cảnh báo học vụ</span>
                                    <span class="status-count">${warningStudents}</span>
                                </div>
                                <div class="status-bar-wrap">
                                    <div class="status-bar status-bar-warning" style="width:${students.length > 0 ? (warningStudents/students.length*100).toFixed(0) : 0}%"></div>
                                </div>
                            </div>
                            <div class="status-item">
                                <div class="status-dot status-behind"></div>
                                <div class="status-info">
                                    <span class="status-label">Chậm tiến độ</span>
                                    <span class="status-count">${behindStudents}</span>
                                </div>
                                <div class="status-bar-wrap">
                                    <div class="status-bar status-bar-behind" style="width:${students.length > 0 ? (behindStudents/students.length*100).toFixed(0) : 0}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Top Students -->
                    <div class="card">
                        <div class="card-header-row">
                            <h3 class="card-title-lg"><i data-lucide="award"></i> Sinh viên xuất sắc</h3>
                            <button class="card-link" onclick="Router.navigate('/admin/students')">Xem tất cả</button>
                        </div>
                        <div class="top-students-list">
                            ${students
                                .filter(s => s.gpa)
                                .sort((a,b) => b.gpa - a.gpa)
                                .slice(0,5)
                                .map((s, i) => `
                                <div class="top-student-item">
                                    <div class="top-student-rank rank-${i+1}">${i+1}</div>
                                    <div class="top-student-avatar">${(s.name||'?').charAt(0)}</div>
                                    <div class="top-student-info">
                                        <div class="top-student-name">${s.name}</div>
                                        <div class="top-student-detail">${s.mssv} · ${s.faculty}</div>
                                    </div>
                                    <div class="top-student-gpa gpa-${s.gpa >= 3.6 ? 'excellent' : s.gpa >= 3.0 ? 'good' : 'ok'}">${s.gpa?.toFixed(2) || '-'}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Sections Status -->
                    <div class="card">
                        <div class="card-header-row">
                            <h3 class="card-title-lg"><i data-lucide="layers"></i> Lớp học phần mới nhất</h3>
                            <button class="card-link" onclick="Router.navigate('/admin/sections')">Xem tất cả</button>
                        </div>
                        <div class="sections-mini-list">
                            ${sections.slice(0,5).map(sec => {
                                const course = courses.find(c => c.id === sec.courseId);
                                const pct = sec.maxStudents > 0 ? (sec.enrolledCount / sec.maxStudents * 100) : 0;
                                return `
                                <div class="section-mini-item">
                                    <div class="section-mini-info">
                                        <div class="section-mini-name">${course ? course.name : sec.code}</div>
                                        <div class="section-mini-detail">${sec.instructor} · ${sec.room}</div>
                                    </div>
                                    <div class="section-mini-fill">
                                        <div class="section-mini-count">${sec.enrolledCount}/${sec.maxStudents}</div>
                                        <div class="section-mini-bar">
                                            <div class="section-mini-progress ${pct >= 100 ? 'full' : pct >= 80 ? 'warn' : 'ok'}" style="width:${Math.min(pct,100)}%"></div>
                                        </div>
                                    </div>
                                    <span class="mini-badge ${sec.status === 'open' ? 'badge-open' : 'badge-closed'}">${sec.status === 'open' ? 'Mở' : 'Đóng'}</span>
                                </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        document.getElementById('page-content').innerHTML = html;
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            // Faculty donut chart
            const facStats = {};
            students.forEach(s => {
                const fac = s.faculty || 'Khác';
                facStats[fac] = (facStats[fac] || 0) + 1;
            });
            const facultyData = Object.keys(facStats).map(f => ({ label: f, value: facStats[f] }));
            Charts.donut('facultyChart', facultyData);

            // Build legend
            const colors = ['#C8102E','#3B82F6','#10B981','#F59E0B','#8B5CF6','#EC4899'];
            const legendEl = document.getElementById('faculty-legend');
            if (legendEl) {
                legendEl.innerHTML = facultyData.map((d, i) => `
                    <div class="legend-item">
                        <span class="legend-dot" style="background:${colors[i % colors.length]}"></span>
                        <span class="legend-label">${d.label}</span>
                        <span class="legend-value">${d.value}</span>
                    </div>
                `).join('');
            }

            // GPA bar chart
            const gpaStats = { '< 2.0': 0, '2.0–2.5': 0, '2.5–3.2': 0, '3.2–3.6': 0, '> 3.6': 0 };
            students.forEach(s => {
                const g = s.gpa || 0;
                if (g < 2.0) gpaStats['< 2.0']++;
                else if (g <= 2.5) gpaStats['2.0–2.5']++;
                else if (g <= 3.2) gpaStats['2.5–3.2']++;
                else if (g <= 3.6) gpaStats['3.2–3.6']++;
                else gpaStats['> 3.6']++;
            });
            const gpaData = Object.keys(gpaStats).map(k => ({ label: k, value: gpaStats[k] }));
            Charts.bar('gpaChart', gpaData);
        }, 100);
    }
};
