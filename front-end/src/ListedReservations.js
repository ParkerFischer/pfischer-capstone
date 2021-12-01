import React from "react";
import { Link } from "react-router-dom";
import handleCancel from "./utils/handleCancel";
import { listReservations } from "./utils/api";

//creates a single reservation cell. when called in .map creates a list of reservation cells.
function ListedReservations({ reservation, setReservations, date }) {
  //refreshes the list of reservations after one changes.
  function refreshRes() {
    const abortController = new AbortController();
    listReservations({ date }, abortController.signal).then(setReservations);

    return () => abortController.abort();
  }

  return (
    <div
      className="col-12 col-md-5  border resCard my-1"
      data-reservation-id-status={reservation.reservation_id}
    >
      <div className="row justify-content-center align-items-center mt-2 mb-1 ">
        {" "}
        Reservation Name:
        <p className="mx-1 my-1">{reservation.first_name}</p>
        <p className=" my-1">{reservation.last_name}</p>
      </div>
      <div className="row justify-content-center text-center my-1">
        <p className="mx-3 my-1">Party of: {reservation.people}</p>
        <p className=" mx-3 my-1"> Mobile #: {reservation.mobile_number}</p>
      </div>

      <div className="row justify-content-center align-items-center my-1 ">
        {" "}
        Reservation Time:
        <p className="mx-1 my-1">{reservation.reservation_time}</p>
      </div>
      <div className="row text-center statusCard px-1 py-2  mx-1 justify-content-around">
        <p
          className=" my-1"
          data-reservation-id-status={reservation.reservation_id}
        >
          Current Status: {reservation.status}
        </p>

        {reservation.status === "booked" && (
          <Link to={`/reservations/${reservation.reservation_id}/seat`}>
            <button
              className="btn btn-primary"
              type="submit"
              href={`/reservations/${reservation.reservation_id}/seat`}
            >
              {" "}
              seat
            </button>
          </Link>
        )}

        {reservation.status === "booked" && (
          <Link to={`/reservations/${reservation.reservation_id}/edit`}>
            <button
              className="btn btn-primary"
              type="submit"
              href={`/reservations/${reservation.reservation_id}/edit`}
            >
              {" "}
              Edit
            </button>
          </Link>
        )}
      </div>

      <div className="d-flex my-3 justify-content-center">
        {reservation.status === "booked" && (
          <Link to={`/reservations/${reservation.reservation_id}/seat`}>
            <button
              className="btn btn-secondary"
              data-reservation-id-cancel={reservation.reservation_id}
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleCancel(reservation.reservation_id).then(refreshRes);
              }}
            >
              {" "}
              Cancel Reservation
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default ListedReservations;
