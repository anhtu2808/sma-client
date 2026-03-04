export const JOB_LEVEL_LABELS = {
    INTERN: "Intern",
    JUNIOR: "Junior",
    MIDDLE: "Middle",
    SENIOR: "Senior",
    LEAD: "Lead",
    MANAGER: "Manager"
};

export const locationOptions = [
    { label: "All Cities", value: "" },
    { label: "Ha Noi", value: "Ha Noi" },
    { label: "Ho Chi Minh City", value: "Ho Chi Minh City" },
    { label: "Da Nang", value: "Da Nang" },
    { label: "Remote", value: "Remote" }
];

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
