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
            curriculum.courses.forEach(cc => {
                const s = cc.semester || 1;
                if (!semesters[s]) semesters[s] = [];
                const course = allCourses.find(c => c.id === cc.courseId);
                if (course) {
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

        let timelineHtml = '';
        
        Object.keys(semesters).sort((a,b) => a-b).forEach(sem => {
            const courses = semesters[sem];
            if (!courses || courses.length === 0) return;
            
            timelineHtml += `
                <div class="semester-block mb-8">
                    <h3 class="text-xl font-bold mb-4 flex items-center">
                        <i data-lucide="calendar" class="mr-2"></i> Học kỳ ${sem}
                    </h3>
                    <div class="course-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            `;
            
            courses.forEach(course => {
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
                        totalPoints += (gradeInfo.grade * course.credits);
                        gradeVal = gradeInfo.grade;
                    } else if (gradeInfo.status === 'in_progress') {
                        status = 'in_progress';
                    } else if (gradeInfo.grade !== null && gradeInfo.grade < 5) {
                        status = 'failed';
                        gradeVal = gradeInfo.grade;
                    }
                }
                
                let borderColor = 'border-gray-200';
                let bgClass = 'bg-white';
                if (status === 'completed') { borderColor = 'border-green-500'; bgClass = 'bg-green-50'; }
                if (status === 'in_progress') { borderColor = 'border-yellow-500'; bgClass = 'bg-yellow-50'; }
                if (status === 'failed') { borderColor = 'border-red-500'; bgClass = 'bg-red-50'; }

                timelineHtml += `
                    <div class="course-card card p-4 border-l-4 ${borderColor} ${bgClass} cursor-pointer hover:shadow-md transition-shadow" 
                         onclick="StudentLearningPath.openGradeModal('${course.id}', '${course.name}', ${gradeVal !== null ? gradeVal : 'null'})">
                        <div class="flex justify-between items-start mb-2">
                            <span class="font-bold text-gray-700">${course.code}</span>
                            ${Utils.getStudentStatusBadge(status)}
                        </div>
                        <h4 class="font-semibold mb-2 line-clamp-2" title="${course.name}">${course.name}</h4>
                        <div class="flex justify-between items-center text-sm text-gray-500 mt-auto">
                            <span>${course.credits} TC</span>
                            ${gradeVal !== null ? `<span class="font-bold text-gray-800">Điểm: ${gradeVal}</span>` : ''}
                        </div>
                    </div>
                `;
            });
            
            timelineHtml += `
                    </div>
                </div>
            `;
        });
        
        const gpa = earnedCredits > 0 ? (totalPoints / earnedCredits).toFixed(2) : '0.00';
        const progressPercent = Math.round((completedCourses / totalCourses) * 100) || 0;

        const html = `
            <div class="mb-6">
                <h1 class="text-2xl font-bold mb-2">Lộ trình học tập</h1>
                <p class="text-gray-600">Quản lý và theo dõi tiến độ các môn học trong chương trình đào tạo của bạn.</p>
            </div>
            
            <div class="card p-6 mb-8">
                <div class="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <div class="text-center px-4">
                        <div class="text-sm text-gray-500">Tổng môn học</div>
                        <div class="text-xl font-bold">${totalCourses}</div>
                    </div>
                    <div class="text-center px-4">
                        <div class="text-sm text-gray-500">Đã hoàn thành</div>
                        <div class="text-xl font-bold text-green-600">${completedCourses}</div>
                    </div>
                    <div class="text-center px-4">
                        <div class="text-sm text-gray-500">Còn lại</div>
                        <div class="text-xl font-bold text-gray-600">${totalCourses - completedCourses}</div>
                    </div>
                    <div class="text-center px-4">
                        <div class="text-sm text-gray-500">GPA Tích lũy</div>
                        <div class="text-xl font-bold text-blue-600">${gpa}</div>
                    </div>
                </div>
                
                <div class="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div class="bg-blue-600 h-4 rounded-full" style="width: ${progressPercent}%"></div>
                </div>
                <div class="text-right text-sm text-gray-600">${progressPercent}% hoàn thành</div>
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
        Modal.show('Cập nhật điểm', html);
    },
    
    saveGrade: function(event, courseId) {
        event.preventDefault();
        const gradeVal = parseFloat(document.getElementById('gradeValue').value);
        if (isNaN(gradeVal) || gradeVal < 0 || gradeVal > 10) {
            Toast.show('Điểm không hợp lệ', 'error');
            return;
        }
        
        const user = Store.getCurrentUser();
        const students = Store.getStudents() || [];
        const student = students.find(s => s.email === user.email);
        
        Store.addOrUpdateGrade({
            studentId: student.id,
            courseId: courseId,
            grade: gradeVal,
            status: gradeVal >= 5 ? 'completed' : 'failed'
        });
        
        Modal.close();
        Toast.show('Cập nhật điểm thành công!', 'success');
        this.render();
    }
};
