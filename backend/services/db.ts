import { Database, OPEN_READWRITE, OPEN_CREATE } from "sqlite3";
import queries from "./dbQueries";
import fs from 'fs';

const DIR = './local';
const DB_NAME = 'bookYaMate.db';

if (!fs.existsSync(DIR)) {
    fs.mkdirSync(DIR);
}

let db = new Database(`${DIR}/${DB_NAME}`,
    OPEN_READWRITE | OPEN_CREATE,
    (error) => {
        if (error) {
            console.error(error);
            process.exit(1);
        }
        loadTables();
    }
);

// --- TABLES ---
function loadTables() {

    db.exec(queries.CREATE_TABLE.USER);
    db.exec(queries.CREATE_TABLE.CALENDAR);
    db.exec(queries.CREATE_TABLE.REQUEST);
    console.log('Loaded tables.');
}

// --- SEARCH ---
async function findUserById(userId: string) { }
async function findUsersByName(name: string) { }
async function findRequestsByFromUserId(fromUserId: string) { }
async function findRequestsByToUserId(toUserId: string) { }
async function findCalendarsByUserId(userId: string) { }

// --- INSERT ---
async function createUser(userId: string, name: string, email: string) {
    console.log(`Creating new user: ${userId}, ${name}, ${email}!`);
    db.run(queries.INSERT.USER, userId, name, email)
 }
async function createCalendar() { }
async function createRequest() { }

// --- DELETE/ARCHIVE ---
async function deleteUser() { }
async function deleteCalendar() { }
async function deleteRequest() { }

// --- UPDATE ---
async function acceptRequest() { }
async function denyRequest() { }
async function refreshCalendars() { }

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
