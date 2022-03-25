module.exports = (sequelize, DataTypes) => {
  const PaymentUsers = sequelize.define("PaymentUsers", {
    provider: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    cardNumber: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    securityCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
  });

  PaymentUsers.associate = (models) => {
    PaymentUsers.belongsTo(models.Users, {
      foreignKey: "UserId",
      onDelete: "cascade",
    });
  };
  return PaymentUsers;
};
