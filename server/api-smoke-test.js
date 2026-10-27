// Run with the server already started:  npm run test:api
// Requires Node 18+ (built-in fetch). Creates, reads, updates and deletes one test book.
const BASE = process.env.API_URL || 'http://localhost:5000/api';
let failed = 0;
let token;

function check(name, cond) {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`);
  if (!cond) failed++;
}
async function call(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, json: await res.json() };
}

(async () => {
  const suffix = Date.now();
  const account = await call('POST', '/auth/register', { name: 'Smoke User', email: `smoke-${suffix}@example.com`, password: 'password123' });
  check('POST register -> 201', account.status === 201 && account.json.data.token);
  token = account.json.data.token;

  const bad = await call('POST', '/books', { title: '', author: '' });
  check('POST invalid -> 400', bad.status === 400);

  const created = await call('POST', '/books', { title: 'Smoke Test Book', author: 'Test Author', genre: 'Science', status: 'Reading', rating: 4, pages: 200 });
  check('POST valid -> 201', created.status === 201);
  const id = created.json.data && created.json.data._id;

  const list = await call('GET', '/books?q=smoke');
  check('GET list finds new book', list.status === 200 && list.json.data.some((b) => b._id === id));

  const one = await call('GET', `/books/${id}`);
  check('GET by id -> 200', one.status === 200 && one.json.data.title === 'Smoke Test Book');

  const upd = await call('PUT', `/books/${id}`, { title: 'Smoke Test Book', author: 'Test Author', genre: 'Science', status: 'Finished', rating: 5, pages: 200 });
  check('PUT -> 200 and status changed', upd.status === 200 && upd.json.data.status === 'Finished');

  const badId = await call('GET', '/books/not-an-id');
  check('GET invalid id -> 400', badId.status === 400);

  const del = await call('DELETE', `/books/${id}`);
  check('DELETE -> 200', del.status === 200);

  const gone = await call('GET', `/books/${id}`);
  check('GET deleted -> 404', gone.status === 404);

  console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error('Could not reach API:', e.message); process.exit(1); });
