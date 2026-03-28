const formatNumber = (num) => new Intl.NumberFormat("vi-VN").format(num);

export const formatSalary = (salaryStart, salaryEnd) => {
  if (!salaryStart && !salaryEnd) return "Negotiable";
  if (salaryStart && salaryEnd) return `${formatNumber(salaryStart)} - ${formatNumber(salaryEnd)} VND`;
  if (salaryStart) return `From ${formatNumber(salaryStart)} VND`;
  return `Up to ${formatNumber(salaryEnd)} VND`;
};
