
const bcrypt = require('bcryptjs');

async function check() {
  const hash = '$2b$10$tJAlejL9WVcyNr/qAqMhHeYEOUP8keEUpon05JE5gU22.ULl2GPAW';
  const pass = 'Admin123!';
  const match = await bcrypt.compare(pass, hash);
  console.log(`Password '${pass}' matches hash? ${match}`);
}

check();
