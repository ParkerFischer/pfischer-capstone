import React from "react";
import handleDelete from "./utils/handleDelete";
import { listTables, listReservations } from "./utils/api";

//creates a single table cell. when called in .map creates a list of table cells.
function ListedTables({ table, setTables, setReservations, date }) {
  let seated = table.reservation_id === null ? "Free" : "Occupied";

  //refreshes the list of tables after one changes.
  function refreshTables() {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables);

    return () => abortController.abort();
  }

  function refreshRes() {
    const abortController = new AbortController();
    listReservations({ date }, abortController.signal).then(setReservations);

    return () => abortController.abort();
  }

  return (
    <div className=" border col-5 tableCard justify-content-center" data-table-id-status={table.table_id}>
      <p className="col text-center my-1">Table: {table.table_name}</p>
      <p className="col text-center my-1">This table can seat: {table.capacity}</p>
      <p className="col text-center my-1">This table is: {seated}</p>
      {table.reservation_id && (
        <div className="d-flex justify-content-center">
        <button
        className="btn btn-primary mb-2"
          data-table-id-finish={table.table_id}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleDelete(table).then(refreshTables).then(refreshRes);
          }}
        >
          {" "}
          Finish
        </button>
        </div>
      )}
    </div>
  );
}

export default ListedTables;
