let absenceTypes = [];

export async function GET(req) {
  return new Response(JSON.stringify(absenceTypes), { status: 200 });
}

export async function POST(req) {
  const body = await req.json();
  if (!body.name) {
    return new Response(JSON.stringify({ error: 'Ime odsotnosti je obvezno.' }), { status: 400 });
  }
  const newType = { id: Date.now(), name: body.name };
  absenceTypes.push(newType);
  return new Response(JSON.stringify(newType), { status: 201 });
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  absenceTypes = absenceTypes.filter((type) => type.id !== parseInt(id, 10));
  return new Response(JSON.stringify({ message: 'Odsotnost izbrisana.' }), { status: 200 });
}
