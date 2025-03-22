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

app.get('/authors', async (req, res) => {
  const authors = await Author.findAll();
  if (authors.length === 0) {
    return res.status(404).json({ error: "No authors found" });
  }
  res.status(200).json(authors);
});

app.post('/author/new', async (req, res) => {
  try {
    const newAuthor = await Author.create(req.body);
    res.status(200).json({message: 'new author data created successfully', newAuthor});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*app.get('/genres/:genreId/authors', async (req, res) => {
  try {
    const authorsByGenreId = await Book.findAll({ where: { genreId: req.params.genreId } });
    if (authorsByGenreId.length === 0) {
      return res.status(404).json({ error: "No authors found for this genre" });
    }
    res.status(200).json({ 'Authors': authorsByGenreId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});*/

app.get('/genres/:genreId/authors', async (req, res) => {
  try {
    let genres = await Genre.findByPk(req.params.genreId);
    if (!genres) return res.status(404).json({ error: "Genre not found" });
    //let Authors = genres.forEach(genre => genre.)
    res.json(genres);
  } catch (err) {
    res.status(500).json({ error: err.stack });
  }
});

const PORT = 3010;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
