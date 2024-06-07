import { Database, OPEN_READWRITE, OPEN_CREATE } from "sqlite3";
import queries from "./dbQueries";
import fs from 'fs';
import { User, Calendar, CalendarRequest, RequestStatus } from "../utils/types";

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
    db.exec("PRAGMA foreign_keys = ON;");
    db.exec(queries.CREATE_TABLE.USER);
    db.exec(queries.CREATE_TABLE.CALENDAR);
    db.exec(queries.CREATE_TABLE.REQUEST);
    console.log('Loaded tables.');
}

// --- SEARCH ---
async function allUsers(): Promise<[]> {
    return new Promise((resolve, reject) => {
        db.all(queries.SELECT.USERS, (error: Error, rows: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows.map((row: any) => row));
            }
        });
    });
}

async function user(email: string): Promise<User> {
    return new Promise((resolve, reject) => {
        db.all(queries.SELECT.USER_BY_EMAIL, [email],(error: Error, rows: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows.map((row: any) => row));
            }
        });
    });
}

async function allUsersOtherThan(email: string): Promise<[]> {
    return new Promise((resolve, reject) => {
        db.all(queries.SELECT.USERS_OTHER_THAN, [email], (error: Error, rows: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows.map((row: any) => row));
            }
        });
    });
}

function queryRequests(query: string, email: string): Promise<[CalendarRequest]> { 
    return new Promise((resolve, reject) => {
        db.all(query, [email], (error: Error, rows: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows.map((row: any) => new CalendarRequest(row.id, row.from_email, row.to_email, row.start, row.end, row.title, row.description, row.status)));
            }
        });
    });
}
async function findRequestsByFromUserId(email: string): Promise<[CalendarRequest]> { 
    return queryRequests(queries.SELECT.REQUESTS_BY_FROM_EMAIL, email);
}
async function findRequestsByToUserId(email: string): Promise<[CalendarRequest]> {
    return queryRequests(queries.SELECT.REQUESTS_BY_TO_EMAIL, email);
}
async function findCalendarByEmail(email: string): Promise<Calendar> {
    return new Promise((resolve, reject) => {
        db.get(queries.SELECT.CALENDAR_BY_EMAIL, [email], (error: Error, row: any) => {
            if (error || !row) {
                //reject(error);
                resolve(null);
            } else {
                resolve(new Calendar(row.icsContent, row.email));
            }
        });
    });
}


// --- INSERT ---
function insertUser(name: string, email: string) {
    console.log(`Creating new user: ${email}!`);
    db.run(queries.INSERT.USER, name, email);
 }
function insertCalendar(icsContent: string, email: string) {
    console.log(`Creating new calendar: ${email}!`);
    db.run(queries.INSERT.CALENDAR, icsContent, email);
}
function insertRequest(calendarRequest: CalendarRequest) {
    // TODO read icsContent and fill out fields

    console.log(`Creating new request: ${calendarRequest.id}, ${calendarRequest.fromEmail}, ${calendarRequest.toEmail}!`);
    db.run(queries.INSERT.REQUEST, calendarRequest.id, calendarRequest.fromEmail, calendarRequest.toEmail, calendarRequest.start, calendarRequest.end, calendarRequest.title, calendarRequest.description, calendarRequest.status);
}

// --- DELETE/ARCHIVE ---
function deleteUser(email: string) {
    console.log(`Deleting user ${email}!`);
    db.run(queries.DELETE.USER, email);
}
function deleteCalendar(email: string) {
    console.log(`Deleting calendar ${email}!`);
    db.run(queries.UPDATE.CALENDAR_ACTIVE, false, email);
}
function deleteRequest(id: string) {
    console.log(`Deleting request ${id}!`);
    db.run(queries.UPDATE.REQUEST_ACTIVE, false, id);
}

// --- UPDATE ---
function updateCalendarContent(email: string, icsContent: string) {
    console.log(`Updating calendar content for user ${email}!`);
    db.run(queries.UPDATE.CALENDAR_CONTENT, icsContent, email);
}

function updateUserEmail(oldEmail: string, newEmail: string) {
    console.log(`Updating user ${oldEmail} to email ${newEmail}!`);
    db.run(queries.UPDATE.USER, newEmail, oldEmail);
}

function updateRequestStatus(id: string, status: RequestStatus) {
    console.log(`Updating request ${id} to status ${status}!`);
    db.run(queries.UPDATE.REQUEST_STATUS, status, id);
}
function acceptRequest(id: string) {
    updateRequestStatus(id, RequestStatus.ACCEPTED);

    db.get(queries.SELECT.REQUEST_BY_ID, id, (error: Error, request: CalendarRequest) => {
        if (!error) {
            // TODO: build VEvent
            updateCalendarContent(request.toEmail, request.icsContent);
            // TODO alert accepted!
        } else {
            console.log(error);
        }
    });

}
function denyRequest(id: string) {
    updateRequestStatus(id, RequestStatus.DENIED);
    // TODO alert rejected!
}
function refreshCalendars() { }

export default {
    user: {
        allUsers,
        user,
        allUsersOtherThan,
        insertUser,
        updateUserEmail,
        deleteUser,
    },
    request: {
        findRequestsByFromUserId,
        findRequestsByToUserId,
        insertRequest,
        deleteRequest,
        acceptRequest,
        denyRequest,
    },
    calendar: {
        findCalendarByEmail,
        updateCalendarContent,
        insertCalendar,
        deleteCalendar,
        refreshCalendars,
    },
};
