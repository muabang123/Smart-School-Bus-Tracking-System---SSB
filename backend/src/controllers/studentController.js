// Dữ liệu mẫu cho students
let students = [
  { id: 1, name: "Nguyễn Văn An", grade: "10A1", busId: 1 },
  { id: 2, name: "Trần Thị Bình", grade: "10A2", busId: 1 },
  { id: 3, name: "Lê Văn Cường", grade: "11A1", busId: 2 }
];

// GET /api/students - Lấy tất cả học sinh
export const getAllStudents = (req, res) => {
  res.json(students);
};

// GET /api/students/:id - Lấy học sinh theo ID
export const getStudentById = (req, res) => {
  const student = students.find(s => s.id == req.params.id);
  if (!student) {
    return res.status(404).json({ message: "Không tìm thấy học sinh" });
  }
  res.json(student);
};

// POST /api/students - Tạo học sinh mới
export const createStudent = (req, res) => {
  const { name, grade, busId } = req.body;
  const newStudent = {
    id: students.length + 1,
    name,
    grade,
    busId
  };
  students.push(newStudent);
  res.status(201).json(newStudent);
};

// PUT /api/students/:id - Cập nhật học sinh
export const updateStudent = (req, res) => {
  const studentIndex = students.findIndex(s => s.id == req.params.id);
  if (studentIndex === -1) {
    return res.status(404).json({ message: "Không tìm thấy học sinh" });
  }
  
  const { name, grade, busId } = req.body;
  students[studentIndex] = { ...students[studentIndex], name, grade, busId };
  res.json(students[studentIndex]);
};

// DELETE /api/students/:id - Xóa học sinh
export const deleteStudent = (req, res) => {
  const studentIndex = students.findIndex(s => s.id == req.params.id);
  if (studentIndex === -1) {
    return res.status(404).json({ message: "Không tìm thấy học sinh" });
  }
  
  const deletedStudent = students.splice(studentIndex, 1)[0];
  res.json(deletedStudent);
};

// GET /api/students/bus/:busId - Lấy học sinh theo xe buýt
export const getStudentsByBus = (req, res) => {
  const busStudents = students.filter(s => s.busId == req.params.busId);
  res.json(busStudents);
};
