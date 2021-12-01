import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { postTable } from "../utils/api";

function TablesNew() {
  const history = useHistory();

  //empty table object
  const initialState = {
    table_name: "",
    capacity: "",
  };

  //states for the table
  const [table, setTable] = useState({ ...initialState });
  const [tableErrors, setTableErrors] = useState([]);

  //handles changes to the form
  function changeHandler({ target: { name, value } }) {
    setTable((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  //handles the cancel button
  function cancelHandler() {
    history.goBack();
  }

  //handles the submission of the form
  const submitHandler = async function (event) {
    event.preventDefault();
    try {
      await postTable({ ...table, capacity: Number(table.capacity) });
    } catch (error) {
      setTableErrors(error.message);
      return;
    }
    setTable({ ...initialState });
    history.push(`/dashboard`);
    return;
  };

  return (
    <>
      {tableErrors.length === 0 ? null : (
        <ul className="alert alert-danger">
          {tableErrors.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}

      <form className="" onChange={changeHandler}>
        <fieldset>
          <div className="d-flex text-center flex-wrap justify-content-center">
            <h2>Please Enter A New Table</h2>
          </div>
          <div className="d-flex  flex-wrap justify-content-center">
            <input
              type="text"
              id="table_name"
              name="table_name"
              className="col-md-6 my-1 mx-1"
              placeholder="Table Name"
              require="true"
              value={table.table_name}
              onChange={changeHandler}
            />
            <input
              type="text"
              id="capacity"
              name="capacity"
              className="col-md-6 my-1 mx-1"
              placeholder="Capacity"
              require="true"
              value={table.capacity}
              onChange={changeHandler}
            />
          </div>
          <div className="row justify-content-around">
            <button
              type="submit"
              className="btn btn-secondary my-2 col col-md-5"
              onClick={submitHandler}
            >
              Submit
            </button>

            <button
              type="button"
              className="btn btn-secondary  my-2 text-light col col-md-5"
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

export default TablesNew;
