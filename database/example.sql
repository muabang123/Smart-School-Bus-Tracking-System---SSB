-- Tạo database
CREATE DATABASE IF NOT EXISTS school_bus_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE school_bus_db;

-- Bảng Phụ Huynh
CREATE TABLE PhuHuynh (
    MaPhuHuynh VARCHAR(20) PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(15),
    Theodovithree VARCHAR(100),
    Nhanthongbao BOOLEAN DEFAULT TRUE
);

-- Bảng Học Sinh
CREATE TABLE HocSinh (
    MaHocSinh VARCHAR(20) PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    Lop VARCHAR(20),
    TinhTrang VARCHAR(50),
    DiemDon VARCHAR(100),
    Capnhatlinhtrang BOOLEAN DEFAULT FALSE
);

-- Bảng Điểm Đón
CREATE TABLE DiemDon (
    MaDiemDon VARCHAR(20) PRIMARY KEY,
    DiaChi TEXT,
    ThoiGianDuKien TIME
);

-- Bảng Tuyến Đường
CREATE TABLE TuyenDuong (
    MaTuyen VARCHAR(20) PRIMARY KEY,
    TenTuyen VARCHAR(100) NOT NULL,
    Themdiemdon VARCHAR(100)
);

-- Bảng Quản Lý
CREATE TABLE QuanLy (
    MaQuanLy VARCHAR(20) PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(15),
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(100) NOT NULL,
    Taolichtinh BOOLEAN DEFAULT FALSE,
    Guithongbao BOOLEAN DEFAULT FALSE,
    Phancong BOOLEAN DEFAULT FALSE
);

-- Bảng Thông Báo
CREATE TABLE ThongBao (
    MaThongBao VARCHAR(20) PRIMARY KEY,
    NoiDung TEXT,
    ThoiGian DATETIME,
    LoaiThongBao VARCHAR(50)
);

-- Bảng Chi Tiết Chuyến đi
CREATE TABLE ChiTietChuyenDi (
    TrangThaiDon VARCHAR(50),
    ThoiGianDonThucTe TIME,
    TrangThaiTra VARCHAR(50),
    ThoiGianTraThucTe TIME
);

-- Bảng Xe Buýt
CREATE TABLE XeBuyt (
    BienSoXe VARCHAR(20) PRIMARY KEY,
    SoGhe INT,
    ViTriHienTai VARCHAR(100),
    Capnhatvitri BOOLEAN DEFAULT FALSE
);

-- Bảng Lịch Trình
CREATE TABLE LichTrinh (
    MaLichTrinh VARCHAR(20) PRIMARY KEY,
    NgayThucHien DATE,
    GioBatDau TIME,
    TrangThai VARCHAR(50)
);

-- Bảng Tài Xế
CREATE TABLE TaiXe (
    MaTaiXe VARCHAR(20) PRIMARY KEY,
    HoVaTen VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(15),
    BangLai VARCHAR(50),
    Xemlichlamviec BOOLEAN DEFAULT FALSE,
    XemDanhSachHocSinh BOOLEAN DEFAULT FALSE,
    BaoCaoTinhTrangHocSinh BOOLEAN DEFAULT FALSE,
    GuiCanhBao BOOLEAN DEFAULT FALSE,
    Guitinnhan BOOLEAN DEFAULT FALSE
);

-- Tạo các bảng trung gian cho quan hệ nhiều-nhiều

-- Quan hệ Phụ Huynh - Học Sinh (1,n - 1,n)
CREATE TABLE PhuHuynh_HocSinh (
    MaPhuHuynh VARCHAR(20),
    MaHocSinh VARCHAR(20),
    PRIMARY KEY (MaPhuHuynh, MaHocSinh),
    FOREIGN KEY (MaPhuHuynh) REFERENCES PhuHuynh(MaPhuHuynh) ON DELETE CASCADE,
    FOREIGN KEY (MaHocSinh) REFERENCES HocSinh(MaHocSinh) ON DELETE CASCADE
);

-- Quan hệ Học Sinh - Điểm Đón (1,1 - 1,1)
CREATE TABLE HocSinh_DiemDon (
    MaHocSinh VARCHAR(20),
    MaDiemDon VARCHAR(20),
    PRIMARY KEY (MaHocSinh, MaDiemDon),
    FOREIGN KEY (MaHocSinh) REFERENCES HocSinh(MaHocSinh) ON DELETE CASCADE,
    FOREIGN KEY (MaDiemDon) REFERENCES DiemDon(MaDiemDon) ON DELETE CASCADE
);

-- Quan hệ Điểm Đón - Tuyến Đường (1,1 - 1,n)
CREATE TABLE DiemDon_TuyenDuong (
    MaDiemDon VARCHAR(20),
    MaTuyen VARCHAR(20),
    PRIMARY KEY (MaDiemDon, MaTuyen),
    FOREIGN KEY (MaDiemDon) REFERENCES DiemDon(MaDiemDon) ON DELETE CASCADE,
    FOREIGN KEY (MaTuyen) REFERENCES TuyenDuong(MaTuyen) ON DELETE CASCADE
);

-- Quan hệ Quản Lý - Thông Báo (1,n - 1,n)
CREATE TABLE QuanLy_ThongBao (
    MaQuanLy VARCHAR(20),
    MaThongBao VARCHAR(20),
    PRIMARY KEY (MaQuanLy, MaThongBao),
    FOREIGN KEY (MaQuanLy) REFERENCES QuanLy(MaQuanLy) ON DELETE CASCADE,
    FOREIGN KEY (MaThongBao) REFERENCES ThongBao(MaThongBao) ON DELETE CASCADE
);

