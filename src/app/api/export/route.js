import { writeFile } from 'fs';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = [
      ['Ime', 'Datum', 'Začetek', 'Konec', 'Odmor'],
      ['Janez Novak', '2024-12-03', '08:00', '16:00', '12:00 - 12:30'],
    ];

    writeFile('work-log.xlsx', JSON.stringify(data), (err) => {
      if (err) {
        res.status(500).json({ error: 'Napaka pri izvozu' });
      } else {
        res.status(200).json({ message: 'Excel datoteka ustvarjena' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Metoda ${req.method} ni dovoljena.`);
  }
}
