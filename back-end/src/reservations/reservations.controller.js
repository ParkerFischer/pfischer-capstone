const dateFormat = /\d\d\d\d-\d\d-\d\d/;
const timeFormat = /\d\d:\d\d/;

const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//middleware and validation checks

//checks if all components of a reservation are valid before sending data to the DB
function isValidRes(req, res, next) {
  let reservation = req.body.data;
  if (!reservation) {
    next({ status: 400, message: "data is missing" });
  }
  let resErrors = [];
  let ResDate = new Date(reservation.reservation_date);

  if (reservation.reservation_time) {
    let resTime = reservation.reservation_time.split(":");
    if (parseInt(resTime[0]) <= 9 || parseInt(resTime[0]) >= 22) {
      resErrors.push("closed");
    }
    if (
      (parseInt(resTime[0]) === 10 && parseInt(resTime[1]) < 30) ||
      (parseInt(resTime[0]) === 21 && parseInt(resTime[1]) > 30)
    ) {
      resErrors.push("closed");
    }
  }

  if (ResDate.getDay() === 1) {
    resErrors.push("closed");
  }

  if (!reservation.first_name) {
    resErrors.push("first_name");
  }
  if (!reservation.last_name) {
    resErrors.push("last_name");
  }
  if (!reservation.mobile_number) {
    resErrors.push("mobile_number");
  }
  if (
    !reservation.reservation_date ||
    !reservation.reservation_date.match(dateFormat)
  ) {
    resErrors.push("reservation_date");
  }
  if (
    !reservation.reservation_time ||
    !reservation.reservation_time.match(timeFormat)
  ) {
    resErrors.push("reservation_time");
  }
  if (!reservation.people || typeof reservation.people !== "number") {
    resErrors.push("people");
  }

  if (resErrors.length === 0) {
    next();
  } else {
    next({ status: 400, message: resErrors });
  }
}

//Ensures that a reservaiton exists for an update or delete function
async function reservationExists(req, res, next) {
  let { reservation_id } = req.params;

  const reservation = await service.read(reservation_id);

  if (!reservation) {
    next({
      status: 404,
      message: `reservation_id ${reservation_id} does not exist`,
    });
  }
  res.locals.reservation = reservation;
  next();
}

//ensures that a reservation is not in the past.
function futureReservations(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const today = new Date();
  const dateInQuestion = new Date(reservation_date + " " + reservation_time);

  if (dateInQuestion < today) {
    next({
      status: 400,
      message: [`future`],
    });
  }
  next();
}

//makes sure a reservation has the appropriate status.
function hasNotBeenSeated(req, res, next) {
  if (req.body.data.status === "seated") {
    next({
      status: 400,
      message: ` ${req.body.data.reservation_id} is already seated`,
    });
  }
  if (req.body.data.status === "finished") {
    next({ status: 400, message: `finished` });
  }
  next();
}

function hasNotFinished(req, res, next) {
  let reservation = res.locals.reservation;

  if (req.body.data.status === "unknown") {
    next({ status: 400, message: "unknown" });
  }
  if (reservation.status === "finished") {
    next({ status: 400, message: `finished` });
  }
  next();
}
//checks if the request is for a search or a list.
async function isASearch(req, res, next) {
  if (!req.query.mobile_number) {
    return next();
  }

  const data = await service.search(req.query.mobile_number);

  return res.status(200).json({ data });
}

//CRUD functions
async function list(req, res) {
  let date = req.query.date;

  const data = await service.list(date);

  res.status(200).json({ data });
}

async function read(req, res) {
  let reservation = res.locals.reservation;

  res.status(200).json({ data: reservation });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({
    data,
  });
}

async function updateStatus(req, res) {
  const reservation_id = req.params.reservation_id;
  const status = req.body.data.status;

  const data = await service.updateStatus(reservation_id, status);

  res.status(200).json({ data });
}

async function update(req, res) {
  const data = await service.update(req.body.data);

  res.status(200).json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(isASearch), asyncErrorBoundary(list)],
  create: [
    isValidRes,
    futureReservations,
    hasNotBeenSeated,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    hasNotFinished,
    asyncErrorBoundary(updateStatus),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    isValidRes,
    futureReservations,
    hasNotBeenSeated,
    asyncErrorBoundary(update),
  ],
};
