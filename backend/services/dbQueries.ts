const CREATE_TABLE = {
    USER: `CREATE TABLE IF NOT EXISTS user(
        name TEXT NOT NULL,
        email TEXT NOT NULL, 
        active INTEGER, 
        PRIMARY KEY (email) 
    )`,
    CALENDAR: `CREATE TABLE IF NOT EXISTS calendar( 
        icsContent TEXT NOT NULL, 
        email TEXT NOT NULL, 
        active INTEGER, 
        PRIMARY KEY (email), 
        CONSTRAINT fk_user 
            FOREIGN KEY (email) REFERENCES user 
            ON DELETE CASCADE 
            ON UPDATE CASCADE
    )`,
    REQUEST: `CREATE TABLE IF NOT EXISTS request( 
        id TEXT NOT NULL, 
        fromEmail TEXT NOT NULL, 
        toEmail TEXT NOT NULL, 
        start TEXT NOT NULL, 
        end TEXT NOT NULL, 
        title TEXT NOT NULL, 
        status INTEGER, 
        active INTEGER, 
        PRIMARY KEY (id), 
        CONSTRAINT fk_fromUser 
            FOREIGN KEY (fromEmail) REFERENCES user 
            ON DELETE CASCADE
            ON UPDATE CASCADE, 
        CONSTRAINT fk_toUser 
            FOREIGN KEY (toEmail) REFERENCES user 
            ON DELETE CASCADE 
            ON UPDATE CASCADE
    )`,
}

const INSERT = {
    USER: `REPLACE INTO user(name, email, active) VALUES (?,?,TRUE)`,
    CALENDAR: `REPLACE INTO calendar(icsContent, email, active) VALUES (?,?,TRUE)`,
    REQUEST: `REPLACE INTO 
    request(id, fromEmail, toEmail, start, end, title, status, active) 
    VALUES (?,?,?,?,?,?,?,TRUE)`,
}

const DELETE = {
    USER: `DELETE FROM user WHERE email = ?`,
    CALENDAR: `DELETE FROM calendar WHERE email = ?`,
    REQUEST: `DELETE FROM request WHERE id = ?`,
}

const UPDATE = {
    USER: `UPDATE user SET email = ? WHERE email = ?`,
    USER_ACTIVE: `UPDATE user SET active = ? WHERE email = ?`,
    REQUEST_STATUS: `UPDATE request SET status = ? WHERE id = ?`,
    REQUEST_ACTIVE: `UPDATE request SET active = ? WHERE id = ?`,
    REQUEST: `UPDATE request SET (id, fromEmail, toEmail, start, end, title, status, active) = (?,?,?,?,?,?,?,?) WHERE id = ?`,
    CALENDAR: `UPDATE calendar SET (icsContent, email, active) = (?,?,?) WHERE email = ?`,
    CALENDAR_CONTENT: `UPDATE calendar SET icsContent = ? WHERE email = ?`,
    CALENDAR_ACTIVE: `UPDATE calendar SET active = ? WHERE email = ?`,
}

const SELECT = {
    USERS: `SELECT * FROM user WHERE active = TRUE`,
    USER_BY_EMAIL: `SELECT * FROM user WHERE email = ? AND active = TRUE`,
    USERS_OTHER_THAN: `SELECT * FROM user WHERE email != ? AND active = TRUE`,
    CALENDAR_BY_EMAIL: `SELECT * FROM calendar WHERE email = ? AND active = TRUE`,
    REQUEST_BY_ID: `SELECT * FROM request WHERE id = ? AND active = TRUE`,
    REQUESTS_BY_FROM_EMAIL: `SELECT * FROM request WHERE fromEmail = ? AND active = TRUE`,
    REQUESTS_BY_TO_EMAIL: `SELECT * FROM request WHERE toEmail = ? AND active = TRUE`,
}

export default {
    CREATE_TABLE,
    INSERT,
    DELETE,
    UPDATE,
    SELECT,
};
