export const JOB_LEVEL_LABELS = {
    INTERN: "Intern",
    JUNIOR: "Junior",
    MIDDLE: "Middle",
    SENIOR: "Senior",
    LEAD: "Lead",
    MANAGER: "Manager"
};

// export const locationOptions = [
//     { label: "All Cities", value: "" },
//     { label: "Ha Noi", value: "Ha Noi" },
//     { label: "Ho Chi Minh City", value: "Ho Chi Minh City" },
//     { label: "Da Nang", value: "Da Nang" },
//     { label: "Remote", value: "Remote" }
// ];

export const jobLevelOptions = [
    { label: "All Levels", value: "" },
    ...Object.entries(JOB_LEVEL_LABELS).map(([key, value]) => ({ label: value, value: key }))
];

export const workingModelOptions = [
    { label: "All Models", value: "" },
    { label: "Remote", value: "REMOTE" },
    { label: "On-site", value: "ONSITE" },
    { label: "Hybrid", value: "HYBRID" }
];

export const VIETNAM_PROVINCES = [
    'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
    'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
    'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
    'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hoà Bình',
    'Hưng Yên', 'Khánh Hoà', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
    'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
    'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
    'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị',
    'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
    'Thanh Hoá', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh',
    'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái',
];
