var _ = require("underscore");

const advancedResults = (model, populate) => async (req, res, next) => {
  let query;
  // Copy req.query
  const reqQuery = { ...req.query };
  console.log(reqQuery);
  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|lk)\b/g, match => `$${match}`);

  let fields;
  // Select Fields
  if (req.query.select) {
    fields = req.query.select.split(",");
  }
  //Sorting snippet
  const SortOption = {
    order: []
  };

  // handle sorting / ordering
  if (req.query.sort) {
    const sorts = req.query.sort.split(",");
    _.each(sorts, sort => {
      let field = sort;
      let order = "ASC";
      if (sort.charAt(0) === "-") {
        order = "DESC";
        field = sort.substring(1); // everything after first char
      }

      SortOption.order.push([field, order]);
    });
  } else {
    // default ordering (createdAt)
    SortOption.order.push(["createdAt", "DESC"]);
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || null;
  const startIndex = (page - 1) * (limit || 0);
  const endIndex = page * (limit || 0);
  const total = await model.count();

  // find query
  query = model.findAll({
    limit: limit,
    offset: startIndex,
    where: JSON.parse(queryStr),
    attributes: fields,
    order: SortOption.order,
    include: populate
  });

  const results = await query;

  // Pagination result
  // const pagination = {};

  // if (endIndex < total) {
  //   pagination.next = {
  //     page: page + 1,
  //     limit
  //   };
  // }

  // if (startIndex > 0) {
  //   pagination.prev = {
  //     page: page - 1,
  //     limit
  //   };
  // }

  res.advancedResults = {
    success: true,
    count: results.length,
    total,
    // pagination,
    data: results
  };

  next();
};

module.exports = advancedResults;
