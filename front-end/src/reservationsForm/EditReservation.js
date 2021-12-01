import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { updateReservation, getSingleReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import { asDateString } from "../utils/date-time";

function EditReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();

  //empty reservation object
  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  //states for the reservation being edited
  const [reservation, setReservation] = useState({ ...initialState });
  const [reservationErrors, setReservationErrors] = useState([]);

  //loads the reservation to be edited
  useEffect(() => {
    async function loadReservation() {
      const abortController = new AbortController();

      try {
        let result = await getSingleReservation(
          reservation_id,
          abortController.signal
        );

        let date = new Date(result.reservation_date);
        setReservation({ ...result, reservation_date: asDateString(date) });
      } catch (error) {
        setReservationErrors(error);
      }

      return () => abortController.abort();
    }

    loadReservation();
  }, [reservation_id]);

  //handles the submit for the edited reservation
  const submitHandler = async function (event) {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await updateReservation(
        { ...reservation, people: Number(reservation.people) },
        abortController.signal
      );
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
          {reservationErrors.map((r) => (
            <li key={r}>{r}</li>
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

export default EditReservation;
