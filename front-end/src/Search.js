import React, { useState } from "react";
import { searchMobileNumber } from "./utils/api";
import ListedReservations from "./ListedReservations";

function Search() {
  //states to hold the number being searched, the reservation returned adter search and if there has beena  search performed
  const [number, setNumber] = useState("");
  const [reservationsFound, setReservationsFound] = useState([]);
  const [searched, setSearched] = useState(false);

  //handles changes to the form
  function changeHandler(e) {
    return setNumber(e.target.value);
  }

  //handles the submit button
  const submitHandler = async function (event) {
    event.preventDefault();
    const abortController = new AbortController();

    try {
      const data = await searchMobileNumber(number, abortController.signal);
      setReservationsFound(data);
      setSearched(true);
    } catch (error) {
      return;
    }
    return () => abortController.abort();
  };

  return (
    <>
      <h2 className="text-center">Search By Mobile Number </h2>
      <div className="row  mt-3 justify-content-around">
        <input
          name="mobile_number"
          id="inputState"
          className="col-5 "
          value={number}
          onChange={changeHandler}
          placeholder="Enter a customer's phone number"
        />

        <button
          type="submit"
          className="btn btn-secondary my-2 col-5"
          onClick={submitHandler}
        >
          Find
        </button>
        </div>
        <div className="row  mt-3 justify-content-around">

        {!reservationsFound.length && searched === true && (
          <div className="resCard px-4 py-2 mt-5">No reservations found</div>
        )}
        {reservationsFound.map((r) => (
          <ListedReservations key={r.reservation_id} reservation={r} />
        ))}
      </div>
    </>
  );
}

export default Search;
