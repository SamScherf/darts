import express from 'express';
import cors from 'cors'

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
}));
const port = 5000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

