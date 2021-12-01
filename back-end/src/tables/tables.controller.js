const service = require("./tables.service.js");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//middleware and validation checks

//ensures that there is a body.data being sent
function hasData(req, res, next) {
  let data = req.body.data;
  if (!data) {
    next({ status: 400, message: "data is missing" });
  }

  next();
}
//ensures that the update request has a reservation_id to update.
function hasId(req, res, next) {
  let updateReq = req.body.data;
  if (!updateReq.reservation_id) {
    next({ status: 400, message: "Missing reservation_id" });
  }
  next();
}
//checks if a table is occupied before trying to seat a customer
async function isOccupied(req, res, next) {
  const table_id = req.params.table_id;
  const data = await service.read(table_id);
  if (!data) {
    next({ status: 404, message: `table ${table_id} does not exists` });
  }
  if (!data.reservation_id) {
    next({ status: 400, message: "table is not occupied" });
  }
  res.locals.table = data;

  next();
}

//ensures all fields are present before creating a table.
function isValidTable(req, res, next) {
  const table = req.body.data;
  let tableErrors = [];
  if (!table.table_name || table.table_name.length <= 1) {
    tableErrors.push("table_name");
  }
  if (!table.capacity || typeof table.capacity !== "number") {
    tableErrors.push("capacity");
  }
  if (tableErrors.length === 0) {
    next();
  } else {
    next({ status: 400, message: tableErrors });
  }
}

//ensures that an update request has the appropriate valid fields.
async function isValidUpdateRequest(req, res, next) {
  let table = await service.read(req.params.table_id);
  let reservation = await reservationService.read(req.body.data.reservation_id);
  if (!reservation) {
    next({
      status: 404,
      message: `${req.body.data.reservation_id} does not exist`,
    });
  }
  if (!reservation.status || reservation.status === "seated") {
    next({ status: 400, message: `table is seated` });
  }
  if (table.reservation_id) {
    next({ status: 400, message: `table is occupied` });
  }
  if (table.capacity < reservation.people) {
    next({
      status: 400,
      message: `table does not have a large enough capacity`,
    });
  }
  next();
}

//CRUD functions

//returns all tables
async function list(req, res) {
  const data = await service.list();

  res.status(200).json({ data });
}
//creates a new  table
async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({
    data,
  });
}
//updates a table to be occupied or free
async function update(req, res) {
  const table_id = req.params.table_id;
  const reservation_id = req.body.data.reservation_id;
  await reservationService.updateStatus(reservation_id, "seated");
  const data = await service.update(table_id, req.body.data);

  res.status(200).json({
    data,
  });
}
//finishes a tables meal.
async function destroy(req, res) {
  const reservation_id = res.locals.table.reservation_id;
  const table_id = res.locals.table.table_id;
  await reservationService.updateStatus(reservation_id, "finished");
  const data = await service.destroy(table_id);

  res.status(200).json({
    data,
  });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasData, isValidTable, asyncErrorBoundary(create)],
  update: [
    hasData,
    hasId,
    asyncErrorBoundary(isValidUpdateRequest),
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(isOccupied), asyncErrorBoundary(destroy)],
};
