const { Orders, Transactions, Images, Users } = require("../models");
const Op = require("sequelize").Op;
const { conn } = require("../config/rawQueryConfig");

exports.getAllOrders = async (req, res, next) => {
  try {
    const reqUserId = req.user.id;
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.per_page);
    const sortColumn = req.query.sort_column;
    const sortDirection = req.query.sort_direction;
    const search = req.query.search;
    const startIndex = (page - 1) * perPage;

    const total = await Orders.count({ where: { UserId: reqUserId } });

    let totalPages = total / perPage;
    let data;
    if (search && sortColumn) {
      data = await Orders.findAll({
        offset: startIndex,
        limit: perPage,
        where: { UserId: reqUserId },
        include: [
          {
            model: Images,
            require: true,
            order: [[sortColumn, sortDirection]],
            where: {
              name: {
                [Op.like]: `%${search}%`,
              },
            },
          },
        ],
      });
    } else if (search) {
      data = await Orders.findAll({
        where: { UserId: reqUserId },
        include: [
          {
            model: Images,
            require: true,
            where: {
              name: {
                [Op.like]: `%${search}%`,
              },
            },
          },
        ],
      });
    } else if (sortColumn) {
      data = await Orders.findAll({
        offset: startIndex,
        limit: perPage,
        where: { UserId: reqUserId },
        include: [
          {
            model: Images,
            require: true,
            order: [[sortColumn, sortDirection]],
          },
        ],
      });
    } else {
      data = await Orders.findAll({
        offset: startIndex,
        limit: perPage,
        where: { UserId: reqUserId },
        include: [
          {
            model: Images,
            require: true,
          },
        ],
      });
    }
    res.json({
      page: page,
      per_page: perPage,
      total_pages: totalPages,
      total: total,
      data,
    });
  } catch (err) {
    console.log("Error at get order user controllers", err);
    res.status(401).send("Error can't get order");
  }
};

  // ===========================================================

  // const listOrderOncart = await Orders.findAll({
  //   where: { UserId: UserId, status: "oncart" },
  // });

  // const listOrderComplete = await Orders.findAll({
  //   where: { UserId: UserId, status: "complete" },
  // });

  // const listOrderTransaction = await Orders.findAll({
  //   where: { UserId: UserId, status: "transaction" },
  // });

  // const response = {
  //   order: {
  //     oncart: listOrderOncart,
  //     complete: listOrderComplete,
  //     transaction: listOrderTransaction,
  //   },
  // }
  // res.json(response);