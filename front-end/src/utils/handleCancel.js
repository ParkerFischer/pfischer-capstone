import { updateReservationStatus } from "./api";

//this is the function for the confirmation window when you are trying to cancel a reservation.
export default async function handleCancel(reservation_id) {
  const abortController = new AbortController();
  let result = window.confirm(
    "Do you want to cancel this reservation? \n \n This cannot be undone."
  );
  if (result) {
    return updateReservationStatus(
      reservation_id,
      "cancelled",
      abortController.signal
    ).then();
  }
}
