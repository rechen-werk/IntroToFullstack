import { Database, OPEN_READWRITE, OPEN_CREATE } from "sqlite3";
import queries from "./dbQueries";
import fs from 'fs';
import { Calendar, CalendarRequest, RequestStatus } from "./types";

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
function queryRequests(query: string): Promise<[CalendarRequest]> { 
    return new Promise((resolve, reject) => {
        db.all(query, (error: Error, rows: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows.map((row: any) => new CalendarRequest(row.id, row.from_email, row.to_email, row.start, row.end, row.title, row.description, row.status, row.active)));
            }
        });
    });
}
async function findRequestsByFromUserId(fromUserId: string): Promise<[CalendarRequest]> { 
    return queryRequests(queries.SELECT.REQUESTS_BY_FROM_EMAIL);
}
async function findRequestsByToUserId(toUserId: string): Promise<[CalendarRequest]> {
    return queryRequests(queries.SELECT.REQUESTS_BY_TO_EMAIL);
}
async function findCalendarsByEmail(email: string): Promise<[Calendar]> {
    return new Promise((resolve, reject) => {
        db.all(queries.SELECT.CALENDAR_BY_ID, [email], (error: Error, rows: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows.map((row: any) => new Calendar(row.id, row.ics_content, row.email, row.active)));
            }
        });
    });
}

// --- INSERT ---
async function insertUser(email: string) {
    console.log(`Creating new user: ${email}!`);
    db.run(queries.INSERT.USER, email);
 }
async function insertCalendar(calendar: Calendar) {
    console.log(`Creating new calendar: ${calendar.id}, ${calendar.email}!`);
    db.run(queries.INSERT.CALENDAR, calendar.id, calendar.icsContent, calendar.email);
}
async function insertRequest(calendarRequest: CalendarRequest) {
    console.log(`Creating new request: ${calendarRequest.id}, ${calendarRequest.fromEmail}, ${calendarRequest.toEmail}!`);
    db.run(queries.INSERT.REQUEST, calendarRequest.id, calendarRequest.fromEmail, calendarRequest.toEmail, calendarRequest.start, calendarRequest.end, calendarRequest.title, calendarRequest.description);
}

// --- DELETE/ARCHIVE ---
async function deleteUser(email: string) {
    console.log(`Deleting user: ${email}!`);
    db.run(queries.DELETE.USER, email);
}
async function deleteCalendar(calendar: Calendar) {
    console.log(`Deleting calendar: ${calendar.id}!`);
    db.run(queries.DELETE.CALENDAR, calendar.id);
}
async function deleteRequest(request: CalendarRequest) {
    console.log(`Deleting request: ${request.id}!`);
    db.run(queries.DELETE.REQUEST, request.id);
}

// --- UPDATE ---
function updateRequestStatus(request: CalendarRequest, status: RequestStatus) {
    console.log(`Updating request: ${request.id} to status: ${status}!`);
    db.run(queries.UPDATE.REQUEST, status, request.id);
}
async function acceptRequest(request: CalendarRequest) {
    updateRequestStatus(request, RequestStatus.ACCEPTED);
}
async function denyRequest(request: CalendarRequest) {
    updateRequestStatus(request, RequestStatus.DENIED);
}
async function refreshCalendars() { }

export default {
    user: {
        insertUser,
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
        findCalendarsByEmail,
        insertCalendar,
        deleteCalendar,
        refreshCalendars,
    },
};
