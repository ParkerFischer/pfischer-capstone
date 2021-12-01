import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery.js";

import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../reservationsForm/NewReservation";
import TablesNew from "../tables/TablesNew";
import SeatTable from "../SeatTable";
import EditReservation from "../reservationsForm/EditReservation";
import Search from "../Search";
import NotFound from "./NotFound";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  // date query param and pass it as a string to Dashboard

  const query = useQuery();
  let date = query.get("date");

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>

      <Route path="/reservations/:reservation_id/seat">
        <SeatTable />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route path="/reservations/new">
        <NewReservation />
      </Route>

      <Route path="/search">
        <Search />
      </Route>

      <Route path="/dashboard">
        <Dashboard date={date || today()} />
      </Route>

      <Route path="/tables/new">
        <TablesNew />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
