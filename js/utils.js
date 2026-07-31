// ============================================
// VLU SmartEdu — Utility Functions
// ============================================

const Utils = {
    // ── ID Generation ──
    generateId(prefix = 'ID') {
        return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
    },

    // ── Date Formatting ──
    formatDate(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    },

    formatDateTime(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },

    timeAgo(dateStr) {
        const now = new Date();
        const date = new Date(dateStr);
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return 'Vừa xong';
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
        return Utils.formatDate(dateStr);
    },

    // ── GPA Calculation ──
    calculateGPA(grades) {
        const completed = grades.filter(g => g.grade !== null && g.status === 'completed');
        if (completed.length === 0) return 0;
        const totalPoints = completed.reduce((sum, g) => {
            const course = Store.getCourseById(g.courseId);
            const credits = course ? course.credits : 3;
            return sum + (g.grade / 10 * 4) * credits;
        }, 0);
        const totalCredits = completed.reduce((sum, g) => {
            const course = Store.getCourseById(g.courseId);
            return sum + (course ? course.credits : 3);
        }, 0);
        return totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
    },

    gradeToLetter(grade) {
        if (grade === null || grade === undefined) return '—';
        if (grade >= 9.0) return 'A+';
        if (grade >= 8.5) return 'A';
        if (grade >= 8.0) return 'B+';
        if (grade >= 7.0) return 'B';
        if (grade >= 6.5) return 'C+';
        if (grade >= 5.5) return 'C';
        if (grade >= 5.0) return 'D+';
        if (grade >= 4.0) return 'D';
        return 'F';
    },

    // ── Validation ──
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    validatePhone(phone) {
        return /^0\d{9}$/.test(phone);
    },

    validateGrade(grade) {
        const num = parseFloat(grade);
        return !isNaN(num) && num >= 0 && num <= 10;
    },

    validateCredits(credits) {
        const num = parseInt(credits);
        return !isNaN(num) && num > 0 && num <= 15 && Number.isInteger(num);
    },

    // ── String Helpers ──
    truncate(str, len = 50) {
        if (!str) return '';
        return str.length > len ? str.substring(0, len) + '...' : str;
    },

    slugify(str) {
        return str.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '');
    },

    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // ── Search / Filter ──
    matchSearch(item, query, fields) {
        if (!query) return true;
        const q = query.toLowerCase().trim();
        return fields.some(field => {
            const value = item[field];
            if (value === null || value === undefined) return false;
            return String(value).toLowerCase().includes(q);
        });
    },

    // ── Pagination ──
    paginate(items, page = 1, perPage = 10) {
        const total = items.length;
        const totalPages = Math.ceil(total / perPage);
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return {
            data: items.slice(start, end),
            page,
            perPage,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        };
    },

    // ── Sorting ──
    sortBy(items, field, direction = 'asc') {
        return [...items].sort((a, b) => {
            let valA = a[field];
            let valB = b[field];
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    },

    // ── Circular Dependency Check ──
    hasCircularDependency(courseId, prerequisiteCourseId, prerequisites) {
        const visited = new Set();
        const queue = [prerequisiteCourseId];
        
        while (queue.length > 0) {
            const current = queue.shift();
            if (current === courseId) return true;
            if (visited.has(current)) continue;
            visited.add(current);
            
            const deps = prerequisites.filter(p => p.courseId === current);
            deps.forEach(d => queue.push(d.prerequisiteCourseId));
        }
        return false;
    },

    // ── Status Helpers ──
    getStudentStatusBadge(status) {
        const statusMap = {
            'active': { text: 'Đang học', class: 'badge-success', icon: 'check-circle' },
            'warning': { text: 'Cảnh báo', class: 'badge-danger', icon: 'alert-triangle' },
            'behind': { text: 'Trễ tiến độ', class: 'badge-warning', icon: 'clock' },
            'graduated': { text: 'Tốt nghiệp', class: 'badge-info', icon: 'award' },
            'suspended': { text: 'Tạm dừng', class: 'badge-neutral', icon: 'pause-circle' },
            'locked': { text: 'Đã khóa', class: 'badge-danger', icon: 'lock' },
        };
        const b = statusMap[status] || { text: status, class: 'badge-neutral', icon: 'circle' };
        return `<span class="badge ${b.class}">${b.icon ? `<i data-lucide="${b.icon}" style="width:12px;height:12px;margin-right:4px;display:inline-block;"></i>` : ''}${b.text}</span>`;
    },

    getCourseStatusBadge(status) {
        const map = {
            'completed': { text: 'Hoàn thành', class: 'badge-success' },
            'in-progress': { text: 'Đang học', class: 'badge-warning' },
            'failed': { text: 'Rớt', class: 'badge-danger' },
            'pending': { text: 'Chưa học', class: 'badge-neutral' },
        };
        const b = map[status] || { text: status, class: 'badge-neutral' };
        return `<span class="badge ${b.class}">${b.text}</span>`;
    },

    getApprovalStatusBadge(status) {
        const map = {
            'pending': { text: 'Chờ duyệt', class: 'badge-warning' },
            'approved': { text: 'Đã duyệt', class: 'badge-success' },
            'rejected': { text: 'Từ chối', class: 'badge-danger' },
        };
        const b = map[status] || { text: status, class: 'badge-neutral' };
        return `<span class="badge ${b.class}">${b.text}</span>`;
    },

    getCurriculumStatusBadge(status) {
        const map = {
            'active': { text: 'Đang áp dụng', class: 'badge-success' },
            'draft': { text: 'Bản nháp', class: 'badge-warning' },
            'archived': { text: 'Đã lưu trữ', class: 'badge-neutral' },
        };
        const b = map[status] || { text: status, class: 'badge-neutral' };
        return `<span class="badge ${b.class}">${b.text}</span>`;
    },

    getSectionStatusBadge(status) {
        const map = {
            'open': { text: 'Đang mở', class: 'badge-success' },
            'closed': { text: 'Đã đóng', class: 'badge-danger' },
        };
        const b = map[status] || { text: status, class: 'badge-neutral' };
        return `<span class="badge ${b.class}">${b.text}</span>`;
    },

    // ── Notification Type ──
    getNotificationIcon(type) {
        const map = {
            'info': 'info',
            'warning': 'alert-triangle',
            'danger': 'alert-circle',
            'reminder': 'bell',
            'success': 'check-circle',
        };
        return map[type] || 'bell';
    },

    // ── Number Formatting ──
    formatNumber(num) {
        if (num === null || num === undefined) return '0';
        return new Intl.NumberFormat('vi-VN').format(num);
    },

    formatPercentage(value, total) {
        if (!total) return '0%';
        return Math.round((value / total) * 100) + '%';
    },

    // ── Debounce ──
    debounce(fn, delay = 300) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    },

    // ── Download helpers ──
    downloadFile(content, filename, type = 'text/csv') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    exportToCSV(data, headers, filename) {
        const headerRow = headers.map(h => h.label).join(',');
        const rows = data.map(item => 
            headers.map(h => {
                let val = item[h.key];
                if (typeof val === 'string' && val.includes(',')) val = `"${val}"`;
                return val ?? '';
            }).join(',')
        );
        const csv = '\uFEFF' + [headerRow, ...rows].join('\n');
        Utils.downloadFile(csv, filename, 'text/csv;charset=utf-8');
    },
};
