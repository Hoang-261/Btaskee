export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export enum STATUS_ASSET {
  USED = "Được sử dụng",
  READY_TO_USE = "Sẵn sàng sử dụng",
  MAINTENANCE = "Bảo trì",
}

export enum STATUS_DEPARTMENT {
  USED = "Được sử dụng",
  READY_TO_USE = "Sẵn sàng sử dụng",
  MAINTENANCE = "Bảo trì",
}

export const STATUS_DEPARTMENT_OBJ = {
  USED: "Được sử dụng",
  READY_TO_USE: "Sẵn sàng sử dụng",
  MAINTENANCE: "Bảo trì",
};

export enum CONDITION_ASSET {
  GOOD = "Tốt",
  BAD = "Xuống cấp",
  BROKEN = "Hư hỏng",
}

export const STATUS_ASSET_OBJ = {
  USED: "Được sử dụng",
  READY_TO_USE: "Sẵn sàng sử dụng",
  MAINTENANCE: "Bảo trì",
};

export const STATUS = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

export const SERVICES = {
  HOUSE_CLEANING: "Dọn dẹp nhà",
  DEEP_CLEANING: "Tổng vệ sinh",
  AIR_CONDITIONER_CLEANING: "Vệ sinh máy lạnh",
  CHILDCARE: "Chăm sóc trẻ",
  WASHING_MACHINE_CLEANING: "Vệ sinh máy giặt",
  IRONING: "Giặt ủi",
  HEATER_CLEANING: "Vệ sinh bình nóng lạnh",
};

export const STATUS_TASK = {
  CANCELLED: "Đã hủy",
  COMPLETED: "Đã hoàn thành",
  IN_PROGRESS: "Đang thực hiện",
  PENDING: "Chờ xử lý",
  UNPAID: "Chưa thanh toán",
  HIRING: "Đang thuê",
};

export const PAYMENT_METHOD = {
  CASH: "Tiền mặt",
  // BANK_TRANSFER: "Chuyển khoản ngân hàng",
  PAYPAL: "Paypal",
};

export const StatusTask = {
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
  IN_PROGRESS: "IN_PROGRESS",
  PENDING: "PENDING",
  UNPAID: "UNPAID",
  HIRING: "HIRING",
};

export const TypeTask = {
  HOUSE_CLEANING: "HOUSE_CLEANING",
  DEEP_CLEANING: "DEEP_CLEANING",
  AIR_CONDITIONER_CLEANING: "AIR_CONDITIONER_CLEANING",
  CHILDCARE: "CHILDCARE",
  WASHING_MACHINE_CLEANING: "WASHING_MACHINE_CLEANING",
  IRONING: "IRONING",
  HEATER_CLEANING: "HEATER_CLEANING",
};

export const PaymentMethod = {
  CASH: "CASH",
  BANK_TRANSFER: "BANK_TRANSFER",
  PAYPAL: "PAYPAL",
};

export const Role = {
  ADMIN: "ADMIN",
  JOB_POSTER: "JOB_POSTER",
  JOB_SEEKER: "JOB_SEEKER",
};

export const ROLE = {
  ADMIN: "Quản trị viên",
  JOB_POSTER: "Người đăng tin",
  JOB_SEEKER: "Người tìm việc",
};
