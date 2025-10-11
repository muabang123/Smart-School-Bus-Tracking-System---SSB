# Smart School Bus Tracking System - API

## Cài đặt và chạy

```bash
cd backend
npm install
npm run dev
```

Server sẽ chạy trên: http://localhost:5000

## API Endpoints

### Buses
- GET /api/buses - Lấy tất cả xe buýt
- GET /api/buses/:id - Lấy xe buýt theo ID
- POST /api/buses - Tạo xe buýt mới
- PUT /api/buses/:id - Cập nhật xe buýt
- DELETE /api/buses/:id - Xóa xe buýt

### Students
- GET /api/students - Lấy tất cả học sinh
- GET /api/students/:id - Lấy học sinh theo ID
- POST /api/students - Tạo học sinh mới
- PUT /api/students/:id - Cập nhật học sinh
- DELETE /api/students/:id - Xóa học sinh
- GET /api/students/bus/:busId - Lấy học sinh theo xe buýt

### Routes
- GET /api/routes - Lấy tất cả tuyến đường
- GET /api/routes/:id - Lấy tuyến đường theo ID
- POST /api/routes - Tạo tuyến đường mới
- PUT /api/routes/:id - Cập nhật tuyến đường
- DELETE /api/routes/:id - Xóa tuyến đường
- GET /api/routes/:id/buses - Lấy xe buýt theo tuyến đường

## Test với Postman

Import file `Smart_School_Bus_Tracking_API.postman_collection.json` vào Postman để test các API endpoints.
