const fs = require('fs');

let adminDash = fs.readFileSync('js/pages/admin/dashboard.js', 'utf8');
adminDash = adminDash.replace(/const facultyData = \[\s*\{ label: getFacName\(0, 'CNTT'\), value: 45 \},\s*\{ label: getFacName\(1, 'Kinh t?'\), value: 30 \},\s*\{ label: getFacName\(2, 'Ngo?i ng?'\), value: 25 \}\s*\];/, 
\const students = Store.getStudents ? Store.getStudents() : [];
            const facStats = {};
            students.forEach(s => {
                const fac = s.faculty || 'Khác';
                facStats[fac] = (facStats[fac] || 0) + 1;
            });
            const facultyData = Object.keys(facStats).map(f => ({ label: f, value: facStats[f] }));\);

adminDash = adminDash.replace(/const gpaData = \[\s*\{ label: '< 2\.0', value: 5 \},\s*\{ label: '2\.0-2\.5', value: 15 \},\s*\{ label: '2\.5-3\.2', value: 50 \},\s*\{ label: '3\.2-3\.6', value: 20 \},\s*\{ label: '> 3\.6', value: 10 \}\s*\];/,
\const gpaStats = { '< 2.0': 0, '2.0-2.5': 0, '2.5-3.2': 0, '3.2-3.6': 0, '> 3.6': 0 };
            students.forEach(s => {
                const gpa = s.gpa || 0;
                if (gpa < 2.0) gpaStats['< 2.0']++;
                else if (gpa <= 2.5) gpaStats['2.0-2.5']++;
                else if (gpa <= 3.2) gpaStats['2.5-3.2']++;
                else if (gpa <= 3.6) gpaStats['3.2-3.6']++;
                else gpaStats['> 3.6']++;
            });
            const gpaData = Object.keys(gpaStats).map(k => ({ label: k, value: gpaStats[k] }));\);
fs.writeFileSync('js/pages/admin/dashboard.js', adminDash);

let adminRep = fs.readFileSync('js/pages/admin/reports.js', 'utf8');
adminRep = adminRep.replace(/const facultyData = \[\s*\{ label: getFacName\(0, 'CNTT'\), value: 45 \},\s*\{ label: getFacName\(1, 'Kinh t?'\), value: 30 \},\s*\{ label: getFacName\(2, 'Ngo?i ng?'\), value: 25 \}\s*\];/, 
\const students = Store.getStudents ? Store.getStudents() : [];
            const facStats = {};
            students.forEach(s => {
                const fac = s.faculty || 'Khác';
                facStats[fac] = (facStats[fac] || 0) + 1;
            });
            const facultyData = Object.keys(facStats).map(f => ({ label: f, value: facStats[f] }));\);

adminRep = adminRep.replace(/const gpaData = \[\s*\{ label: '< 2\.0', value: 5 \},\s*\{ label: '2\.0-2\.5', value: 15 \},\s*\{ label: '2\.5-3\.2', value: 50 \},\s*\{ label: '3\.2-3\.6', value: 20 \},\s*\{ label: '> 3\.6', value: 10 \}\s*\];/,
\const gpaStats = { '< 2.0': 0, '2.0-2.5': 0, '2.5-3.2': 0, '3.2-3.6': 0, '> 3.6': 0 };
            students.forEach(s => {
                const gpa = s.gpa || 0;
                if (gpa < 2.0) gpaStats['< 2.0']++;
                else if (gpa <= 2.5) gpaStats['2.0-2.5']++;
                else if (gpa <= 3.2) gpaStats['2.5-3.2']++;
                else if (gpa <= 3.6) gpaStats['3.2-3.6']++;
                else gpaStats['> 3.6']++;
            });
            const gpaData = Object.keys(gpaStats).map(k => ({ label: k, value: gpaStats[k] }));\);
            
adminRep = adminRep.replace(/\['Sinh viên', 15420\], \['Môn h?c', 324\]/, 
\['Sinh viên', Store.getStudents().length], ['Môn h?c', Store.getCourses().length]\);
fs.writeFileSync('js/pages/admin/reports.js', adminRep);

let advRep = fs.readFileSync('js/pages/advisor/reports.js', 'utf8');
advRep = advRep.replace(/Charts\.bar\('course-debt-chart', \[\s*\{ label: 'CTDL', value: 12, color: '#ef4444' \},\s*\{ label: 'CSDL', value: 9, color: '#ef4444' \},\s*\{ label: 'Toán RR', value: 8, color: '#ef4444' \},\s*\{ label: 'HÐH', value: 5, color: '#ef4444' \},\s*\{ label: 'XSTK', value: 4, color: '#ef4444' \}\s*\]\);/,
\const debtStats = {};
                    myStudents.forEach(st => {
                        const grades = Store.getGradesByStudent ? Store.getGradesByStudent(st.id) : [];
                        grades.forEach(g => {
                            if (g.grade < 4.0 || g.status === 'failed') {
                                debtStats[g.courseName] = (debtStats[g.courseName] || 0) + 1;
                            }
                        });
                    });
                    const debtData = Object.keys(debtStats)
                        .map(k => ({ label: k.substring(0, 10) + (k.length > 10 ? '...' : ''), value: debtStats[k], color: '#ef4444' }))
                        .sort((a,b) => b.value - a.value)
                        .slice(0, 5);
                    
                    if (debtData.length === 0) {
                        debtData.push({ label: 'Không có n? môn', value: 0, color: '#10b981' });
                    }
                    Charts.bar('course-debt-chart', debtData);\);
fs.writeFileSync('js/pages/advisor/reports.js', advRep);
