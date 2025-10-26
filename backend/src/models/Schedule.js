import mongoose from "mongoose";
const { Schema } = mongoose;

const scheduleSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true,
        default: 1 // 1: Sắp diễn ra, 2: Đang chạy, 3: Đã hoàn thành, 4: Đã huỷ
    },
    route: {
        type: Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },
    bus: {
        type: Schema.Types.ObjectId,
        ref: 'Bus',
        required: true
    },
    driverId: {
        type: String, // Tạm dùng String vì model Driver chưa có
        required: true
    }
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

export default mongoose.model('Schedule', scheduleSchema);