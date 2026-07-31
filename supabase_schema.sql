-- ============================================
-- VLU SmartEdu — Supabase Schema (Clean)
-- ============================================

-- 1. Users
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    studentId TEXT,
    avatar TEXT
);

-- 2. Faculties
CREATE TABLE faculties (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL
);

-- 3. Students
CREATE TABLE students (
    id TEXT PRIMARY KEY,
    mssv TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    faculty TEXT,
    major TEXT,
    enrollYear INTEGER,
    gpa NUMERIC(3, 2),
    creditsCompleted INTEGER,
    totalCredits INTEGER,
    status TEXT,
    advisorId TEXT,
    curriculumId TEXT,
    gender TEXT,
    dob TEXT
);

-- 4. Courses
CREATE TABLE courses (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    credits INTEGER NOT NULL,
    faculty TEXT,
    type TEXT,
    description TEXT,
    semester INTEGER
);

-- 5. Prerequisites
CREATE TABLE prerequisites (
    id TEXT PRIMARY KEY,
    courseId TEXT NOT NULL,
    prerequisiteCourseId TEXT NOT NULL,
    type TEXT,
    UNIQUE(courseId, prerequisiteCourseId)
);

-- 6. Curricula
CREATE TABLE curricula (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    faculty TEXT,
    totalCredits INTEGER,
    mandatoryCredits INTEGER,
    electiveCredits INTEGER,
    status TEXT,
    year TEXT,
    courses JSONB -- Array of course IDs
);

-- 7. Sections (Classes)
CREATE TABLE sections (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    courseId TEXT NOT NULL,
    semester TEXT NOT NULL,
    instructor TEXT,
    room TEXT,
    maxStudents INTEGER,
    enrolledCount INTEGER,
    status TEXT,
    schedule TEXT,
    UNIQUE(code, semester)
);

-- 8. Grades
CREATE TABLE grades (
    id TEXT PRIMARY KEY,
    studentId TEXT NOT NULL,
    courseId TEXT NOT NULL,
    grade NUMERIC(4, 2),
    letterGrade TEXT,
    semester TEXT,
    status TEXT,
    UNIQUE(studentId, courseId)
);

-- 9. Learning Paths
CREATE TABLE learning_paths (
    id TEXT PRIMARY KEY,
    studentId TEXT NOT NULL,
    status TEXT,
    semester TEXT,
    suggestedCourses JSONB,
    selectedCourses JSONB,
    totalCredits INTEGER,
    createdAt TEXT,
    advisorNote TEXT,
    approvalStatus TEXT
);

-- 10. Notifications
CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    "from" TEXT,
    "to" TEXT,
    title TEXT,
    content TEXT,
    type TEXT,
    read BOOLEAN DEFAULT false,
    createdAt TEXT
);

-- 11. Advisory Logs
CREATE TABLE advisory_logs (
    id TEXT PRIMARY KEY,
    advisorId TEXT NOT NULL,
    studentId TEXT NOT NULL,
    action TEXT,
    note TEXT,
    createdAt TEXT
);

-- 12. Career Targets
CREATE TABLE career_targets (
    id TEXT PRIMARY KEY,
    title TEXT,
    icon TEXT,
    description TEXT,
    requiredSkills JSONB,
    recommendedCourses JSONB
);

-- ============================================
-- 13. TÀI KHOẢN MẶC ĐỊNH (Cho 3 phân quyền)
-- ============================================

INSERT INTO users (id, email, password, name, role, department, studentId, avatar) VALUES
('U001', 'admin@vlu.edu.vn', 'admin123', 'Quản trị viên', 'admin', 'Phòng Đào tạo', NULL, 'A'),
('U002', 'advisor@vlu.edu.vn', 'advisor123', 'Cố vấn Học tập', 'advisor', 'Khoa CNTT', NULL, 'C'),
('U003', 'student@vlu.edu.vn', 'student123', 'Sinh viên Mẫu', 'student', NULL, 'S001', 'S');

