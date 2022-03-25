module.exports = (sequelize, DataTypes) => {
  const Addresses = sequelize.define("Addresses", {
    addressLine1: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    addressLine2: {
      type: DataTypes.STRING(100),
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  });

  Addresses.associate = (models) => {
    Addresses.belongsTo(models.Users, {
      foreignKey: "UserId",
      onDelete: "cascade",
    });
  };

  return Addresses;
};
