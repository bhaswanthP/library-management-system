'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsTo(models.Author, {
        foreignKey: {
          name: "authorId",
          allowNull: false,
        },
      });
      Book.belongsToMany(models.Genre, { through: 'BookGenres' });
    }
  }

  Book.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    publicationYear: DataTypes.INTEGER,
    authorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });

  return Book;
};
