module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    telephone: {
      type: DataTypes.STRING(10),
    },
    avartar: {
      type: DataTypes.STRING(),
      defaultValue: "https://res.cloudinary.com/dnshsje8a/image/upload/v1647766908/Avatar/user_1_dezkrz.png"
    },
    about: {
      type: DataTypes.STRING(255),
    },
    permission: {
      type: DataTypes.ENUM(["admin", "user"]),
      allowNull: false,
      defaultValue: "user",
    },
    status: {
      type: DataTypes.ENUM(["active", "inactive"]),
      allowNull: false,
      defaultValue: "active",
    },
  });

  Users.associate = (models) => {
    // owner images
    Users.hasMany(models.Images, {
      onDelete: "cascade",
    });
    
    Users.hasMany(models.Transactions, {
      onDelete: "cascade",
    });

    Users.hasMany(models.Likes, {
      onDelete: "cascade",
    });


    Users.hasMany(models.Orders, {
      onDelete: "cascade",
    });
    
    // user has one payment
    Users.hasOne(models.PaymentUsers, {
      onDelete: "cascade",
    });

    // user has one Addresses
    Users.hasOne(models.Addresses, {
      onDelete: "cascade",
    });


  };

  return Users;
};