-- Sinh viên mẫu (bắt buộc để tài khoản Sinh viên hoạt động) và các sinh viên khác để có dữ liệu
INSERT INTO students (id, mssv, name, email, phone, faculty, major, enrollYear, gpa, creditsCompleted, totalCredits, status, advisorId, curriculumId, gender, dob) VALUES
('S001', '2174802010000', 'Sinh viên Mẫu', 'student@vlu.edu.vn', '0901234567', 'CNTT', 'Kỹ thuật Phần mềm', 2021, 3.2, 95, 140, 'active', 'U002', NULL, 'Nam', '2003-05-15'),
('S002', '2174802010001', 'Nguyễn Thị Mai', '2174802010001@vlu.edu.vn', '0912345678', 'CNTT', 'Kỹ thuật Phần mềm', 2021, 3.6, 105, 140, 'active', 'U002', NULL, 'Nữ', '2003-03-20'),
('S003', '2174802010002', 'Phạm Hoàng Dũng', '2174802010002@vlu.edu.vn', '0923456789', 'CNTT', 'Hệ thống Thông tin', 2021, 1.8, 70, 140, 'warning', 'U002', NULL, 'Nam', '2003-08-10'),
('S004', '2174802010003', 'Trần Thùy Linh', '2174802010003@vlu.edu.vn', '0934567890', 'CNTT', 'Kỹ thuật Phần mềm', 2022, 3.8, 65, 140, 'active', 'U002', NULL, 'Nữ', '2004-01-25'),
('S005', '2174802010004', 'Võ Đình Khoa', '2174802010004@vlu.edu.vn', '0945678901', 'CNTT', 'Khoa học Dữ liệu', 2022, 2.1, 55, 140, 'behind', 'U002', NULL, 'Nam', '2004-06-12'),
('S006', '2174802010005', 'Đỗ Thanh Hà', '2174802010005@vlu.edu.vn', '0956789012', 'CNTT', 'Kỹ thuật Phần mềm', 2021, 2.9, 88, 140, 'active', 'U002', NULL, 'Nữ', '2003-11-30'),
('S007', '2174802010006', 'Bùi Công Danh', '2174802010006@vlu.edu.vn', '0967890123', 'CNTT', 'An toàn Thông tin', 2022, 3.4, 60, 140, 'active', 'U002', NULL, 'Nam', '2004-09-05'),
('S008', '2174802010007', 'Huỳnh Ngọc Anh', '2174802010007@vlu.edu.vn', '0978901234', 'CNTT', 'Kỹ thuật Phần mềm', 2023, 3.1, 32, 140, 'active', 'U002', NULL, 'Nữ', '2005-02-14'),
('S009', '2274801020001', 'Nguyễn Hoàng Phúc', '2274801020001@vlu.edu.vn', '0989012345', 'QTKD', 'Marketing', 2022, 3.5, 72, 130, 'active', 'U002', NULL, 'Nam', '2004-04-22'),
('S010', '2274801020002', 'Lý Thị Bích Ngọc', '2274801020002@vlu.edu.vn', '0990123456', 'QTKD', 'Quản trị Kinh doanh', 2022, 1.7, 48, 130, 'warning', 'U002', NULL, 'Nữ', '2004-07-08'),
('S011', '2174802010008', 'Trương Minh Hải', '2174802010008@vlu.edu.vn', '0901122334', 'CNTT', 'Kỹ thuật Phần mềm', 2021, 2.5, 80, 140, 'behind', 'U002', NULL, 'Nam', '2003-12-01'),
('S012', '2174802010009', 'Phan Thị Yến Nhi', '2174802010009@vlu.edu.vn', '0912233445', 'CNTT', 'Kỹ thuật Phần mềm', 2023, 3.9, 35, 140, 'active', 'U002', NULL, 'Nữ', '2005-06-18'),
('S013', '2174802010010', 'Đặng Tuấn Vũ', '2174802010010@vlu.edu.vn', '0933445566', 'CNTT', 'Trí tuệ Nhân tạo', 2021, 3.8, 110, 140, 'active', 'U002', NULL, 'Nam', '2003-02-11'),
('S014', '2274802010001', 'Vương Bảo Nhi', '2274802010001@vlu.edu.vn', '0944556677', 'CNTT', 'Hệ thống Thông tin', 2022, 3.3, 70, 140, 'active', 'U002', NULL, 'Nữ', '2004-10-05'),
('S015', '2374802010001', 'Hoàng Quốc Việt', '2374802010001@vlu.edu.vn', '0955667788', 'CNTT', 'Mạng Máy tính', 2023, 2.7, 30, 140, 'active', 'U002', NULL, 'Nam', '2005-01-20');

-- Dữ liệu tĩnh các Khoa (vì App chưa có trang Quản lý Khoa)
INSERT INTO faculties (id, name, code) VALUES
('F001', 'Khoa Công nghệ Thông tin', 'CNTT'),
('F002', 'Khoa Quản trị Kinh doanh', 'QTKD'),
('F003', 'Khoa Ngoại ngữ', 'NN'),
('F004', 'Khoa Kiến trúc', 'KT'),
('F005', 'Khoa Truyền thông', 'TT'),
('F006', 'Khoa Luật', 'LT');

-- Dữ liệu mẫu trang Hướng nghiệp Sinh viên
INSERT INTO career_targets (id, title, icon, description, requiredSkills, recommendedCourses) VALUES
('CT001', 'Frontend Developer', 'monitor', 'Phát triển giao diện web hiện đại', '["HTML/CSS", "JavaScript", "React/Vue", "UI/UX Design"]', '[]');
