const express = require('express');
const app = express();

app.use(express.json()); 

let books = [];
let nextId = 1;

app.post('/api/books', (req, res) => {
  const { title, author, category, quantity, available } = req.body;

  if (!title || !author || !category || quantity === undefined) {
    return res.status(400).json({
      error: 'title, author, category and quantity are required',
    });
  }
  if (!Number.isInteger(quantity) || quantity < 0) {
    return res.status(400).json({ error: 'quantity must be a non-negative integer' });
  }

  const availableCopies = available === undefined ? quantity : available;
  if (!Number.isInteger(availableCopies) || availableCopies < 0 || availableCopies > quantity) {
    return res.status(400).json({ error: 'available must be an integer between 0 and quantity' });
  }

  const book = {
    id: nextId++,
    title,
    author,
    category,
    quantity,
    available: availableCopies,
  };

  books.push(book);
  res.status(201).json(book);
});

const PORT = 3000;
app.get('/api/books', (req, res) => {
  res.json(books);
});
app.get('/api/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(book);
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
