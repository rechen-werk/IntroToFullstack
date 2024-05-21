const CREATE_TABLE = {
    USER: `CREATE TABLE IF NOT EXISTS user( 
        id TEXT NOT NULL, 
        name TEXT NOT NULL, 
        email TEXT NOT NULL, 
        active INTEGER, 
        PRIMARY KEY (id) 
    )`,
    CALENDAR: `CREATE TABLE IF NOT EXISTS calendar( 
        id TEXT NOT NULL, 
        icsContent TEXT NOT NULL, 
        userId TEXT NOT NULL, 
        active INTEGER, 
        PRIMARY KEY (id), 
        CONSTRAINT fk_user 
            FOREIGN KEY (userId) REFERENCES user 
            ON DELETE CASCADE 
    )`,
    REQUEST: `CREATE TABLE IF NOT EXISTS requests( 
        id TEXT NOT NULL, 
        fromUserId TEXT NOT NULL, 
        toUserId TEXT NOT NULL, 
        start TEXT NOT NULL, 
        end TEXT NOT NULL, 
        title TEXT NOT NULL, 
        description TEXT, 
        status INTEGER, 
        active INTEGER, 
        PRIMARY KEY (id), 
        CONSTRAINT fk_fromUser 
            FOREIGN KEY (fromUserId) REFERENCES user 
            ON DELETE CASCADE, 
        CONSTRAINT fk_toUser 
            FOREIGN KEY (toUserId) REFERENCES user 
            ON DELETE CASCADE 
    )`,
}

const INSERT = {
    USER: `REPLACE INTO user(id, name, email, active) VALUES (?,?,?,TRUE)`,
    CALENDAR: `REPLACE INTO calendar(id, icsContent, user_id, active) VALUES (?,?,?,TRUE)`,
    REQUEST: `REPLACE INTO 
    request(id, fromUserId, toUserId, start, end, title, description, status, active) 
    VALUES (?,?,?,?,?,?,?,?,TRUE)`,
}

const DELETE = {
    USER: `DELETE FROM user WHERE id = ?`,
    CALENDAR: `DELETE FROM calendar WHERE id = ?`,
    REQUEST: `DELETE FROM request WHERE id = ?`,
}

const UPDATE = {
    USER: `UPDATE user SET (id, name, email, active) = (?,?,?,?) WHERE id = ?`,
    REQUEST: `UPDATE calendar SET (id, icsContent, user_id, active) = (?,?,?,?) WHERE id = ?`,
    CALENDAR: `UPDATE request SET (id, fromUserId, toUserId, start, end, title, description, status, active) = (?,?,?,?,?,?,?,?,?) WHERE id = ?`,
}

const SELECT = {
    USER_BY_ID: `SELECT * FROM user WHERE id = ?`,
    CALENDAR_BY_ID: `SELECT * FROM calendar WHERE id = ?`,
    REQUEST_BY_ID: `SELECT * FROM request WHERE id = ?`,
    USERS_BY_NAME: `SELECT * FROM user WHERE name = ?`,
    REQUEST_BY_FROM_USER_ID: `SELECT * FROM request WHERE fromUserId = ?`,
    REQUEST_BY_TO_USER_ID: `SELECT * FROM request WHERE toUserId = ?`,
    CALENDAR_BY_USER_ID: `SELECT * FROM calendar WHERE userId = ?`,
}

export default {
    CREATE_TABLE,
    INSERT,
    DELETE,
    UPDATE,
    SELECT,
};
