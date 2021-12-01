import React from "react";
import { useHistory } from "react-router-dom";

function ReservationForm({ setReservation, submitHandler, reservation }) {
  const history = useHistory();

  //handles changes to the form
  function changeHandler({ target: { name, value } }) {
    setReservation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  //handles the cancel buttons actions
  const cancelHandler = async function (event) {
    event.preventDefault();

    history.goBack();
  };

  return (
    <>
      <form onChange={changeHandler}>
        <fieldset>
          <div className="d-flex text-center flex-wrap justify-content-center">
<div className="col-12">
            <h2>Please Enter Reservation Information</h2>
</div>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="col-md-6 my-1 mx-1"
              placeholder="First Name"
              require="true"
              value={reservation.first_name}
              onChange={changeHandler}
            />
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="col-md-6 my-1 mx-1"
              placeholder="Last Name"
              require="true"
              value={reservation.last_name}
              onChange={changeHandler}
            />

            <input
              type="text"
              id="mobile_number"
              name="mobile_number"
              className="col-md-6 my-1 mx-1"
              placeholder="Mobile Number"
              require="true"
              value={reservation.mobile_number}
              onChange={changeHandler}
            />
            <input
              type="number"
              id="people"
              name="people"
              className="col-md-6 my-1 mx-1"
              placeholder="Number Of People In Party"
              require="true"
              value={reservation.people}
              onChange={changeHandler}
            />

            <input
              type="date"
              id="reservation_date"
              name="reservation_date"
              className="col-md-6 my-1 mx-1"
              require="true"
              value={reservation.reservation_date}
              onChange={changeHandler}
            />
            <input
              type="time"
              id="reservation_time"
              name="reservation_time"
              className="col-md-6 my-1 mx-1"
              require="true"
              value={reservation.reservation_time}
              onChange={changeHandler}
            />
          </div>

          <div className="row justify-content-around">
            <button
              type="submit"
              className="btn btn-secondary my-2 col-5"
              onClick={submitHandler}
            >
              Submit
            </button>

            <button
              type="cancel"
              className="btn btn-secondary  my-2 text-light col-5"
              onClick={cancelHandler}
            >
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    </>
  );
}

export default ReservationForm;
