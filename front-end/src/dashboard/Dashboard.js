import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/date-time";
import { Link } from "react-router-dom";
import ListedReservations from "../ListedReservations";
import ListedTables from "../ListedTables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  //states to hold the current list of reservations
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  //states to hold the current list of tables
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  //loads the initial list of tables and reservations
  useEffect(loadDashboard, [date]);
  useEffect(loadTables, []);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    return () => abortController.abort();
  }

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1 className="d-flex justify-content-center">Dashboard</h1>
      <div className="d-flex mb-3 justify-content-around flex-wrap ">
        {tables.map((t) => (
          <ListedTables
            key={t.table_id}
            table={t}
            setTables={setTables}
            setReservations={setReservations}
            date={date}
          />
        ))}
      </div>

      <div className="d-flex mb-3 justify-content-around row">
        <Link to={`/dashboard?date=${previous(date)}`}>
          <button className="btn btn-secondary btn-lg px-3">Previous</button>
        </Link>
        <Link to={`/dashboard?date=${today()}`}>
          <button className="btn btn-secondary btn-lg mr-md-3 px-4">
            Today
          </button>
        </Link>
        <Link to={`/dashboard?date=${next(date)}`}>
          <button className="btn btn-secondary btn-lg px-4">Next </button>
        </Link>
      </div>
      <div className="d-md-flex mb-3 justify-content-center">
        <h4 className="mb-0 px-4 py-2 text-center font-weight-bolder resCard">
          Reservations for date {date}
        </h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />

      <div className="d-flex text-center mb-3 flex-wrap justify-content-center">
        {reservations.length === 0 && (
          <h4 className="resCard px-4 py-2">
            There are currently no reservaitons for today
          </h4>
        )}
      </div>
      <div className="d-flex col px-0 flex-wrap justify-content-center">
        {reservations.map((r) => (
          <ListedReservations
            date={date}
            setReservations={setReservations}
            key={r.reservation_id}
            reservation={r}
          />
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
