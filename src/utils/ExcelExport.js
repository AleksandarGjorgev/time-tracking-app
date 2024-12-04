import { writeFile, utils } from 'xlsx';

export function exportToExcel(data, filename) {
  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Work Logs');
  writeFile(wb, `${filename}.xlsx`);
}
