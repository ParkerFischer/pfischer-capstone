import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { postReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function NewReservation() {
  const history = useHistory();

  //empty reservation object
  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  //states for the reservation
  const [reservation, setReservation] = useState({ ...initialState });
  const [reservationErrors, setReservationErrors] = useState([]);

  //handles the submit of the new reservation
  const submitHandler = async function (event) {
    event.preventDefault();
    try {
      await postReservation({
        ...reservation,
        people: Number(reservation.people),
      });
    } catch (error) {
      setReservationErrors(error.message);

      return;
    }
    let resDate = reservation.reservation_date;
    setReservation({ ...initialState });
    history.push(`/dashboard?date=${resDate}`);
  };

  return (
    <>
      {reservationErrors.length === 0 ? null : (
        <ul className="alert alert-danger">
          {reservationErrors.map((r, index) => (
            <li key={index}>{r}</li>
          ))}
        </ul>
      )}
      <ReservationForm
        setReservation={setReservation}
        submitHandler={submitHandler}
        reservation={reservation}
        reservationErrors={reservationErrors}
      />
    </>
  );
}

export default NewReservation;
