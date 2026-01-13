export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.send('<h1>Hello CatalogGuard</h1>');
}
