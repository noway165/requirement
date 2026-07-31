// ============================================
// VLU SmartEdu — Mock Data
// Complete dataset for all modules
// ============================================

const MOCK_DATA = {
    // ── Current Semester ──
    currentSemester: 'HK1 2025-2026',
    currentYear: '2025-2026',

    // ── Users & Auth ──
    users: [
        { id: 'U001', email: 'admin@vlu.edu.vn', password: 'admin123', name: 'Nguyễn Văn Quản', role: 'admin', department: 'Phòng Đào tạo', avatar: 'Q' },
        { id: 'U002', email: 'advisor@vlu.edu.vn', password: 'advisor123', name: 'Trần Thị Hương', role: 'advisor', department: 'Khoa CNTT', avatar: 'H' },
        { id: 'U003', email: 'student@vlu.edu.vn', password: 'student123', name: 'Lê Minh Tuấn', role: 'student', studentId: 'S001', avatar: 'T' },
        { id: 'U004', email: 'advisor2@vlu.edu.vn', password: 'advisor123', name: 'Phạm Đức Minh', role: 'advisor', department: 'Khoa CNTT', avatar: 'M' },
    ],

    // ── Faculties ──
    faculties: [
        { id: 'F001', name: 'Khoa Công nghệ Thông tin', code: 'CNTT' },
        { id: 'F002', name: 'Khoa Quản trị Kinh doanh', code: 'QTKD' },
        { id: 'F003', name: 'Khoa Ngoại ngữ', code: 'NN' },
        { id: 'F004', name: 'Khoa Kiến trúc', code: 'KT' },
        { id: 'F005', name: 'Khoa Truyền thông', code: 'TT' },
        { id: 'F006', name: 'Khoa Luật', code: 'LT' },
    ],

    // ── Students ──
    students: [
        { id: 'S001', mssv: '2174802010000', name: 'Lê Minh Tuấn', email: '2174802010000@vlu.edu.vn', phone: '0901234567', faculty: 'CNTT', major: 'Kỹ thuật Phần mềm', enrollYear: 2021, gpa: 3.2, creditsCompleted: 95, totalCredits: 140, status: 'active', advisorId: 'U002', curriculumId: 'CUR001', gender: 'Nam', dob: '2003-05-15' },
        { id: 'S002', mssv: '2174802010001', name: 'Nguyễn Thị Mai', email: '2174802010001@vlu.edu.vn', phone: '0912345678', faculty: 'CNTT', major: 'Kỹ thuật Phần mềm', enrollYear: 2021, gpa: 3.6, creditsCompleted: 105, totalCredits: 140, status: 'active', advisorId: 'U002', curriculumId: 'CUR001', gender: 'Nữ', dob: '2003-03-20' },
        { id: 'S003', mssv: '2174802010002', name: 'Phạm Hoàng Dũng', email: '2174802010002@vlu.edu.vn', phone: '0923456789', faculty: 'CNTT', major: 'Hệ thống Thông tin', enrollYear: 2021, gpa: 1.8, creditsCompleted: 70, totalCredits: 140, status: 'warning', advisorId: 'U002', curriculumId: 'CUR001', gender: 'Nam', dob: '2003-08-10' },
        { id: 'S004', mssv: '2174802010003', name: 'Trần Thùy Linh', email: '2174802010003@vlu.edu.vn', phone: '0934567890', faculty: 'CNTT', major: 'Kỹ thuật Phần mềm', enrollYear: 2022, gpa: 3.8, creditsCompleted: 65, totalCredits: 140, status: 'active', advisorId: 'U002', curriculumId: 'CUR001', gender: 'Nữ', dob: '2004-01-25' },
        { id: 'S005', mssv: '2174802010004', name: 'Võ Đình Khoa', email: '2174802010004@vlu.edu.vn', phone: '0945678901', faculty: 'CNTT', major: 'Khoa học Dữ liệu', enrollYear: 2022, gpa: 2.1, creditsCompleted: 55, totalCredits: 140, status: 'behind', advisorId: 'U002', curriculumId: 'CUR001', gender: 'Nam', dob: '2004-06-12' },
        { id: 'S006', mssv: '2174802010005', name: 'Đỗ Thanh Hà', email: '2174802010005@vlu.edu.vn', phone: '0956789012', faculty: 'CNTT', major: 'Kỹ thuật Phần mềm', enrollYear: 2021, gpa: 2.9, creditsCompleted: 88, totalCredits: 140, status: 'active', advisorId: 'U002', curriculumId: 'CUR001', gender: 'Nữ', dob: '2003-11-30' },
        { id: 'S007', mssv: '2174802010006', name: 'Bùi Công Danh', email: '2174802010006@vlu.edu.vn', phone: '0967890123', faculty: 'CNTT', major: 'An toàn Thông tin', enrollYear: 2022, gpa: 3.4, creditsCompleted: 60, totalCredits: 140, status: 'active', advisorId: 'U002', curriculumId: 'CUR001', gender: 'Nam', dob: '2004-09-05' },
        { id: 'S008', mssv: '2174802010007', name: 'Huỳnh Ngọc Anh', email: '2174802010007@vlu.edu.vn', phone: '0978901234', faculty: 'CNTT', major: 'Kỹ thuật Phần mềm', enrollYear: 2023, gpa: 3.1, creditsCompleted: 32, totalCredits: 140, status: 'active', advisorId: 'U004', curriculumId: 'CUR001', gender: 'Nữ', dob: '2005-02-14' },
        { id: 'S009', mssv: '2274801020001', name: 'Nguyễn Hoàng Phúc', email: '2274801020001@vlu.edu.vn', phone: '0989012345', faculty: 'QTKD', major: 'Marketing', enrollYear: 2022, gpa: 3.5, creditsCompleted: 72, totalCredits: 130, status: 'active', advisorId: 'U004', curriculumId: 'CUR002', gender: 'Nam', dob: '2004-04-22' },
        { id: 'S010', mssv: '2274801020002', name: 'Lý Thị Bích Ngọc', email: '2274801020002@vlu.edu.vn', phone: '0990123456', faculty: 'QTKD', major: 'Quản trị Kinh doanh', enrollYear: 2022, gpa: 1.7, creditsCompleted: 48, totalCredits: 130, status: 'warning', advisorId: 'U004', curriculumId: 'CUR002', gender: 'Nữ', dob: '2004-07-08' },
        { id: 'S011', mssv: '2174802010008', name: 'Trương Minh Hải', email: '2174802010008@vlu.edu.vn', phone: '0901122334', faculty: 'CNTT', major: 'Kỹ thuật Phần mềm', enrollYear: 2021, gpa: 2.5, creditsCompleted: 80, totalCredits: 140, status: 'behind', advisorId: 'U002', curriculumId: 'CUR001', gender: 'Nam', dob: '2003-12-01' },
        { id: 'S012', mssv: '2174802010009', name: 'Phan Thị Yến Nhi', email: '2174802010009@vlu.edu.vn', phone: '0912233445', faculty: 'CNTT', major: 'Kỹ thuật Phần mềm', enrollYear: 2023, gpa: 3.9, creditsCompleted: 35, totalCredits: 140, status: 'active', advisorId: 'U002', curriculumId: 'CUR001', gender: 'Nữ', dob: '2005-06-18' },
        { id: 'S013', mssv: '2174802010010', name: 'Đặng Tuấn Vũ', email: '2174802010010@vlu.edu.vn', phone: '0933445566', faculty: 'CNTT', major: 'Trí tuệ Nhân tạo', enrollYear: 2021, gpa: 3.8, creditsCompleted: 110, totalCredits: 140, status: 'active', advisorId: 'U004', curriculumId: 'CUR001', gender: 'Nam', dob: '2003-02-11' },
        { id: 'S014', mssv: '2274802010001', name: 'Vương Bảo Nhi', email: '2274802010001@vlu.edu.vn', phone: '0944556677', faculty: 'CNTT', major: 'Hệ thống Thông tin', enrollYear: 2022, gpa: 3.3, creditsCompleted: 70, totalCredits: 140, status: 'active', advisorId: 'U002', curriculumId: 'CUR001', gender: 'Nữ', dob: '2004-10-05' },
        { id: 'S015', mssv: '2374802010001', name: 'Hoàng Quốc Việt', email: '2374802010001@vlu.edu.vn', phone: '0955667788', faculty: 'CNTT', major: 'Mạng Máy tính', enrollYear: 2023, gpa: 2.7, creditsCompleted: 30, totalCredits: 140, status: 'active', advisorId: 'U002', curriculumId: 'CUR003', gender: 'Nam', dob: '2005-01-20' },
        { id: 'S016', mssv: '2174803010001', name: 'Lâm Bích Hữu', email: '2174803010001@vlu.edu.vn', phone: '0966778899', faculty: 'NN', major: 'Ngôn ngữ Anh', enrollYear: 2021, gpa: 3.1, creditsCompleted: 100, totalCredits: 130, status: 'active', advisorId: 'U002', curriculumId: 'CUR001', gender: 'Nữ', dob: '2003-07-22' },
        { id: 'S017', mssv: '2274804010001', name: 'Tạ Quang Thắng', email: '2274804010001@vlu.edu.vn', phone: '0977889900', faculty: 'KT', major: 'Kiến trúc', enrollYear: 2022, gpa: 3.5, creditsCompleted: 65, totalCredits: 150, status: 'active', advisorId: 'U004', curriculumId: 'CUR002', gender: 'Nam', dob: '2004-03-15' },
        { id: 'S018', mssv: '2374805010001', name: 'Đinh Mỹ Linh', email: '2374805010001@vlu.edu.vn', phone: '0988990011', faculty: 'TT', major: 'Truyền thông Đa phương tiện', enrollYear: 2023, gpa: 3.7, creditsCompleted: 40, totalCredits: 135, status: 'active', advisorId: 'U004', curriculumId: 'CUR003', gender: 'Nữ', dob: '2005-09-09' },
        { id: 'S019', mssv: '2174802010011', name: 'Châu Trọng Tín', email: '2174802010011@vlu.edu.vn', phone: '0999001122', faculty: 'CNTT', major: 'Kỹ thuật Phần mềm', enrollYear: 2021, gpa: 1.9, creditsCompleted: 50, totalCredits: 140, status: 'warning', advisorId: 'U002', curriculumId: 'CUR001', gender: 'Nam', dob: '2003-11-11' },
        { id: 'S020', mssv: '2174802010012', name: 'Lê Kiều Oanh', email: '2174802010012@vlu.edu.vn', phone: '0902112233', faculty: 'CNTT', major: 'Khoa học Máy tính', enrollYear: 2021, gpa: 2.8, creditsCompleted: 92, totalCredits: 140, status: 'active', advisorId: 'U002', curriculumId: 'CUR001', gender: 'Nữ', dob: '2003-04-30' },
        { id: 'S021', mssv: '2274802010002', name: 'Đoàn Hữu Phát', email: '2274802010002@vlu.edu.vn', phone: '0913223344', faculty: 'CNTT', major: 'An toàn Thông tin', enrollYear: 2022, gpa: 2.4, creditsCompleted: 60, totalCredits: 140, status: 'behind', advisorId: 'U002', curriculumId: 'CUR001', gender: 'Nam', dob: '2004-12-05' },
        { id: 'S022', mssv: '2374802010002', name: 'Ngô Thanh Sơn', email: '2374802010002@vlu.edu.vn', phone: '0924334455', faculty: 'CNTT', major: 'Kỹ thuật Phần mềm', enrollYear: 2023, gpa: 3.6, creditsCompleted: 38, totalCredits: 140, status: 'active', advisorId: 'U004', curriculumId: 'CUR003', gender: 'Nam', dob: '2005-08-25' },
        { id: 'S023', mssv: '2274806010001', name: 'Võ Thị Ái', email: '2274806010001@vlu.edu.vn', phone: '0935445566', faculty: 'LT', major: 'Luật Kinh tế', enrollYear: 2022, gpa: 3.2, creditsCompleted: 75, totalCredits: 130, status: 'active', advisorId: 'U004', curriculumId: 'CUR002', gender: 'Nữ', dob: '2004-05-14' },
        { id: 'S024', mssv: '2174802010013', name: 'Mai Quốc Huy', email: '2174802010013@vlu.edu.vn', phone: '0946556677', faculty: 'CNTT', major: 'Trí tuệ Nhân tạo', enrollYear: 2021, gpa: 3.9, creditsCompleted: 108, totalCredits: 140, status: 'active', advisorId: 'U002', curriculumId: 'CUR001', gender: 'Nam', dob: '2003-01-08' },
        { id: 'S025', mssv: '2174802010014', name: 'Lương Đăng Khoa', email: '2174802010014@vlu.edu.vn', phone: '0957667788', faculty: 'CNTT', major: 'Khoa học Dữ liệu', enrollYear: 2021, gpa: 2.2, creditsCompleted: 65, totalCredits: 140, status: 'behind', advisorId: 'U004', curriculumId: 'CUR001', gender: 'Nam', dob: '2003-10-10' }
    ],

    // ── Courses ──
    courses: [
        { id: 'C001', code: 'CS101', name: 'Nhập môn Lập trình', credits: 3, faculty: 'CNTT', type: 'mandatory', description: 'Cơ bản về lập trình C/C++', semester: 1 },
        { id: 'C002', code: 'CS102', name: 'Cấu trúc Dữ liệu & Giải thuật', credits: 4, faculty: 'CNTT', type: 'mandatory', description: 'DSA cơ bản', semester: 2 },
        { id: 'C003', code: 'CS201', name: 'Lập trình Hướng đối tượng', credits: 3, faculty: 'CNTT', type: 'mandatory', description: 'OOP với Java', semester: 3 },
        { id: 'C004', code: 'CS202', name: 'Cơ sở Dữ liệu', credits: 4, faculty: 'CNTT', type: 'mandatory', description: 'SQL, thiết kế CSDL', semester: 3 },
        { id: 'C005', code: 'CS301', name: 'Công nghệ Phần mềm', credits: 3, faculty: 'CNTT', type: 'mandatory', description: 'Software Engineering', semester: 5 },
        { id: 'C006', code: 'CS302', name: 'Phát triển Ứng dụng Web', credits: 4, faculty: 'CNTT', type: 'mandatory', description: 'HTML, CSS, JS, React', semester: 5 },
        { id: 'C007', code: 'CS303', name: 'Mạng Máy tính', credits: 3, faculty: 'CNTT', type: 'mandatory', description: 'Networking fundamentals', semester: 4 },
        { id: 'C008', code: 'CS304', name: 'Hệ điều hành', credits: 3, faculty: 'CNTT', type: 'mandatory', description: 'OS concepts', semester: 4 },
        { id: 'C009', code: 'CS401', name: 'Trí tuệ Nhân tạo', credits: 3, faculty: 'CNTT', type: 'elective', description: 'AI fundamentals', semester: 6 },
        { id: 'C010', code: 'CS402', name: 'Machine Learning', credits: 3, faculty: 'CNTT', type: 'elective', description: 'ML cơ bản', semester: 7 },
        { id: 'C011', code: 'CS403', name: 'An toàn Thông tin', credits: 3, faculty: 'CNTT', type: 'elective', description: 'Security fundamentals', semester: 6 },
        { id: 'C012', code: 'CS404', name: 'Phát triển Ứng dụng Di động', credits: 3, faculty: 'CNTT', type: 'elective', description: 'Mobile dev', semester: 6 },
        { id: 'C013', code: 'CS501', name: 'Đồ án Tốt nghiệp', credits: 10, faculty: 'CNTT', type: 'mandatory', description: 'Capstone project', semester: 8 },
        { id: 'C014', code: 'GE101', name: 'Toán Cao cấp 1', credits: 3, faculty: 'CNTT', type: 'mandatory', description: 'Calculus 1', semester: 1 },
        { id: 'C015', code: 'GE102', name: 'Toán Cao cấp 2', credits: 3, faculty: 'CNTT', type: 'mandatory', description: 'Calculus 2', semester: 2 },
        { id: 'C016', code: 'GE103', name: 'Xác suất & Thống kê', credits: 3, faculty: 'CNTT', type: 'mandatory', description: 'Probability & Statistics', semester: 3 },
        { id: 'C017', code: 'GE104', name: 'Toán Rời rạc', credits: 3, faculty: 'CNTT', type: 'mandatory', description: 'Discrete Mathematics', semester: 2 },
        { id: 'C018', code: 'GE201', name: 'Tiếng Anh 1', credits: 3, faculty: 'NN', type: 'mandatory', description: 'English 1', semester: 1 },
        { id: 'C019', code: 'GE202', name: 'Tiếng Anh 2', credits: 3, faculty: 'NN', type: 'mandatory', description: 'English 2', semester: 2 },
        { id: 'C020', code: 'GE203', name: 'Tiếng Anh 3', credits: 3, faculty: 'NN', type: 'mandatory', description: 'English 3', semester: 3 },
        { id: 'C021', code: 'CS203', name: 'Kiến trúc Máy tính', credits: 3, faculty: 'CNTT', type: 'mandatory', description: 'Computer Architecture', semester: 3 },
        { id: 'C022', code: 'CS305', name: 'Phân tích Thiết kế Hệ thống', credits: 3, faculty: 'CNTT', type: 'mandatory', description: 'System Analysis & Design', semester: 5 },
        { id: 'C023', code: 'CS306', name: 'Kiểm thử Phần mềm', credits: 3, faculty: 'CNTT', type: 'mandatory', description: 'Software Testing', semester: 6 },
        { id: 'C024', code: 'BA101', name: 'Kinh tế Vi mô', credits: 3, faculty: 'QTKD', type: 'mandatory', description: 'Microeconomics', semester: 1 },
        { id: 'C025', code: 'BA102', name: 'Marketing Căn bản', credits: 3, faculty: 'QTKD', type: 'mandatory', description: 'Basic Marketing', semester: 2 },
        { id: 'C026', code: 'CS405', name: 'DevOps & CI/CD', credits: 3, faculty: 'CNTT', type: 'elective', description: 'DevOps practices', semester: 7 },
        { id: 'C027', code: 'CS406', name: 'Điện toán Đám mây', credits: 3, faculty: 'CNTT', type: 'elective', description: 'Cloud Computing', semester: 7 },
        { id: 'C028', code: 'CS407', name: 'Blockchain', credits: 3, faculty: 'CNTT', type: 'elective', description: 'Blockchain technology', semester: 7 },
        { id: 'C029', code: 'GE105', name: 'Pháp luật Đại cương', credits: 2, faculty: 'LT', type: 'mandatory', description: 'General Law', semester: 1 },
        { id: 'C030', code: 'GE106', name: 'Triết học Mác-Lênin', credits: 3, faculty: 'LT', type: 'mandatory', description: 'Marxist-Leninist Philosophy', semester: 1 },
    ],

    // ── Prerequisites ──
    prerequisites: [
        { id: 'P001', courseId: 'C002', prerequisiteCourseId: 'C001', type: 'mandatory' },
        { id: 'P002', courseId: 'C003', prerequisiteCourseId: 'C001', type: 'mandatory' },
        { id: 'P003', courseId: 'C004', prerequisiteCourseId: 'C001', type: 'mandatory' },
        { id: 'P004', courseId: 'C005', prerequisiteCourseId: 'C003', type: 'mandatory' },
        { id: 'P005', courseId: 'C005', prerequisiteCourseId: 'C004', type: 'mandatory' },
        { id: 'P006', courseId: 'C006', prerequisiteCourseId: 'C003', type: 'mandatory' },
        { id: 'P007', courseId: 'C006', prerequisiteCourseId: 'C004', type: 'mandatory' },
        { id: 'P008', courseId: 'C007', prerequisiteCourseId: 'C001', type: 'mandatory' },
        { id: 'P009', courseId: 'C008', prerequisiteCourseId: 'C001', type: 'mandatory' },
        { id: 'P010', courseId: 'C009', prerequisiteCourseId: 'C002', type: 'mandatory' },
        { id: 'P011', courseId: 'C009', prerequisiteCourseId: 'C016', type: 'recommended' },
        { id: 'P012', courseId: 'C010', prerequisiteCourseId: 'C009', type: 'mandatory' },
        { id: 'P013', courseId: 'C011', prerequisiteCourseId: 'C007', type: 'mandatory' },
        { id: 'P014', courseId: 'C012', prerequisiteCourseId: 'C003', type: 'mandatory' },
        { id: 'P015', courseId: 'C013', prerequisiteCourseId: 'C005', type: 'mandatory' },
        { id: 'P016', courseId: 'C015', prerequisiteCourseId: 'C014', type: 'mandatory' },
        { id: 'P017', courseId: 'C019', prerequisiteCourseId: 'C018', type: 'mandatory' },
        { id: 'P018', courseId: 'C020', prerequisiteCourseId: 'C019', type: 'mandatory' },
        { id: 'P019', courseId: 'C022', prerequisiteCourseId: 'C003', type: 'mandatory' },
        { id: 'P020', courseId: 'C023', prerequisiteCourseId: 'C005', type: 'mandatory' },
        { id: 'P021', courseId: 'C026', prerequisiteCourseId: 'C005', type: 'recommended' },
        { id: 'P022', courseId: 'C027', prerequisiteCourseId: 'C007', type: 'recommended' },
    ],

    // ── Curricula ──
    curricula: [
        {
            id: 'CUR001', code: 'CTDT-CNTT-2021', name: 'Chương trình Đào tạo Kỹ thuật Phần mềm 2021',
            faculty: 'CNTT', totalCredits: 140, mandatoryCredits: 104, electiveCredits: 36,
            status: 'active', year: '2021',
            courses: ['C001','C002','C003','C004','C005','C006','C007','C008','C009','C010','C011','C012','C013','C014','C015','C016','C017','C018','C019','C020','C021','C022','C023','C026','C027','C028','C029','C030']
        },
        {
            id: 'CUR002', code: 'CTDT-QTKD-2022', name: 'Chương trình Đào tạo Quản trị Kinh doanh 2022',
            faculty: 'QTKD', totalCredits: 130, mandatoryCredits: 95, electiveCredits: 35,
            status: 'active', year: '2022',
            courses: ['C018','C019','C020','C024','C025','C029','C030']
        },
        {
            id: 'CUR003', code: 'CTDT-CNTT-2023', name: 'Chương trình Đào tạo CNTT 2023',
            faculty: 'CNTT', totalCredits: 145, mandatoryCredits: 110, electiveCredits: 35,
            status: 'draft', year: '2023',
            courses: ['C001','C002','C003','C004','C005','C006','C007','C008','C009','C014','C015','C016','C017','C018','C019','C020','C021','C022','C023','C029','C030']
        },
        {
            id: 'CUR004', code: 'CTDT-CNTT-2020', name: 'Chương trình Đào tạo CNTT 2020 (Cũ)',
            faculty: 'CNTT', totalCredits: 135, mandatoryCredits: 100, electiveCredits: 35,
            status: 'archived', year: '2020',
            courses: ['C001','C002','C003','C004','C014','C015','C029','C030']
        },
    ],

    // ── Course Sections ──
    sections: [
        { id: 'SEC001', code: 'CS101-01', courseId: 'C001', semester: 'HK1 2025-2026', instructor: 'Nguyễn Văn An', room: 'A301', maxStudents: 45, enrolledCount: 45, status: 'closed', schedule: 'T2 (7:30-9:30), T4 (7:30-9:30)' },
        { id: 'SEC002', code: 'CS101-02', courseId: 'C001', semester: 'HK1 2025-2026', instructor: 'Trần Thị Bình', room: 'A302', maxStudents: 45, enrolledCount: 38, status: 'open', schedule: 'T3 (9:45-11:45), T5 (9:45-11:45)' },
        { id: 'SEC003', code: 'CS102-01', courseId: 'C002', semester: 'HK1 2025-2026', instructor: 'Lê Đức Cường', room: 'B201', maxStudents: 40, enrolledCount: 40, status: 'closed', schedule: 'T2 (13:00-15:00), T6 (13:00-15:00)' },
        { id: 'SEC004', code: 'CS201-01', courseId: 'C003', semester: 'HK1 2025-2026', instructor: 'Phạm Minh Đức', room: 'A401', maxStudents: 40, enrolledCount: 35, status: 'open', schedule: 'T3 (7:30-9:30), T5 (7:30-9:30)' },
        { id: 'SEC005', code: 'CS202-01', courseId: 'C004', semester: 'HK1 2025-2026', instructor: 'Võ Thị Em', room: 'B301', maxStudents: 40, enrolledCount: 28, status: 'open', schedule: 'T4 (13:00-15:00), T6 (7:30-9:30)' },
        { id: 'SEC006', code: 'CS301-01', courseId: 'C005', semester: 'HK1 2025-2026', instructor: 'Trần Thị Hương', room: 'C201', maxStudents: 35, enrolledCount: 32, status: 'open', schedule: 'T2 (9:45-11:45), T4 (9:45-11:45)' },
        { id: 'SEC007', code: 'CS302-01', courseId: 'C006', semester: 'HK1 2025-2026', instructor: 'Phạm Đức Minh', room: 'Lab1', maxStudents: 30, enrolledCount: 30, status: 'closed', schedule: 'T3 (13:00-16:00), T5 (13:00-16:00)' },
        { id: 'SEC008', code: 'CS401-01', courseId: 'C009', semester: 'HK1 2025-2026', instructor: 'Nguyễn AI', room: 'C301', maxStudents: 35, enrolledCount: 20, status: 'open', schedule: 'T4 (7:30-9:30), T6 (9:45-11:45)' },
        { id: 'SEC009', code: 'GE101-01', courseId: 'C014', semester: 'HK1 2025-2026', instructor: 'Đỗ Toán', room: 'D101', maxStudents: 60, enrolledCount: 58, status: 'open', schedule: 'T2 (7:30-9:30), T6 (7:30-9:30)' },
        { id: 'SEC010', code: 'GE201-01', courseId: 'C018', semester: 'HK1 2025-2026', instructor: 'Mary Johnson', room: 'E201', maxStudents: 35, enrolledCount: 33, status: 'open', schedule: 'T3 (7:30-9:30), T5 (7:30-9:30)' },
    ],

    // ── Grades (for student S001 - Lê Minh Tuấn) ──
    grades: [
        { id: 'G001', studentId: 'S001', courseId: 'C001', grade: 7.5, letterGrade: 'B', semester: 'HK1 2021-2022', status: 'completed' },
        { id: 'G002', studentId: 'S001', courseId: 'C014', grade: 6.0, letterGrade: 'C', semester: 'HK1 2021-2022', status: 'completed' },
        { id: 'G003', studentId: 'S001', courseId: 'C018', grade: 8.0, letterGrade: 'B+', semester: 'HK1 2021-2022', status: 'completed' },
        { id: 'G004', studentId: 'S001', courseId: 'C029', grade: 7.0, letterGrade: 'B', semester: 'HK1 2021-2022', status: 'completed' },
        { id: 'G005', studentId: 'S001', courseId: 'C030', grade: 6.5, letterGrade: 'C+', semester: 'HK1 2021-2022', status: 'completed' },
        { id: 'G006', studentId: 'S001', courseId: 'C002', grade: 7.0, letterGrade: 'B', semester: 'HK2 2021-2022', status: 'completed' },
        { id: 'G007', studentId: 'S001', courseId: 'C015', grade: 5.5, letterGrade: 'C', semester: 'HK2 2021-2022', status: 'completed' },
        { id: 'G008', studentId: 'S001', courseId: 'C017', grade: 6.5, letterGrade: 'C+', semester: 'HK2 2021-2022', status: 'completed' },
        { id: 'G009', studentId: 'S001', courseId: 'C019', grade: 7.5, letterGrade: 'B', semester: 'HK2 2021-2022', status: 'completed' },
        { id: 'G010', studentId: 'S001', courseId: 'C003', grade: 8.0, letterGrade: 'B+', semester: 'HK1 2022-2023', status: 'completed' },
        { id: 'G011', studentId: 'S001', courseId: 'C004', grade: 7.5, letterGrade: 'B', semester: 'HK1 2022-2023', status: 'completed' },
        { id: 'G012', studentId: 'S001', courseId: 'C016', grade: 6.0, letterGrade: 'C', semester: 'HK1 2022-2023', status: 'completed' },
        { id: 'G013', studentId: 'S001', courseId: 'C020', grade: 8.5, letterGrade: 'A', semester: 'HK1 2022-2023', status: 'completed' },
        { id: 'G014', studentId: 'S001', courseId: 'C021', grade: 7.0, letterGrade: 'B', semester: 'HK1 2022-2023', status: 'completed' },
        { id: 'G015', studentId: 'S001', courseId: 'C007', grade: 6.5, letterGrade: 'C+', semester: 'HK2 2022-2023', status: 'completed' },
        { id: 'G016', studentId: 'S001', courseId: 'C008', grade: 7.0, letterGrade: 'B', semester: 'HK2 2022-2023', status: 'completed' },
        { id: 'G017', studentId: 'S001', courseId: 'C005', grade: 8.0, letterGrade: 'B+', semester: 'HK1 2023-2024', status: 'completed' },
        { id: 'G018', studentId: 'S001', courseId: 'C006', grade: 8.5, letterGrade: 'A', semester: 'HK1 2023-2024', status: 'completed' },
        { id: 'G019', studentId: 'S001', courseId: 'C022', grade: 7.5, letterGrade: 'B', semester: 'HK1 2023-2024', status: 'completed' },
        { id: 'G020', studentId: 'S001', courseId: 'C009', grade: null, letterGrade: null, semester: 'HK1 2025-2026', status: 'in-progress' },
        { id: 'G021', studentId: 'S001', courseId: 'C023', grade: null, letterGrade: null, semester: 'HK1 2025-2026', status: 'in-progress' },
    ],

    // ── Learning Paths ──
    learningPaths: [
        {
            id: 'LP001', studentId: 'S001', status: 'pending',
            semester: 'HK2 2025-2026',
            suggestedCourses: ['C010', 'C011', 'C012', 'C026'],
            selectedCourses: ['C010', 'C012', 'C026'],
            totalCredits: 9,
            createdAt: '2025-07-15',
            advisorNote: '',
            approvalStatus: 'pending'
        },
        {
            id: 'LP002', studentId: 'S002', status: 'approved',
            semester: 'HK2 2025-2026',
            suggestedCourses: ['C009', 'C023', 'C012'],
            selectedCourses: ['C009', 'C023'],
            totalCredits: 6,
            createdAt: '2025-07-10',
            advisorNote: 'Lộ trình hợp lý, đã duyệt.',
            approvalStatus: 'approved'
        },
        {
            id: 'LP003', studentId: 'S005', status: 'pending',
            semester: 'HK2 2025-2026',
            suggestedCourses: ['C003', 'C004', 'C016'],
            selectedCourses: ['C003', 'C004'],
            totalCredits: 7,
            createdAt: '2025-07-20',
            advisorNote: '',
            approvalStatus: 'pending'
        },
    ],

    // ── Notifications ──
    notifications: [
        { id: 'N001', from: 'U002', to: 'S001', title: 'Nhắc nhở đăng ký học phần', content: 'Bạn cần hoàn tất đăng ký học phần cho HK2 trước ngày 15/08.', type: 'reminder', read: false, createdAt: '2025-07-28T10:30:00' },
        { id: 'N002', from: 'U002', to: 'S001', title: 'Kết quả phê duyệt lộ trình', content: 'Lộ trình HK2 của bạn đang chờ phê duyệt. Vui lòng kiểm tra.', type: 'info', read: false, createdAt: '2025-07-25T14:00:00' },
        { id: 'N003', from: 'system', to: 'S003', title: 'Cảnh báo học vụ', content: 'GPA tích lũy hiện tại (1.8) dưới mức quy định (2.0). Vui lòng liên hệ cố vấn.', type: 'warning', read: false, createdAt: '2025-07-20T09:00:00' },
        { id: 'N004', from: 'system', to: 'S005', title: 'Trễ tiến độ học tập', content: 'Bạn đang nợ từ 2 môn tiên quyết trở lên. Vui lòng liên hệ cố vấn để được tư vấn.', type: 'danger', read: true, createdAt: '2025-07-18T16:00:00' },
        { id: 'N005', from: 'U001', to: 'all', title: 'Thông báo lịch đăng ký HK2', content: 'Đăng ký học phần HK2 2025-2026 bắt đầu từ 01/08/2025.', type: 'info', read: false, createdAt: '2025-07-15T08:00:00' },
    ],

    // ── Advisory Logs ──
    advisoryLogs: [
        { id: 'AL001', advisorId: 'U002', studentId: 'S001', action: 'review', note: 'Đã xem xét lộ trình HK2, cần bổ sung thêm 1 môn tự chọn.', createdAt: '2025-07-16T14:30:00' },
        { id: 'AL002', advisorId: 'U002', studentId: 'S003', action: 'warning', note: 'Gửi cảnh báo GPA thấp, hẹn gặp tư vấn trực tiếp.', createdAt: '2025-07-20T09:30:00' },
        { id: 'AL003', advisorId: 'U002', studentId: 'S002', action: 'approved', note: 'Lộ trình hợp lý, đã phê duyệt.', createdAt: '2025-07-12T10:00:00' },
    ],

    // ── Career Targets ──
    careerTargets: [
        { id: 'CT001', title: 'Frontend Developer', icon: 'monitor', description: 'Phát triển giao diện web hiện đại', requiredSkills: ['HTML/CSS', 'JavaScript', 'React/Vue', 'UI/UX Design'], recommendedCourses: ['C006', 'C003', 'C012'] },
        { id: 'CT002', title: 'Backend Developer', icon: 'server', description: 'Xây dựng hệ thống phía server', requiredSkills: ['Java/Python', 'Database', 'API Design', 'DevOps'], recommendedCourses: ['C003', 'C004', 'C005', 'C026'] },
        { id: 'CT003', title: 'Data Scientist', icon: 'bar-chart-3', description: 'Phân tích dữ liệu & Machine Learning', requiredSkills: ['Python', 'Statistics', 'ML/DL', 'Data Viz'], recommendedCourses: ['C009', 'C010', 'C016'] },
        { id: 'CT004', title: 'Cybersecurity Engineer', icon: 'shield', description: 'Bảo mật hệ thống thông tin', requiredSkills: ['Networking', 'Security', 'Cryptography', 'Ethical Hacking'], recommendedCourses: ['C007', 'C011', 'C008'] },
        { id: 'CT005', title: 'DevOps Engineer', icon: 'git-branch', description: 'CI/CD và vận hành hệ thống', requiredSkills: ['Linux', 'Docker', 'K8s', 'Cloud'], recommendedCourses: ['C008', 'C026', 'C027'] },
        { id: 'CT006', title: 'Full-stack Developer', icon: 'layers', description: 'Phát triển toàn diện web app', requiredSkills: ['Frontend', 'Backend', 'Database', 'DevOps'], recommendedCourses: ['C003', 'C004', 'C006', 'C005', 'C026'] },
    ],

    // ── Report Data ──
    reportData: {
        studentsByFaculty: [
            { faculty: 'CNTT', count: 1200, percentage: 35 },
            { faculty: 'QTKD', count: 800, percentage: 23 },
            { faculty: 'NN', count: 500, percentage: 15 },
            { faculty: 'KT', count: 400, percentage: 12 },
            { faculty: 'TT', count: 300, percentage: 9 },
            { faculty: 'LT', count: 200, percentage: 6 },
        ],
        gpaDistribution: [
            { range: '< 2.0', count: 150, color: '#EF4444' },
            { range: '2.0-2.5', count: 400, color: '#F59E0B' },
            { range: '2.5-3.0', count: 800, color: '#3B82F6' },
            { range: '3.0-3.5', count: 900, color: '#10B981' },
            { range: '3.5-4.0', count: 550, color: '#8B5CF6' },
        ],
        enrollmentTrend: [
            { semester: 'HK1 2024', count: 3100 },
            { semester: 'HK2 2024', count: 2950 },
            { semester: 'HK1 2025', count: 3300 },
            { semester: 'HK2 2025', count: 3200 },
        ],
        statusStats: {
            total: 3400,
            active: 2800,
            warning: 350,
            behind: 250,
        }
    }
};
