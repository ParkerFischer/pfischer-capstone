import { deleteSeated } from "./api";

//this is teh handler for the window to remove a seated reservation from a table once thier reservation is complete
export default async function handleDelete(table) {
  const abortController = new AbortController();
  let result = window.confirm(
    "Is this table ready to seat new guests? \n \n This cannot be undone."
  );
  if (result) {
    return deleteSeated(table, abortController.signal).then();
  }
}