-- Quan hệ Thông Báo - Chi Tiết Chuyến đi (1,n - 1,n)
CREATE TABLE ThongBao_ChiTietChuyenDi (
    MaThongBao VARCHAR(20),
    MaChiTiet INT AUTO_INCREMENT,
    TrangThaiDon VARCHAR(50),
    ThoiGianDonThucTe TIME,
    TrangThaiTra VARCHAR(50),
    ThoiGianTraThucTe TIME,
    PRIMARY KEY (MaChiTiet),
    FOREIGN KEY (MaThongBao) REFERENCES ThongBao(MaThongBao) ON DELETE CASCADE
);

-- Quan hệ Chi Tiết Chuyến đi - Xe Buýt (1,n - 1,1)
CREATE TABLE ChiTietChuyenDi_XeBuyt (
    MaChiTiet INT,
    BienSoXe VARCHAR(20),
    PRIMARY KEY (MaChiTiet, BienSoXe),
    FOREIGN KEY (MaChiTiet) REFERENCES ThongBao_ChiTietChuyenDi(MaChiTiet) ON DELETE CASCADE,
    FOREIGN KEY (BienSoXe) REFERENCES XeBuyt(BienSoXe) ON DELETE CASCADE
);

-- Quan hệ Xe Buýt - Lịch Trình (1,1 - 1,n)
CREATE TABLE XeBuyt_LichTrinh (
    BienSoXe VARCHAR(20),
    MaLichTrinh VARCHAR(20),
    PRIMARY KEY (BienSoXe, MaLichTrinh),
    FOREIGN KEY (BienSoXe) REFERENCES XeBuyt(BienSoXe) ON DELETE CASCADE,
    FOREIGN KEY (MaLichTrinh) REFERENCES LichTrinh(MaLichTrinh) ON DELETE CASCADE
);

-- Quan hệ Lịch Trình - Tài Xế (1,1 - 1,n)
CREATE TABLE LichTrinh_TaiXe (
    MaLichTrinh VARCHAR(20),
    MaTaiXe VARCHAR(20),
    PRIMARY KEY (MaLichTrinh, MaTaiXe),
    FOREIGN KEY (MaLichTrinh) REFERENCES LichTrinh(MaLichTrinh) ON DELETE CASCADE,
    FOREIGN KEY (MaTaiXe) REFERENCES TaiXe(MaTaiXe) ON DELETE CASCADE
);

-- Quan hệ Tài Xế - Tuyến Đường (1,n - 1,n)
CREATE TABLE TaiXe_TuyenDuong (
    MaTaiXe VARCHAR(20),
    MaTuyen VARCHAR(20),
    PRIMARY KEY (MaTaiXe, MaTuyen),
    FOREIGN KEY (MaTaiXe) REFERENCES TaiXe(MaTaiXe) ON DELETE CASCADE,
    FOREIGN KEY (MaTuyen) REFERENCES TuyenDuong(MaTuyen) ON DELETE CASCADE
);

-- Tạo các index để tối ưu hóa truy vấn
CREATE INDEX idx_hocsinh_lop ON HocSinh(Lop);
CREATE INDEX idx_lichTrinh_ngay ON LichTrinh(NgayThucHien);
CREATE INDEX idx_thongbao_thoigian ON ThongBao(ThoiGian);
CREATE INDEX idx_xebuyt_vitri ON XeBuyt(ViTriHienTai);

-- Thêm một số dữ liệu mẫu

-- Dữ liệu mẫu cho Phụ Huynh
INSERT INTO PhuHuynh (MaPhuHuynh, HoTen, SoDienThoai) VALUES
('PH001', 'Nguyễn Văn A', '0901234567'),
('PH002', 'Trần Thị B', '0907654321'),
('PH003', 'Lê Văn C', '0903456789');

-- Dữ liệu mẫu cho Học Sinh
INSERT INTO HocSinh (MaHocSinh, HoTen, Lop, TinhTrang) VALUES
('HS001', 'Nguyễn Thị D', '6A1', 'Đang học'),
('HS002', 'Phạm Văn E', '7B2', 'Đang học'),
('HS003', 'Hoàng Thị F', '8C3', 'Đang học');

-- Dữ liệu mẫu cho Tài Xế
INSERT INTO TaiXe (MaTaiXe, HoVaTen, SoDienThoai, BangLai) VALUES
('TX001', 'Võ Văn G', '0908765432', 'B2'),
('TX002', 'Đỗ Thị H', '0902345678', 'D'),
('TX003', 'Bùi Văn I', '0906789012', 'D');

-- Dữ liệu mẫu cho Xe Buýt
INSERT INTO XeBuyt (BienSoXe, SoGhe, ViTriHienTai) VALUES
('51B-12345', 45, 'Trường học'),
('51B-67890', 35, 'Bến xe'),
('51B-11223', 40, 'Trạm dừng 1');

-- Dữ liệu mẫu cho Tuyến Đường
INSERT INTO TuyenDuong (MaTuyen, TenTuyen) VALUES
('TD001', 'Tuyến 1 - Quận 1'),
('TD002', 'Tuyến 2 - Quận 3'),
('TD003', 'Tuyến 3 - Quận 5');

-- Dữ liệu mẫu cho Điểm Đón
INSERT INTO DiemDon (MaDiemDon, DiaChi, ThoiGianDuKien) VALUES
('DD001', '123 Nguyễn Huệ', '06:30:00'),
('DD002', '456 Lê Lợi', '06:45:00'),
('DD003', '789 Hai Bà Trưng', '07:00:00');

COMMIT;