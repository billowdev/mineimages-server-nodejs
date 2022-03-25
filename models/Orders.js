module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define("Orders", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    status: {
      type: DataTypes.ENUM(["oncart", "complete", "transaction"]),
      allowNull: false,
      defaultValue: "oncart",
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0,
    },
  });

  // this stack help me alot :)
  // https://stackoverflow.com/questions/41528676/sequelize-belongstomany-with-custom-join-table-primary-key

  Orders.associate = (models) => {
    Orders.belongsTo(models.Images, { foreignKey: "ImageId" });
    Orders.belongsTo(models.Users, { foreignKey: "UserId" });

    Orders.belongsTo(models.Transactions, {
      foreignKey: "TransactionId",
      allowNull: true,
    });
  };
  return Orders;
};
