let workLogs = [];

export async function GET(req) {
  const url = new URL(req.url);
  const month = url.searchParams.get('month');
  if (month) {
    const filteredLogs = workLogs.filter((log) => log.date.startsWith(month));
    return new Response(JSON.stringify(filteredLogs), { status: 200 });
  }
  return new Response(JSON.stringify(workLogs), { status: 200 });
}

export async function POST(req) {
  const body = await req.json();
  const { date, startTime, endTime, breakStart, breakEnd } = body;
  if (!date || !startTime || !endTime) {
    return new Response(JSON.stringify({ error: 'Datum, začetek in konec so obvezni.' }), { status: 400 });
  }
  const newLog = {
    id: Date.now(),
    date,
    startTime,
    endTime,
    breakStart,
    breakEnd,
  };
  workLogs.push(newLog);
  return new Response(JSON.stringify(newLog), { status: 201 });
}
