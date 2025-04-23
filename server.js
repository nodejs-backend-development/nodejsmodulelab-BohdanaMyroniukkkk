const http = require('http');

// Функція для парсингу cookies
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    cookies[name] = decodeURIComponent(rest.join('='));
  });

  return cookies;
}

const server = http.createServer((req, res) => {
  // Встановити cookie
  if (req.url === '/set-cookie') {
    res.writeHead(200, {
      'Set-Cookie': 'user_info=user1',
      'Content-Type': 'text/plain'
    });
    return res.end('Cookie встановлено!');
  }

  // Читати cookie
  const cookies = parseCookies(req.headers.cookie);
  console.log('Cookies отримані:', cookies);

  res.writeHead(200, { 'Content-Type': 'application/json' });

  if (cookies.user_info === 'user1') {
    res.end(JSON.stringify({
      id: 1,
      firstName: 'Leanne',
      lastName: 'Graham'
    }));
  } else {
    res.end(JSON.stringify({}));
  }
});

server.listen(3000, () => {
  console.log('Сервер працює на http://localhost:3000');
});
