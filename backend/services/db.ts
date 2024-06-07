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
                resolve(rows.map((row: any) => new CalendarRequest(row.id, row.from_email, row.to_email, row.start, row.end, row.title, row.description, row.status, row.active)));
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
        db.all(queries.SELECT.CALENDAR_BY_EMAIL, [email], (error: Error, row: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(new Calendar(row.id, row.ics_content, row.email, row.active));
            }
        });
    });
}

async function findCalendarById(id: string): Promise<Calendar> {
    return new Promise((resolve, reject) => {
        db.get(queries.SELECT.CALENDAR_BY_ID, [id], (error: Error, row: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(new Calendar(row.id, row.ics_content, row.email, row.active));
            }
        });
    });
}


// --- INSERT ---
async function insertUser(name: string, email: string) {
    console.log(`Creating new user: ${email}!`);
    db.run(queries.INSERT.USER, name, email);
 }
async function insertCalendar(calendar: Calendar) {
    console.log(`Creating new calendar: ${calendar.id}, ${calendar.email}!`);
    db.run(queries.INSERT.CALENDAR, calendar.id, calendar.icsContent, calendar.email);
}
async function insertRequest(calendarRequest: CalendarRequest) {
    console.log(`Creating new request: ${calendarRequest.id}, ${calendarRequest.fromEmail}, ${calendarRequest.toEmail}!`);
    db.run(queries.INSERT.REQUEST, calendarRequest.id, calendarRequest.fromEmail, calendarRequest.toEmail, calendarRequest.start, calendarRequest.end, calendarRequest.title, calendarRequest.description, calendarRequest.status);
}

// --- DELETE/ARCHIVE ---
async function deleteUser(email: string) {
    console.log(`Deleting user ${email}!`);
    db.run(queries.DELETE.USER, email);
}
async function deleteCalendar(id: string) {
    console.log(`Deleting calendar ${id}!`);
    db.run(queries.UPDATE.CALENDAR_ACTIVE, false, id);
}
async function deleteRequest(id: string) {
    console.log(`Deleting request ${id}!`);
    db.run(queries.UPDATE.REQUEST_ACTIVE, false, id);
}

// --- UPDATE ---
async function updateCalendarContent(email: string, icsContent: string) {
    console.log(`Updating calendar content for user ${email}!`);
    db.run(queries.UPDATE.CALENDAR_CONTENT, icsContent, email);
}

async function updateUserEmail(oldEmail: string, newEmail: string) {
    console.log(`Updating user ${oldEmail} to email ${newEmail}!`);
    db.run(queries.UPDATE.USER, newEmail, oldEmail);
}

function updateRequestStatus(id: string, status: RequestStatus) {
    console.log(`Updating request ${id} to status ${status}!`);
    db.run(queries.UPDATE.REQUEST_STATUS, status, id);
}
async function acceptRequest(id: string) {
    updateRequestStatus(id, RequestStatus.ACCEPTED);
}
async function denyRequest(id: string) {
    updateRequestStatus(id, RequestStatus.DENIED);
}
async function refreshCalendars() { }

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
        findCalendarById,
        findCalendarByEmail,
        updateCalendarContent,
        insertCalendar,
        deleteCalendar,
        refreshCalendars,
    },
};
