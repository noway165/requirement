window.StudentDashboard = {
    render: function() {
        const user = Store.getCurrentUser();
        const students = Store.getStudents() || [];
        const student = students.find(s => s.email === user.email);
        
        if (!student) {
            document.getElementById('page-content').innerHTML = '<div class="empty-state">Student data not found</div>';
            return;
        }

        const grades = Store.getGradesByStudent(student.id) || [];
        const allCourses = Store.getCourses() || [];
        const notifications = Store.getNotificationsForUser(student.id) || [];
        
        // Calculate stats
        let totalCredits = 0;
        let earnedCredits = 0;
        let totalPoints = 0;
        
        const completedCourses = grades.filter(g => g.grade >= 5);
        completedCourses.forEach(g => {
            const course = allCourses.find(c => c.id === g.courseId);
            if (course) {
                earnedCredits += course.credits;
                totalPoints += (g.grade * course.credits);
            }
        });
        
        // Get total curriculum credits
        const curriculum = student.curriculumId ? Store.getCurriculumById(student.curriculumId) : null;
        totalCredits = curriculum ? curriculum.totalCredits : 140;
        
        const gpa = earnedCredits > 0 ? (totalPoints / earnedCredits).toFixed(2) : '0.00';
        const progressPercent = Math.round((earnedCredits / totalCredits) * 100) || 0;
        
        const inProgressCourses = grades.filter(g => g.status === 'in-progress').length;
        
        const gpaColor = gpa >= 8.0 ? 'var(--success)' : (gpa >= 6.5 ? 'var(--primary)' : (gpa >= 5.0 ? 'var(--warning)' : 'var(--danger)'));

        const html = `
            <div class="page-title-section">
                <div>
                    <h1 class="page-title">Xin chào, ${student.name}!</h1>
                    <p class="page-description">Mã SV: ${student.mssv} — Ngành: ${student.major}</p>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon" style="background:var(--primary-100);color:${gpaColor}">
                        <i data-lucide="graduation-cap"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">GPA Tích lũy</div>
                        <div class="stat-value" style="color:${gpaColor}">${gpa}</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon success">
                        <i data-lucide="book-open"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Tín chỉ hoàn thành</div>
                        <div class="stat-value">${earnedCredits} / ${totalCredits}</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon info">
                        <i data-lucide="target"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Tiến độ học tập</div>
                        <div class="stat-value">${progressPercent}%</div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon warning">
                        <i data-lucide="clock"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Môn học hiện tại</div>
                        <div class="stat-value">${inProgressCourses}</div>
                    </div>
                </div>
            </div>
            
            <div class="charts-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Tiến độ tổng quan</h3>
                    </div>
                    <div class="progress-ring-container" style="padding:var(--space-6) 0">
                        <canvas id="progressChart"></canvas>
                        <div class="progress-ring-text">
                            <span class="progress-ring-value">${progressPercent}%</span>
                            <span class="progress-ring-label">Hoàn thành</span>
                        </div>
                    </div>
                    <div style="text-align:center;margin-top:var(--space-4);">
                        <button class="btn btn-outline" onclick="Router.navigate('/student/learning-path')" style="width:100%;">
                            Xem lộ trình chi tiết
                        </button>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Môn học học kỳ này</h3>
                    </div>
                    <div class="data-table-wrapper" style="border:none;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Mã môn</th>
                                    <th>Tên môn</th>
                                    <th>Tín chỉ</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${grades.filter(g => g.status === 'in-progress').map(g => {
                                    const course = allCourses.find(c => c.id === g.courseId);
                                    if (!course) return '';
                                    const badge = Utils.getCourseStatusBadge(g.status);
                                    return `
                                        <tr>
                                            <td style="font-family:var(--font-mono);font-size:var(--text-xs);">${course.code}</td>
                                            <td><strong>${course.name}</strong></td>
                                            <td>${course.credits}</td>
                                            <td><span class="badge ${badge.class}">${badge.text}</span></td>
                                        </tr>
                                    `;
                                }).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--text-secondary);">Không có môn học nào đang học</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="charts-grid" style="margin-top:var(--space-6);">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i data-lucide="bell" style="width:18px;height:18px;margin-right:8px;vertical-align:-4px;"></i>Thông báo mới</h3>
                    </div>
                    <div class="notification-list" style="max-height: 250px;">
                        ${notifications.slice(0, 5).map(n => `
                            <div class="notification-item" style="padding:var(--space-3) 0; border-bottom: 1px solid var(--border-secondary);">
                                <div class="notification-dot" style="margin-top:6px;${n.read ? 'opacity:0.3;background:var(--text-tertiary);' : ''}"></div>
                                <div class="notification-content">
                                    <div class="notification-text"><strong>${n.title}</strong></div>
                                    <div class="notification-time">${Utils.timeAgo(n.createdAt)}</div>
                                </div>
                            </div>
                        `).join('') || '<div class="empty-state" style="padding:var(--space-6);"><p>Không có thông báo nào</p></div>'}
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Hành động nhanh</h3>
                    </div>
                    <div class="quick-actions" style="grid-template-columns: repeat(3, 1fr);">
                        <div class="quick-action-btn" onclick="Router.navigate('/student/learning-path')">
                            <i data-lucide="route"></i>
                            <span>Lộ trình học tập</span>
                        </div>
                        <div class="quick-action-btn" onclick="Router.navigate('/student/advisory')">
                            <i data-lucide="bot"></i>
                            <span>Tư vấn AI</span>
                        </div>
                        <div class="quick-action-btn" onclick="Router.navigate('/student/career')">
                            <i data-lucide="briefcase"></i>
                            <span>Tư vấn Nghề nghiệp</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = html;
        if (window.lucide) lucide.createIcons();
        
        // Render progress chart
        setTimeout(() => {
            if (window.Charts && typeof Charts.progressRing === 'function') {
                Charts.progressRing('progressChart', earnedCredits, totalCredits, {
                    label: 'Hoàn thành'
                });
            }
        }, 100);
    }
};
