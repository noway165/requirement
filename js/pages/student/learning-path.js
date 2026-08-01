window.StudentLearningPath = {
    render: function() {
        const user = Store.getCurrentUser();
        const students = Store.getStudents() || [];
        const student = students.find(s => s.email === user.email);
        
        if (!student) {
            document.getElementById('page-content').innerHTML = '<div class="alert alert-error">Student data not found</div>';
            return;
        }

        const grades = Store.getGradesByStudent(student.id) || [];
        const allCourses = Store.getCourses() || [];
        
        // Group courses by semester (mock logic: assuming curriculum has course list with semester mapping)
        // If no curriculum mapping, group dynamically
        const curriculum = student.curriculumId ? Store.getCurriculumById(student.curriculumId) : null;
        let semesters = {};
        
        if (curriculum && curriculum.courses) {
            curriculum.courses.forEach(courseId => {
                const course = allCourses.find(c => c.id === courseId);
                if (course) {
                    const s = course.semester || 1;
                    if (!semesters[s]) semesters[s] = [];
                    semesters[s].push(course);
                }
            });
        } else {
            // Fallback: Mock semesters
            for (let i = 1; i <= 8; i++) {
                semesters[i] = allCourses.slice((i-1)*5, i*5);
            }
        }
        
        let totalCourses = 0;
        let completedCourses = 0;
        let totalCredits = 0;
        let earnedCredits = 0;
        let totalPoints = 0;

        let timelineHtml = `
            <style>
                .game-map {
                    position: relative;
                    padding: 2rem 0;
                    min-height: 400px;
                }
                .game-map::before {
                    content: '';
                    position: absolute;
                    top: 0; bottom: 0;
                    left: 50%;
                    width: 6px;
                    background: linear-gradient(to bottom, rgba(139,92,246,0.15), rgba(59,130,246,0.15), rgba(16,185,129,0.15));
                    transform: translateX(-50%);
                    border-radius: 3px;
                }

                /* ── Semester Gate ── */
                .semester-gate {
                    position: relative;
                    margin-bottom: 1rem;
                    z-index: 5;
                }
                .gate-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.6rem 1.8rem;
                    border-radius: 2rem;
                    font-weight: 800;
                    font-size: 0.95rem;
                    letter-spacing: 0.03em;
                    color: #fff;
                    box-shadow: 0 4px 20px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.25);
                    border: 2px solid rgba(255,255,255,0.2);
                    position: relative;
                    overflow: hidden;
                }
                .gate-badge::before {
                    content: '';
                    position: absolute;
                    top: -50%; left: -50%;
                    width: 200%; height: 200%;
                    background: conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1), transparent, transparent);
                    animation: gate-shimmer 4s linear infinite;
                }
                @keyframes gate-shimmer {
                    to { transform: rotate(360deg); }
                }
                .gate-1 .gate-badge { background: linear-gradient(135deg, #8B5CF6, #6D28D9); }
                .gate-2 .gate-badge { background: linear-gradient(135deg, #3B82F6, #1D4ED8); }
                .gate-3 .gate-badge { background: linear-gradient(135deg, #06B6D4, #0891B2); }
                .gate-4 .gate-badge { background: linear-gradient(135deg, #10B981, #059669); }
                .gate-5 .gate-badge { background: linear-gradient(135deg, #F59E0B, #D97706); }
                .gate-6 .gate-badge { background: linear-gradient(135deg, #EF4444, #DC2626); }
                .gate-7 .gate-badge { background: linear-gradient(135deg, #EC4899, #DB2777); }
                .gate-8 .gate-badge { background: linear-gradient(135deg, #8B5CF6, #7C3AED); }

                /* ── Course Nodes Serpentine ── */
                .node-row {
                    display: flex;
                    justify-content: center;
                    gap: 1.2rem;
                    margin-bottom: 1.5rem;
                    position: relative;
                    z-index: 2;
                    flex-wrap: wrap;
                }
                .node-row:nth-child(odd) { padding-left: 3rem; }
                .node-row:nth-child(even) { padding-right: 3rem; }

                /* ── Game Node ── */
                .gnode {
                    width: 160px;
                    cursor: pointer;
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s;
                    position: relative;
                }
                .gnode:hover { transform: translateY(-8px) scale(1.04); }
                .gnode:hover .gnode-card { box-shadow: 0 12px 40px rgba(0,0,0,0.25); }

                .gnode-card {
                    background: var(--bg-primary);
                    border-radius: 1.2rem;
                    padding: 1rem 0.8rem 0.8rem;
                    text-align: center;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
                    border: 1px solid var(--border-primary);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    min-height: 175px;
                }
                .gnode-card::after {
                    content: '';
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    height: 4px;
                    border-radius: 0 0 1.2rem 1.2rem;
                }

                /* Status styling */
                .gnode-completed .gnode-card::after { background: linear-gradient(90deg, #10B981, #6EE7B7); }
                .gnode-inprogress .gnode-card::after { background: linear-gradient(90deg, #F59E0B, #FCD34D); }
                .gnode-failed .gnode-card::after { background: linear-gradient(90deg, #EF4444, #FCA5A5); }
                .gnode-pending .gnode-card::after { background: linear-gradient(90deg, #4B5563, #6B7280); }

                .gnode-completed .gnode-card { border-color: rgba(16,185,129,0.5); box-shadow: 0 4px 20px rgba(16,185,129,0.15); }
                .gnode-inprogress .gnode-card { border-color: rgba(245,158,11,0.5); box-shadow: 0 4px 20px rgba(245,158,11,0.15); }
                .gnode-failed .gnode-card { border-color: rgba(239,68,68,0.4); box-shadow: 0 4px 20px rgba(239,68,68,0.1); }

                /* ── Orb Icon ── */
                .gnode-orb {
                    width: 52px; height: 52px;
                    border-radius: 50%;
                    margin: 0 auto 0.6rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    border: 3px solid transparent;
                }
                .gnode-completed .gnode-orb {
                    background: rgba(16,185,129,0.15);
                    border-color: #10B981;
                    box-shadow: 0 0 12px rgba(16,185,129,0.3);
                }
                .gnode-inprogress .gnode-orb {
                    background: rgba(245,158,11,0.15);
                    border-color: #F59E0B;
                    box-shadow: 0 0 12px rgba(245,158,11,0.3);
                    animation: orb-pulse 2s ease-in-out infinite;
                }
                .gnode-failed .gnode-orb {
                    background: rgba(239,68,68,0.15);
                    border-color: #EF4444;
                    box-shadow: 0 0 12px rgba(239,68,68,0.2);
                }
                .gnode-pending .gnode-orb {
                    background: rgba(107,114,128,0.15);
                    border-color: #6B7280;
                }

                @keyframes orb-pulse {
                    0%, 100% { box-shadow: 0 0 8px rgba(245,158,11,0.3); }
                    50% { box-shadow: 0 0 20px rgba(245,158,11,0.5); }
                }

                /* ── Text ── */
                .gnode-name {
                    font-weight: 700;
                    font-size: 0.78rem;
                    line-height: 1.3;
                    margin-bottom: 0.3rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    flex-grow: 1;
                    color: var(--text-primary);
                }
                .gnode-code {
                    font-size: 0.65rem;
                    color: var(--text-secondary);
                    font-family: var(--font-mono, monospace);
                    margin-bottom: 0.4rem;
                }

                /* ── Grade Pill ── */
                .grade-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.25rem 0.6rem;
                    border-radius: 1rem;
                    font-size: 0.72rem;
                    font-weight: 700;
                }
                .grade-pill-completed { background: rgba(16,185,129,0.2); color: #6EE7B7; border: 1px solid rgba(16,185,129,0.3); }
                .grade-pill-failed { background: rgba(239,68,68,0.2); color: #FCA5A5; border: 1px solid rgba(239,68,68,0.3); }

                /* ── Input Hint ── */
                .input-hint {
                    margin-top: auto;
                    padding-top: 0.4rem;
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: #60A5FA;
                    animation: hint-blink 1.5s ease-in-out infinite;
                }
                @keyframes hint-blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }

                /* ── Connector dots between rows ── */
                .connector-dots {
                    display: flex;
                    justify-content: center;
                    gap: 6px;
                    margin: 0.4rem 0 0.8rem;
                    position: relative;
                    z-index: 1;
                }
                .connector-dots span {
                    width: 6px; height: 6px;
                    border-radius: 50%;
                    background: #8B5CF6;
                    animation: dot-fade 1.2s ease-in-out infinite;
                }
                .connector-dots span:nth-child(2) { animation-delay: 0.2s; }
                .connector-dots span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes dot-fade {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }

                /* ── XP Progress bar ── */
                .xp-bar-wrap {
                    height: 10px;
                    background: rgba(107,114,128,0.2);
                    border-radius: 5px;
                    overflow: hidden;
                    border: 1px solid rgba(107,114,128,0.3);
                }
                .xp-bar-fill {
                    height: 100%;
                    border-radius: 5px;
                    background: linear-gradient(90deg, #8B5CF6, #3B82F6, #10B981);
                    transition: width 1s ease;
                    position: relative;
                }
                .xp-bar-fill::after {
                    content: '';
                    position: absolute;
                    top: 0; right: 0; bottom: 0;
                    width: 30px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4));
                    animation: xp-shine 2s ease-in-out infinite;
                }
                @keyframes xp-shine {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }

                /* ── Legend ── */
                .legend-item {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                }
                .legend-dot {
                    width: 10px; height: 10px;
                    border-radius: 50%;
                    border: 2px solid;
                }
            </style>
            <div class="game-map">
        `;
        
        const semKeys = Object.keys(semesters).sort((a,b) => a-b);
        
        semKeys.forEach((sem, semIdx) => {
            const courses = semesters[sem];
            if (!courses || courses.length === 0) return;
            
            const gateNum = (semIdx % 8) + 1;
            
            timelineHtml += `
                <div class="semester-gate gate-${gateNum}" style="text-align:center; margin-bottom:1.5rem;">
                    <div class="gate-badge">
                        <span style="font-size:1.1rem">🏰</span> Cửa ải ${sem}: Học kỳ ${sem}
                    </div>
                </div>
            `;
            
            // Split courses into rows of 3 for serpentine layout
            const rows = [];
            for (let i = 0; i < courses.length; i += 3) {
                rows.push(courses.slice(i, i + 3));
            }
            
            rows.forEach((rowCourses, rowIdx) => {
                timelineHtml += `<div class="node-row">`;
                
                rowCourses.forEach(course => {
                    totalCourses++;
                    totalCredits += course.credits;
                    
                    const gradeInfo = grades.find(g => g.courseId === course.id);
                    let status = 'pending';
                    let gradeVal = null;
                    
                    if (gradeInfo) {
                        if (gradeInfo.grade >= 5) {
                            status = 'completed';
                            completedCourses++;
                            earnedCredits += course.credits;
                            totalPoints += (Utils.convert10To4Scale(gradeInfo.grade) * course.credits);
                            gradeVal = gradeInfo.grade;
                        } else if (gradeInfo.status === 'in-progress' || gradeInfo.status === 'in_progress') {
                            status = 'in_progress';
                        } else if (gradeInfo.grade !== null && gradeInfo.grade < 5) {
                            status = 'failed';
                            gradeVal = gradeInfo.grade;
                        }
                    }
                    
                    let statusClass = 'gnode-pending';
                    let iconEmoji = '🔒';
                    if (status === 'completed') { statusClass = 'gnode-completed'; iconEmoji = '⭐'; }
                    if (status === 'in_progress') { statusClass = 'gnode-inprogress'; iconEmoji = '📖'; }
                    if (status === 'failed') { statusClass = 'gnode-failed'; iconEmoji = '❌'; }
                    
                    let gradePill = '';
                    if (status === 'completed') {
                        gradePill = `<div class="grade-pill grade-pill-completed">✓ ${gradeVal} điểm</div>`;
                    } else if (status === 'failed') {
                        gradePill = `<div class="grade-pill grade-pill-failed">✗ ${gradeVal} điểm</div>`;
                    }
                    
                    let inputHint = (gradeVal === null) ? `<div class="input-hint">✏️ Nhập điểm</div>` : '';
                    
                    timelineHtml += `
                        <div class="gnode ${statusClass}" onclick="StudentLearningPath.openGradeModal('${course.id}', '${course.name}', ${gradeVal !== null ? gradeVal : 'null'})">
                            <div class="gnode-card">
                                <div class="gnode-orb">
                                    <span style="font-size:1.4rem">${iconEmoji}</span>
                                </div>
                                <div class="gnode-name" title="${course.name}">${course.name}</div>
                                <div class="gnode-code">${course.code} • ${course.credits} TC</div>
                                ${gradePill}
                                ${inputHint}
                            </div>
                        </div>
                    `;
                });
                
                timelineHtml += `</div>`;
                
                // Add animated connector dots between rows
                if (rowIdx < rows.length - 1) {
                    timelineHtml += `<div class="connector-dots"><span></span><span></span><span></span></div>`;
                }
            });
            
            // Add connector between semesters
            if (semIdx < semKeys.length - 1) {
                timelineHtml += `
                    <div style="text-align:center; margin: 1rem 0 2rem;">
                        <div class="connector-dots"><span></span><span></span><span></span></div>
                    </div>
                `;
            }
        });
        timelineHtml += `</div>`;
        
        const gpa = earnedCredits > 0 ? (totalPoints / earnedCredits).toFixed(2) : '0.00';
        const progressPercent = Math.round((completedCourses / totalCourses) * 100) || 0;

        const html = `
            <div class="mb-6 flex justify-between items-start">
                <div>
                    <h1 class="text-2xl font-bold mb-2">🗺️ Bản đồ Chinh phục</h1>
                    <p class="text-gray-600 mb-4">Hành trình chinh phục chương trình đào tạo của bạn — mỗi môn học là một cửa ải!</p>
                    <div class="bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-100 flex items-center gap-2 text-sm">
                        <i data-lucide="info" class="w-4 h-4"></i>
                        Nhấp vào từng môn học bên dưới để cập nhật điểm số thực tế.
                    </div>
                </div>
                <button class="btn btn-primary flex items-center gap-2" onclick="StudentLearningPath.openSendModal()">
                    <i data-lucide="send" class="w-4 h-4"></i> Gửi Cố vấn duyệt
                </button>
            </div>
            
            <div class="card p-6 mb-8">
                <div style="display:flex; flex-wrap:wrap; gap:1.5rem; align-items:center; margin-bottom:1.2rem;">
                    <div style="flex:1; min-width:120px; text-align:center;">
                        <div style="font-size:1.8rem; margin-bottom:0.2rem;">📚</div>
                        <div class="text-xl font-bold">${totalCourses}</div>
                        <div class="text-xs text-gray-500">Tổng môn học</div>
                    </div>
                    <div style="flex:1; min-width:120px; text-align:center;">
                        <div style="font-size:1.8rem; margin-bottom:0.2rem;">⭐</div>
                        <div class="text-xl font-bold" style="color:#10B981">${completedCourses}</div>
                        <div class="text-xs text-gray-500">Đã chinh phục</div>
                    </div>
                    <div style="flex:1; min-width:120px; text-align:center;">
                        <div style="font-size:1.8rem; margin-bottom:0.2rem;">🔒</div>
                        <div class="text-xl font-bold" style="color:#6B7280">${totalCourses - completedCourses}</div>
                        <div class="text-xs text-gray-500">Còn lại</div>
                    </div>
                    <div style="flex:1; min-width:120px; text-align:center;">
                        <div style="font-size:1.8rem; margin-bottom:0.2rem;">🏆</div>
                        <div class="text-xl font-bold" style="color:#8B5CF6">${gpa}/4.0</div>
                        <div class="text-xs text-gray-500">GPA Tích lũy</div>
                    </div>
                </div>
                
                <div style="margin-bottom:0.5rem; display:flex; justify-content:space-between; align-items:center;">
                    <span class="text-xs font-bold" style="color:#8B5CF6">XP PROGRESS</span>
                    <span class="text-xs font-bold" style="color:var(--text-secondary)">${progressPercent}%</span>
                </div>
                <div class="xp-bar-wrap">
                    <div class="xp-bar-fill" style="width: ${progressPercent}%"></div>
                </div>
                
                <div style="margin-top:1rem; display:flex; flex-wrap:wrap; gap:1rem; justify-content:center;">
                    <span class="legend-item"><span class="legend-dot" style="background:rgba(16,185,129,0.3); border-color:#10B981"></span> Hoàn thành</span>
                    <span class="legend-item"><span class="legend-dot" style="background:rgba(245,158,11,0.3); border-color:#F59E0B"></span> Đang học</span>
                    <span class="legend-item"><span class="legend-dot" style="background:rgba(239,68,68,0.3); border-color:#EF4444"></span> Rớt</span>
                    <span class="legend-item"><span class="legend-dot" style="background:rgba(107,114,128,0.3); border-color:#6B7280"></span> Chưa học</span>
                </div>
            </div>
            
            <div class="learning-path-timeline">
                ${timelineHtml}
            </div>
        `;
        
        document.getElementById('page-content').innerHTML = html;
        if (window.lucide) lucide.createIcons();
    },
    
    openGradeModal: function(courseId, courseName, currentGrade) {
        const val = currentGrade !== null ? currentGrade : '';
        const html = `
            <form id="gradeForm" onsubmit="StudentLearningPath.saveGrade(event, '${courseId}')">
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Môn học</label>
                    <input type="text" class="w-full px-3 py-2 border rounded bg-gray-100" value="${courseName}" readonly>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Điểm số (0-10)</label>
                    <input type="number" id="gradeValue" class="w-full px-3 py-2 border rounded" min="0" max="10" step="0.1" value="${val}" required>
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" class="btn btn-secondary" onclick="Modal.close()">Hủy</button>
                    <button type="submit" class="btn btn-primary">Lưu điểm</button>
                </div>
            </form>
        `;
        Modal.show({ title: 'Cập nhật điểm', content: html });
    },
    
    saveGrade: async function(event, courseId) {
        event.preventDefault();
        const gradeVal = parseFloat(document.getElementById('gradeValue').value);
        if (isNaN(gradeVal) || gradeVal < 0 || gradeVal > 10) {
            Toast.show('Điểm không hợp lệ', 'error');
            return;
        }
        
        const user = Store.getCurrentUser();
        const students = Store.getStudents() || [];
        const student = students.find(s => s.email === user.email);
        
        await Store.addOrUpdateGrade({
            studentId: student.id,
            courseId: courseId,
            grade: gradeVal,
            status: gradeVal >= 5 ? 'completed' : 'failed'
        });
        
        Modal.close();
        Toast.show('Cập nhật điểm thành công!', 'success');
        this.render();
    },
    
    openSendModal: function() {
        const html = `
            <form id="sendPlanForm" onsubmit="StudentLearningPath.sendPlan(event)">
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Học kỳ dự kiến</label>
                    <select id="planSemester" class="w-full px-3 py-2 border rounded" required>
                        <option value="HK1 2026-2027">Học kỳ 1 2026-2027</option>
                        <option value="HK2 2026-2027">Học kỳ 2 2026-2027</option>
                        <option value="HK hè 2026-2027">Học kỳ hè 2026-2027</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 font-bold mb-2">Danh sách môn đăng ký (Nhập mã môn cách nhau bằng dấu phẩy)</label>
                    <input type="text" id="planCourses" class="w-full px-3 py-2 border rounded" placeholder="VD: CS101, CS201" required>
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" class="btn btn-secondary" onclick="Modal.close()">Hủy</button>
                    <button type="submit" class="btn btn-primary">Gửi duyệt</button>
                </div>
            </form>
        `;
        Modal.show({ title: 'Gửi Lộ trình học tập', content: html });
    },
    
    sendPlan: async function(event) {
        event.preventDefault();
        const semester = document.getElementById('planSemester').value;
        const coursesInput = document.getElementById('planCourses').value;
        
        const courses = coursesInput.split(',').map(c => c.trim().toUpperCase()).filter(c => c);
        
        if (courses.length === 0) {
            Toast.show('Vui lòng nhập ít nhất 1 mã môn học', 'error');
            return;
        }
        
        const user = Store.getCurrentUser();
        const students = Store.getStudents() || [];
        const student = students.find(s => s.email === user.email);
        
        if (Store.addLearningPath) {
            await Store.addLearningPath({
                studentId: student.id,
                semester: semester,
                selectedCourses: courses,
                suggestedCourses: courses,
                totalCredits: courses.length * 3, // Mock calculation
                createdAt: new Date().toISOString().split('T')[0],
                advisorNote: '',
                approvalStatus: 'pending'
            });
            
            if (Store.addNotification && student.advisorId) {
                await Store.addNotification({
                    from: student.id,
                    to: student.advisorId,
                    title: 'Lộ trình học tập mới',
                    content: `Sinh viên ${student.name} (${student.mssv}) vừa gửi lộ trình học tập ${semester} chờ phê duyệt.`,
                    type: 'info',
                    createdAt: new Date().toISOString(),
                    read: false
                });
            }

            Toast.success('Thành công', 'Đã gửi kế hoạch học tập cho cố vấn!');
            Modal.close();
        } else {
            Toast.error('Lỗi', 'Tính năng chưa sẵn sàng');
        }
    }
};
