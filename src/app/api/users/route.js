let users = [];

export async function GET(req) {
  return new Response(JSON.stringify(users), { status: 200 });
}

export async function POST(req) {
  const body = await req.json();
  const { name, email, employmentType, isActive } = body;
  if (!name || !email || !employmentType) {
    return new Response(JSON.stringify({ error: 'Ime, email in vrsta zaposlitve so obvezni.' }), { status: 400 });
  }
  const newUser = { id: Date.now(), name, email, employmentType, isActive };
  users.push(newUser);
  return new Response(JSON.stringify(newUser), { status: 201 });
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  users = users.filter((user) => user.id !== parseInt(id, 10));
  return new Response(JSON.stringify({ message: 'Uporabnik izbrisan.' }), { status: 200 });
}
