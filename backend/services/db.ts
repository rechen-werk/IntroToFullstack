import { Database } from "sqlite3";
import queries from "./dbQueries";

// --- TABLES ---
async function createTableUser() {}
async function createTableCalendar() {}
async function createTableRequest() {}

async function createTables() {
  await createTableUser();
  await createTableCalendar();
  await createTableRequest();
}
// --------------

// --- SEARCH ---
async function findUserById(userId) {}
async function findUsersByName(name) {}
async function findRequestsByFromUserId(fromUserId) {}
async function findRequestsByToUserId(toUserId) {}
async function findCalendarsByUserId(userId) {}

// --- INSERT ---
async function createUser() {}
async function createCalendar() {}
async function createRequest() {}

// --- DELETE/ARCHIVE ---
async function deleteUser() {}
async function deleteCalendar() {}
async function deleteRequest() {}

// --- UPDATE ---
async function acceptRequest() {}
async function denyRequest() {}
async function refreshCalendars() {}

createTables().catch((error) => {
  console.error(error);
  process.exit(1);
});

export default {
  user: {
    findUserById,
    findUsersByName,
    createUser,
    deleteUser,
  },
  request: {
    findRequestsByFromUserId,
    findRequestsByToUserId,
    createRequest,
    deleteRequest,
    acceptRequest,
    denyRequest,
  },
  calendar: {
    findCalendarsByUserId,
    createCalendar,
    deleteCalendar,
    refreshCalendars,
  },
};
