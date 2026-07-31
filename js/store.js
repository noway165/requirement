// ============================================
// VLU SmartEdu — State Management Store (Supabase Hybrid)
// ============================================

// TODO: Thay thế bằng URL và Anon Key thật của Supabase
const SUPABASE_URL = 'https://rgthapqlovwwtatfodks.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_vdMQPf0i0WNfNsMimXFHtg_OemUGt1d';

let supabase = null;

if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const Store = {
    _state: {
        users: [], faculties: [], students: [], courses: [],
        prerequisites: [], curricula: [], sections: [], grades: [],
        learningPaths: [], notifications: [], advisoryLogs: [], careerTargets: [],
        auth: { user: null, isLoggedIn: false }
    },

    async init() {
        if (!supabase) {
            console.error('Supabase SDK not loaded');
            return;
        }

        try {
            // Check current auth session
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                // Fetch user data from our users table based on auth email
                const { data: user } = await supabase.from('users').select('*').eq('email', session.user.email).single();
                if (user) {
                    this._state.auth = { user, isLoggedIn: true };
                }
            }

            // Load all required tables for Hybrid State
            const [
                { data: users }, { data: faculties }, { data: students },
                { data: courses }, { data: prerequisites }, { data: curricula },
                { data: sections }, { data: grades }, { data: learningPaths },
                { data: notifications }, { data: advisoryLogs }, { data: careerTargets }
            ] = await Promise.all([
                supabase.from('users').select('*'),
                supabase.from('faculties').select('*'),
                supabase.from('students').select('*'),
                supabase.from('courses').select('*'),
                supabase.from('prerequisites').select('*'),
                supabase.from('curricula').select('*'),
                supabase.from('sections').select('*'),
                supabase.from('grades').select('*'),
                supabase.from('learning_paths').select('*'),
                supabase.from('notifications').select('*').order('createdAt', { ascending: false }),
                supabase.from('advisory_logs').select('*'),
                supabase.from('career_targets').select('*')
            ]);

            this._state.users = users || [];
            this._state.faculties = faculties || [];
            this._state.students = students || [];
            this._state.courses = courses || [];
            this._state.prerequisites = prerequisites || [];
            this._state.curricula = curricula || [];
            this._state.sections = sections || [];
            this._state.grades = grades || [];
            this._state.learningPaths = learningPaths || [];
            this._state.notifications = notifications || [];
            this._state.advisoryLogs = advisoryLogs || [];
            this._state.careerTargets = careerTargets || [];

            this._state.reportData = this._calculateReportData();
        } catch (error) {
            console.error('Error loading data from Supabase:', error);
        }
    },

    getState() { return this._state; },

    _calculateReportData() {
        // Calculate report data dynamically based on the current state
        const studentsByFaculty = this._state.faculties.map(f => {
            const count = this._state.students.filter(s => s.faculty === f.code).length;
            return { faculty: f.code, count, percentage: 0 }; // percentage calculated below
        });
        const total = this._state.students.length || 1;
        studentsByFaculty.forEach(s => s.percentage = Math.round((s.count / total) * 100));

        const gpaRanges = [
            { range: '< 2.0', min: 0, max: 1.99, count: 0, color: '#EF4444' },
            { range: '2.0-2.5', min: 2.0, max: 2.49, count: 0, color: '#F59E0B' },
            { range: '2.5-3.0', min: 2.5, max: 2.99, count: 0, color: '#3B82F6' },
            { range: '3.0-3.5', min: 3.0, max: 3.49, count: 0, color: '#10B981' },
            { range: '3.5-4.0', min: 3.5, max: 4.0, count: 0, color: '#8B5CF6' }
        ];

        let active = 0, warning = 0, behind = 0;
        this._state.students.forEach(s => {
            if (s.status === 'active') active++;
            if (s.status === 'warning') warning++;
            if (s.status === 'behind') behind++;
            const gpa = parseFloat(s.gpa);
            if (!isNaN(gpa)) {
                const range = gpaRanges.find(r => gpa >= r.min && gpa <= r.max);
                if (range) range.count++;
            }
        });

        return {
            studentsByFaculty,
            gpaDistribution: gpaRanges.map(({range, count, color}) => ({range, count, color})),
            enrollmentTrend: [
                { semester: 'HK1 2024', count: 3100 },
                { semester: 'HK2 2024', count: 2950 },
                { semester: 'HK1 2025', count: 3300 },
                { semester: 'HK2 2025', count: total }
            ],
            statusStats: { total: this._state.students.length, active, warning, behind }
        };
    },

    // ── Auth ──
    async login(email, password) {
        // Since we are migrating from mock data, we will just use the "users" table directly for now.
        // In a real app, you would use supabase.auth.signInWithPassword.
        const user = this._state.users.find(u => u.email === email && u.password === password);
        if (user) {
            this._state.auth = { user, isLoggedIn: true };
            return { success: true, user };
        }
        return { success: false, error: 'Email hoặc mật khẩu không đúng' };
    },

    async logout() {
        this._state.auth = { user: null, isLoggedIn: false };
    },

    getAuth() { return this._state.auth; },
    getCurrentUser() { return this._state.auth?.user || null; },
    isLoggedIn() { return this._state.auth?.isLoggedIn || false; },

    // ── Readers (Synchronous for fast UI) ──
    getStudents() { return this._state.students; },
    getStudentById(id) { return this._state.students.find(s => s.id === id); },
    getStudentsByAdvisor(advisorId) { return this._state.students.filter(s => s.advisorId === advisorId); },
    
    getCourses() { return this._state.courses; },
    getCourseById(id) { return this._state.courses.find(c => c.id === id); },
    getCourseByCode(code) { return this._state.courses.find(c => c.code === code); },

    getCurricula() { return this._state.curricula; },
    getCurriculumById(id) { return this._state.curricula.find(c => c.id === id); },

    getPrerequisites() { return this._state.prerequisites; },
    getPrerequisitesForCourse(courseId) { return this._state.prerequisites.filter(p => p.courseId === courseId); },

    getSections() { return this._state.sections; },
    getSectionById(id) { return this._state.sections.find(s => s.id === id); },

    getGrades() { return this._state.grades; },
    getGradesByStudent(studentId) { return this._state.grades.filter(g => g.studentId === studentId); },

    getLearningPaths() { return this._state.learningPaths; },
    getLearningPathsByStudent(studentId) { return this._state.learningPaths.filter(lp => lp.studentId === studentId); },
    getPendingApprovals(advisorId) {
        const studentIds = this.getStudentsByAdvisor(advisorId).map(s => s.id);
        return this._state.learningPaths.filter(lp => studentIds.includes(lp.studentId) && lp.approvalStatus === 'pending');
    },

    getNotifications() { return this._state.notifications; },
    getNotificationsForUser(userId) {
        const student = this._state.students.find(s => s.id === userId || s.mssv === userId);
        const sid = student ? student.id : userId;
        return this._state.notifications.filter(n => n.to === sid || n.to === 'all');
    },
    getUnreadCount(userId) { return this.getNotificationsForUser(userId).filter(n => !n.read).length; },

    getAdvisoryLogs() { return this._state.advisoryLogs; },
    getLogsForStudent(studentId) { return this._state.advisoryLogs.filter(l => l.studentId === studentId); },

    getReportData() { return this._state.reportData; },
    getFaculties() { return this._state.faculties; },
    getCareerTargets() { return this._state.careerTargets; },

    // ── Writers (Asynchronous - Update Supabase then local state) ──
    async addStudent(student) {
        if (this._state.students.find(s => s.mssv === student.mssv)) return { success: false, error: 'MSSV đã tồn tại' };
        
        student.id = Utils.generateId('S');
        const { error } = await supabase.from('students').insert([student]);
        if (error) return { success: false, error: error.message };
        
        this._state.students.push(student);
        this._state.reportData = this._calculateReportData();
        return { success: true, data: student };
    },

    async updateStudent(id, updates) {
        const idx = this._state.students.findIndex(s => s.id === id);
        if (idx === -1) return { success: false, error: 'Không tìm thấy sinh viên' };
        
        const { error } = await supabase.from('students').update(updates).eq('id', id);
        if (error) return { success: false, error: error.message };
        
        this._state.students[idx] = { ...this._state.students[idx], ...updates };
        this._state.reportData = this._calculateReportData();
        return { success: true, data: this._state.students[idx] };
    },

    async deleteStudent(id) {
        const { error } = await supabase.from('students').delete().eq('id', id);
        if (error) return { success: false, error: error.message };
        
        this._state.students = this._state.students.filter(s => s.id !== id);
        this._state.reportData = this._calculateReportData();
        return { success: true };
    },

    async addCourse(course) {
        if (this._state.courses.find(c => c.code === course.code)) return { success: false, error: 'Mã học phần đã tồn tại' };
        
        course.id = Utils.generateId('C');
        const { error } = await supabase.from('courses').insert([course]);
        if (error) return { success: false, error: error.message };
        
        this._state.courses.push(course);
        return { success: true, data: course };
    },

    async updateCourse(id, updates) {
        const idx = this._state.courses.findIndex(c => c.id === id);
        if (idx === -1) return { success: false, error: 'Không tìm thấy học phần' };
        
        const { error } = await supabase.from('courses').update(updates).eq('id', id);
        if (error) return { success: false, error: error.message };
        
        this._state.courses[idx] = { ...this._state.courses[idx], ...updates };
        return { success: true, data: this._state.courses[idx] };
    },

    async deleteCourse(id) {
        const inCurriculum = this._state.curricula.some(c => c.courses.includes(id));
        if (inCurriculum) return { success: false, error: 'Học phần đang có trong CTĐT' };
        
        const { error } = await supabase.from('courses').delete().eq('id', id);
        if (error) return { success: false, error: error.message };
        
        this._state.courses = this._state.courses.filter(c => c.id !== id);
        return { success: true };
    },

    async addPrerequisite(prereq) {
        prereq.id = Utils.generateId('P');
        const { error } = await supabase.from('prerequisites').insert([prereq]);
        if (error) return { success: false, error: error.message };
        
        this._state.prerequisites.push(prereq);
        return { success: true, data: prereq };
    },

    async deletePrerequisite(id) {
        const { error } = await supabase.from('prerequisites').delete().eq('id', id);
        if (error) return { success: false, error: error.message };
        
        this._state.prerequisites = this._state.prerequisites.filter(p => p.id !== id);
        return { success: true };
    },

    async addCurriculum(curriculum) {
        curriculum.id = Utils.generateId('CUR');
        const { error } = await supabase.from('curricula').insert([curriculum]);
        if (error) return { success: false, error: error.message };
        
        this._state.curricula.push(curriculum);
        return { success: true, data: curriculum };
    },

    async updateCurriculum(id, updates) {
        const idx = this._state.curricula.findIndex(c => c.id === id);
        if (idx === -1) return { success: false, error: 'Không tìm thấy' };
        
        const { error } = await supabase.from('curricula').update(updates).eq('id', id);
        if (error) return { success: false, error: error.message };
        
        this._state.curricula[idx] = { ...this._state.curricula[idx], ...updates };
        return { success: true };
    },

    async addSection(section) {
        section.id = Utils.generateId('SEC');
        const { error } = await supabase.from('sections').insert([section]);
        if (error) return { success: false, error: error.message };
        
        this._state.sections.push(section);
        return { success: true, data: section };
    },

    async updateSection(id, updates) {
        const idx = this._state.sections.findIndex(s => s.id === id);
        if (idx === -1) return { success: false, error: 'Không tìm thấy' };
        
        const { error } = await supabase.from('sections').update(updates).eq('id', id);
        if (error) return { success: false, error: error.message };
        
        this._state.sections[idx] = { ...this._state.sections[idx], ...updates };
        return { success: true };
    },

    async addOrUpdateGrade(gradeData) {
        const idx = this._state.grades.findIndex(g => g.studentId === gradeData.studentId && g.courseId === gradeData.courseId);
        
        if (idx !== -1) {
            const id = this._state.grades[idx].id;
            const { error } = await supabase.from('grades').update(gradeData).eq('id', id);
            if (error) return { success: false, error: error.message };
            this._state.grades[idx] = { ...this._state.grades[idx], ...gradeData };
        } else {
            gradeData.id = Utils.generateId('G');
            const { error } = await supabase.from('grades').insert([gradeData]);
            if (error) return { success: false, error: error.message };
            this._state.grades.push(gradeData);
        }
        return { success: true };
    },

    async addLearningPath(path) {
        path.id = Utils.generateId('LP');
        const { error } = await supabase.from('learning_paths').insert([path]);
        if (error) return { success: false, error: error.message };
        
        this._state.learningPaths.push(path);
        return { success: true, data: path };
    },

    async updateLearningPath(id, updates) {
        const idx = this._state.learningPaths.findIndex(lp => lp.id === id);
        if (idx === -1) return { success: false, error: 'Không tìm thấy' };
        
        const { error } = await supabase.from('learning_paths').update(updates).eq('id', id);
        if (error) return { success: false, error: error.message };
        
        this._state.learningPaths[idx] = { ...this._state.learningPaths[idx], ...updates };
        return { success: true };
    },

    async addNotification(notification) {
        notification.id = Utils.generateId('N');
        notification.createdAt = new Date().toISOString();
        const { error } = await supabase.from('notifications').insert([notification]);
        if (error) return { success: false, error: error.message };
        
        this._state.notifications.unshift(notification);
        return { success: true };
    },

    async markNotificationRead(id) {
        const idx = this._state.notifications.findIndex(n => n.id === id);
        if (idx !== -1) {
            await supabase.from('notifications').update({ read: true }).eq('id', id);
            this._state.notifications[idx].read = true;
        }
    },

    async addAdvisoryLog(log) {
        log.id = Utils.generateId('AL');
        log.createdAt = new Date().toISOString();
        const { error } = await supabase.from('advisory_logs').insert([log]);
        if (error) return { success: false, error: error.message };
        
        this._state.advisoryLogs.push(log);
        return { success: true };
    },

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
    }
};
