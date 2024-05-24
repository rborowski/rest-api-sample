const vatRate = 0.23;

function getSalaryNet(salaryGross) {
  return +((salaryGross / (1 + vatRate)).toFixed(2));
}

function getSalaryGross(salaryNet) {
  return +((salaryNet * (1 + vatRate)).toFixed(2));
}

function getVatValue(salaryGross, salaryNet) {
  return +((salaryGross - salaryNet).toFixed(2));
}

module.exports = {
  getSalaryNet,
  getSalaryGross,
  getVatValue,
  vatRate
};