module.exports = (sequelize, DataTypes) => {
  const Images = sequelize.define("Images", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    publicId:{
      type: DataTypes.STRING(),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    detail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    pathOrigin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pathWatermark: {
      type: DataTypes.STRING,
      defaultValue:
        "https://res.cloudinary.com/dnshsje8a/image/upload/v1647843792/default/5203299_id0fbv.jpg",
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0,
    },
    visible: {
      type: DataTypes.ENUM(["public", "private"]),
      allowNull: false,
      defaultValue: "private",
    },
    status: {
      type: DataTypes.ENUM(["active", "inactive"]),
      allowNull: false,
      defaultValue: "inactive",
    },
    remove: {
      type: DataTypes.ENUM(["YES", "NO"]),
      allowNull: false,
      defaultValue: "NO",
    },
  });

  Images.associate = (models) => {
    Images.belongsTo(models.Users, {
      foreignKey: "UserId",
    });

    Images.hasMany(models.Orders, {
      onDelete: "cascade",
    });

    Images.hasMany(models.Likes, {
      onDelete: "cascade",
    });
  };
  return Images;
};
