// ============================================
// VLU SmartEdu — State Management Store
// ============================================

const Store = {
    _state: {},
    _listeners: [],

    init() {
        // Load from localStorage or use mock data
        if (!localStorage.getItem('vlu_smartedu_data')) {
            this._state = JSON.parse(JSON.stringify(MOCK_DATA));
            this.save();
        } else {
            this._state = JSON.parse(localStorage.getItem('vlu_smartedu_data'));
            // Always sync users from MOCK_DATA to fix password mismatches after updates
            this._state.users = JSON.parse(JSON.stringify(MOCK_DATA.users));
            this.save();
        }
        // Always ensure auth state
        this._state.auth = this._state.auth || { user: null, isLoggedIn: false };
    },

    save() {
        try {
            localStorage.setItem('vlu_smartedu_data', JSON.stringify(this._state));
        } catch (e) {
            console.warn('Failed to save state to localStorage');
        }
    },

    reset() {
        localStorage.removeItem('vlu_smartedu_data');
        this._state = JSON.parse(JSON.stringify(MOCK_DATA));
        this._state.auth = { user: null, isLoggedIn: false };
        this.save();
    },

    getState() { return this._state; },

    // ── Auth ──
    login(email, password) {
        const user = this._state.users.find(u => u.email === email && u.password === password);
        if (user) {
            this._state.auth = { user: { ...user }, isLoggedIn: true };
            this.save();
            return { success: true, user };
        }
        return { success: false, error: 'Email hoặc mật khẩu không đúng' };
    },

    logout() {
        this._state.auth = { user: null, isLoggedIn: false };
        this.save();
    },

    getAuth() { return this._state.auth; },
    getCurrentUser() { return this._state.auth?.user || null; },
    isLoggedIn() { return this._state.auth?.isLoggedIn || false; },

    // ── Students ──
    getStudents() { return this._state.students || []; },
    getStudentById(id) { return this._state.students.find(s => s.id === id); },
    getStudentByMSSV(mssv) { return this._state.students.find(s => s.mssv === mssv); },
    
    getStudentsByAdvisor(advisorId) {
        return this._state.students.filter(s => s.advisorId === advisorId);
    },

    addStudent(student) {
        if (this._state.students.find(s => s.mssv === student.mssv)) {
            return { success: false, error: 'MSSV đã tồn tại trong hệ thống' };
        }
        student.id = Utils.generateId('S');
        this._state.students.push(student);
        this.save();
        return { success: true, data: student };
    },

    updateStudent(id, updates) {
        const idx = this._state.students.findIndex(s => s.id === id);
        if (idx === -1) return { success: false, error: 'Không tìm thấy sinh viên' };
        if (updates.mssv && updates.mssv !== this._state.students[idx].mssv) {
            if (this._state.students.find(s => s.mssv === updates.mssv)) {
                return { success: false, error: 'MSSV đã tồn tại' };
            }
        }
        this._state.students[idx] = { ...this._state.students[idx], ...updates };
        this.save();
        return { success: true, data: this._state.students[idx] };
    },

    deleteStudent(id) {
        this._state.students = this._state.students.filter(s => s.id !== id);
        this.save();
        return { success: true };
    },

    // ── Courses ──
    getCourses() { return this._state.courses || []; },
    getCourseById(id) { return this._state.courses.find(c => c.id === id); },
    getCourseByCode(code) { return this._state.courses.find(c => c.code === code); },

    addCourse(course) {
        if (this._state.courses.find(c => c.code === course.code)) {
            return { success: false, error: 'Mã học phần đã tồn tại' };
        }
        course.id = Utils.generateId('C');
        this._state.courses.push(course);
        this.save();
        return { success: true, data: course };
    },

    updateCourse(id, updates) {
        const idx = this._state.courses.findIndex(c => c.id === id);
        if (idx === -1) return { success: false, error: 'Không tìm thấy học phần' };
        if (updates.code && updates.code !== this._state.courses[idx].code) {
            if (this._state.courses.find(c => c.code === updates.code)) {
                return { success: false, error: 'Mã học phần đã tồn tại' };
            }
        }
        this._state.courses[idx] = { ...this._state.courses[idx], ...updates };
        this.save();
        return { success: true, data: this._state.courses[idx] };
    },

    deleteCourse(id) {
        // Check if course is in any curriculum
        const inCurriculum = this._state.curricula.some(c => c.courses.includes(id));
        if (inCurriculum) return { success: false, error: 'Không thể xóa học phần đang có trong chương trình đào tạo' };
        // Check if course has open sections
        const hasSection = this._state.sections.some(s => s.courseId === id);
        if (hasSection) return { success: false, error: 'Không thể xóa học phần đang có lớp mở' };
        
        this._state.courses = this._state.courses.filter(c => c.id !== id);
        this._state.prerequisites = this._state.prerequisites.filter(p => p.courseId !== id && p.prerequisiteCourseId !== id);
        this.save();
        return { success: true };
    },

    // ── Prerequisites ──
    getPrerequisites() { return this._state.prerequisites || []; },
    getPrerequisitesForCourse(courseId) {
        return this._state.prerequisites.filter(p => p.courseId === courseId);
    },

    addPrerequisite(prereq) {
        // Check duplicate
        const exists = this._state.prerequisites.find(p => p.courseId === prereq.courseId && p.prerequisiteCourseId === prereq.prerequisiteCourseId);
        if (exists) return { success: false, error: 'Quan hệ tiên quyết đã tồn tại' };
        // Check self-reference
        if (prereq.courseId === prereq.prerequisiteCourseId) return { success: false, error: 'Học phần không thể là tiên quyết của chính nó' };
        // Check circular
        if (Utils.hasCircularDependency(prereq.courseId, prereq.prerequisiteCourseId, this._state.prerequisites)) {
            return { success: false, error: 'Phát hiện vòng lặp tiên quyết (Circular Dependency)' };
        }
        prereq.id = Utils.generateId('P');
        this._state.prerequisites.push(prereq);
        this.save();
        return { success: true, data: prereq };
    },

    updatePrerequisite(id, updates) {
        const idx = this._state.prerequisites.findIndex(p => p.id === id);
        if (idx === -1) return { success: false, error: 'Không tìm thấy' };
        this._state.prerequisites[idx] = { ...this._state.prerequisites[idx], ...updates };
        this.save();
        return { success: true };
    },

    deletePrerequisite(id) {
        this._state.prerequisites = this._state.prerequisites.filter(p => p.id !== id);
        this.save();
        return { success: true };
    },

    // ── Curricula ──
    getCurricula() { return this._state.curricula || []; },
    getCurriculumById(id) { return this._state.curricula.find(c => c.id === id); },

    addCurriculum(curriculum) {
        if (this._state.curricula.find(c => c.code === curriculum.code)) {
            return { success: false, error: 'Mã CTĐT đã tồn tại' };
        }
        curriculum.id = Utils.generateId('CUR');
        this._state.curricula.push(curriculum);
        this.save();
        return { success: true, data: curriculum };
    },

    updateCurriculum(id, updates) {
        const idx = this._state.curricula.findIndex(c => c.id === id);
        if (idx === -1) return { success: false, error: 'Không tìm thấy CTĐT' };
        this._state.curricula[idx] = { ...this._state.curricula[idx], ...updates };
        this.save();
        return { success: true };
    },

    // ── Sections ──
    getSections() { return this._state.sections || []; },
    getSectionById(id) { return this._state.sections.find(s => s.id === id); },

    addSection(section) {
        if (this._state.sections.find(s => s.code === section.code && s.semester === section.semester)) {
            return { success: false, error: 'Mã lớp đã tồn tại trong học kỳ này' };
        }
        section.id = Utils.generateId('SEC');
        this._state.sections.push(section);
        this.save();
        return { success: true, data: section };
    },

    updateSection(id, updates) {
        const idx = this._state.sections.findIndex(s => s.id === id);
        if (idx === -1) return { success: false, error: 'Không tìm thấy lớp HP' };
        this._state.sections[idx] = { ...this._state.sections[idx], ...updates };
        this.save();
        return { success: true };
    },

    // ── Grades ──
    getGrades() { return this._state.grades || []; },
    getGradesByStudent(studentId) { return this._state.grades.filter(g => g.studentId === studentId); },

    addOrUpdateGrade(gradeData) {
        const idx = this._state.grades.findIndex(g => g.studentId === gradeData.studentId && g.courseId === gradeData.courseId);
        if (idx !== -1) {
            this._state.grades[idx] = { ...this._state.grades[idx], ...gradeData };
        } else {
            gradeData.id = Utils.generateId('G');
            this._state.grades.push(gradeData);
        }
        this.save();
        return { success: true };
    },

    // ── Learning Paths ──
    getLearningPaths() { return this._state.learningPaths || []; },
    getLearningPathsByStudent(studentId) { return this._state.learningPaths.filter(lp => lp.studentId === studentId); },
    getPendingApprovals(advisorId) {
        const studentIds = this.getStudentsByAdvisor(advisorId).map(s => s.id);
        return this._state.learningPaths.filter(lp => studentIds.includes(lp.studentId) && lp.approvalStatus === 'pending');
    },

    addLearningPath(path) {
        path.id = Utils.generateId('LP');
        this._state.learningPaths.push(path);
        this.save();
        return { success: true, data: path };
    },

    updateLearningPath(id, updates) {
        const idx = this._state.learningPaths.findIndex(lp => lp.id === id);
        if (idx === -1) return { success: false, error: 'Không tìm thấy' };
        this._state.learningPaths[idx] = { ...this._state.learningPaths[idx], ...updates };
        this.save();
        return { success: true };
    },

    // ── Notifications ──
    getNotifications() { return this._state.notifications || []; },
    getNotificationsForUser(userId) {
        const student = this._state.students.find(s => s.id === userId || s.mssv === userId);
        const sid = student ? student.id : userId;
        return this._state.notifications.filter(n => n.to === sid || n.to === 'all');
    },
    getUnreadCount(userId) {
        return this.getNotificationsForUser(userId).filter(n => !n.read).length;
    },

    addNotification(notification) {
        notification.id = Utils.generateId('N');
        notification.createdAt = new Date().toISOString();
        this._state.notifications.unshift(notification);
        this.save();
        return { success: true };
    },

    markNotificationRead(id) {
        const n = this._state.notifications.find(n => n.id === id);
        if (n) { n.read = true; this.save(); }
    },

    markAllNotificationsRead(userId) {
        this.getNotificationsForUser(userId).forEach(n => n.read = true);
        this.save();
    },

    // 📊 Advisory Logs 📊
    getAdvisors() { return (this._state.users || []).filter(u => u.role === 'advisor'); },
    getAdvisoryLogs() { return this._state.advisoryLogs || []; },
    getLogsForStudent(studentId) { return this._state.advisoryLogs.filter(l => l.studentId === studentId); },

    addAdvisoryLog(log) {
        log.id = Utils.generateId('AL');
        log.createdAt = new Date().toISOString();
        this._state.advisoryLogs.push(log);
        this.save();
        return { success: true };
    },

    // ── Report Data ──
    getReportData() { return this._state.reportData; },

    // ── Faculties ──
    getFaculties() { return this._state.faculties || []; },

    // ── Career Targets ──
    getCareerTargets() { return this._state.careerTargets || []; },

    // ── Check Prerequisites ──
    checkPrerequisitesMet(studentId, courseId) {
        const prereqs = this.getPrerequisitesForCourse(courseId);
        const studentGrades = this.getGradesByStudent(studentId);
        
        return prereqs.map(p => {
            const prereqCourse = this.getCourseById(p.prerequisiteCourseId);
            const grade = studentGrades.find(g => g.courseId === p.prerequisiteCourseId && g.status === 'completed' && g.grade >= 4.0);
            return {
                prerequisite: prereqCourse,
                type: p.type,
                met: !!grade,
                grade: grade ? grade.grade : null
            };
        });
    },
};
