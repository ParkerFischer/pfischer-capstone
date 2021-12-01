const knex = require("../db/connection");
//returns a single reservation
function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .first();
}
//returns all reservaitons for a specific date
function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .whereNot({ status: "cancelled" })
    .orderBy("reservation_time", "asc");
}
//creates a reservation
function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((reservation) => reservation[0]);
}
//updates the status field of a reservation
function updateStatus(reservation_id, status) {
  return knex("reservations")
    .update({ status })
    .where({ reservation_id: reservation_id })
    .returning("*")
    .then((table) => table[0]);
}
//updates all keys of a reservation
function update(reservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation.reservation_id })
    .update(reservation, "*")
    .then((reservation) => reservation[0]);
}
//searches for reservations based on a phone number.
function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  create,
  read,
  updateStatus,
  search,
  update,
};
