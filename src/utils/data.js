import Papa from 'papaparse';

export const fetchStuntingData = async () => {
  const response = await fetch('/Data_Gabungan_Stunting_KelompokE_2023.csv');
  const csvText = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (err) => {
        reject(err);
      }
    });
  });
};
