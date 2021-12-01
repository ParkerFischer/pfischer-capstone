import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables } from "./utils/api";
import ErrorAlert from "./layout/ErrorAlert";
import { updateTable } from "./utils/api";

function SeatTable() {
  const history = useHistory();
  const { reservation_id } = useParams();

  //state to hold a list of all current tables.
  //state to hold the current table that is selected by the input field

  const [tables, setTables] = useState([]);
  const [currentTable, setCurrentTable] = useState(0);
  const [tablesError, setTablesError] = useState(null);

  //creates option items out of all the tables available
  let options = tables.map((table) => (
    <option key={table.table_id} value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ));

  //loads tables for the input field
  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  //handles submit button
  const submitHandler = async function (event) {
    event.preventDefault();
    const abortController = new AbortController();

    try {
      await updateTable(
        { reservation_id },
        currentTable,
        abortController.signal
      );
    } catch (error) {
      setTablesError(error);
      return;
    }
    history.push(`/dashboard`);
    return () => abortController.abort();
  };

  //handles changes to the input field.
  function changeHandler(e) {
    return setCurrentTable(e.target.value);
  }

  return (
    <>
      <div className="col justify-content-around">
        <ErrorAlert error={tablesError} />
        <h2 className="col text-center">
          Please select a table to seat reservation {reservation_id}
        </h2>
      </div>
      <div className="col d-flex justify-content-around">
        <select
          id="inputState"
          className="col-5"
          name="table_id"
          value={currentTable}
          onChange={changeHandler}
          require="true"
        >
          <option value={0}>Please Select A Table</option>
          {options}
        </select>

        <button
          type="submit"
          className="btn btn-secondary col-5"
          onClick={submitHandler}
        >
          Submit
        </button>
      </div>
    </>
  );
}

export default SeatTable;
