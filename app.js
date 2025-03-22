const express = require('express');
const bodyParser = require('body-parser');
const { Author, Book, Genre } = require('./models'); // Import Sequelize models

const app = express();
app.use(bodyParser.json());

app.get('/seed_db', async (req, res) => {
    res.json({ message: "Database seeded successfully" });
});

app.get('/books', async (req, res) => {
  const books = await Book.findAll({ include: [Author, Genre] });
  res.json(books);
});

app.get('/authors/:authorId/books', async (req, res) => {
  const books = await Book.findAll({
    where: { authorId: req.params.authorId },
    include: [Genre]
  });
  res.json(books);
});

app.get('/genres/:genreId/books', async (req, res) => {
  const genre = await Genre.findByPk(req.params.genreId, { include: [Book] });
  if (!genre) return res.status(404).json({ error: "Genre not found" });
  res.json(genre.Books);
});

app.post('/books', async (req, res) => {
  const { title, description, publicationYear, authorId, genreIds } = req.body;

  const author = await Author.findByPk(authorId);
  if (!author) return res.status(404).json({ error: "Author not found" });

  const book = await Book.create({ title, description, publicationYear, authorId });

  await book.setGenres(genreIds);

  res.json(book);
});


const PORT = 3010;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
