module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define("Categories", {
    name: {
      type: DataTypes.STRING,
    },
    desc: {
      type: DataTypes.STRING,
    },
  });

  Categories.associate = (models) => {
    Categories.hasMany(models.Images, {
      onDelete: "cascade"
    })
  };
  

  return Categories;
};
