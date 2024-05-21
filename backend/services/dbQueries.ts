const CREATE_TABLE_USER = `CREATE TABLE IF NOT EXISTS user(
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    active INTEGER,
    PRIMARY KEY (id)
)`;

const CREATE_TABLE_CALENDAR = `CREATE TABLE IF NOT EXISTS calendar(
    id TEXT NOT NULL,
    icsContent TEXT NOT NULL,
    userId TEXT NOT NULL,
    active INTEGER,
    PRIMARY KEY (id),
    CONSTRAINT fk_user
        FOREIGN KEY (userId) REFERENCES user
        ON DELETE CASCADE
)`;

const CREATE_TABLE_CALENDAR_REQUEST = `CREATE TABLE IF NOT EXISTS requests(
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
)`;

const INSERT_USER = `REPLACE INTO user(id, name, email, active) VALUES (?,?,?,TRUE)`;
const INSERT_CALENDAR = `REPLACE INTO calendar(id, icsContent, user_id, active) VALUES (?,?,?,TRUE)`;
const INSERT_REQUEST = `REPLACE INTO
    request(id, fromUserId, toUserId, start, end, title, description, status, active)
    VALUES (?,?,?,?,?,?,?,?,TRUE)`;

const DELETE_USER = `DELETE FROM user WHERE id = ?`;
const DELETE_CALENDAR = `DELETE FROM calendar WHERE id = ?`;
const DELETE_REQUEST = `DELETE FROM request WHERE id = ?`;

const UPDATE_USER = `UPDATE user SET (id, name, email, active) = (?,?,?,?) WHERE id = ?`;
const UPDATE_REQUEST = `UPDATE calendar SET (id, icsContent, user_id, active) = (?,?,?,?) WHERE id = ?`;
const UPDATE_CALENDAR = `UPDATE request SET (id, fromUserId, toUserId, start, end, title, description, status, active) = (?,?,?,?,?,?,?,?,?) WHERE id = ?`;

const SELECT_USER_BY_ID = `SELECT * FROM user WHERE id = ?`;
const SELECT_CALENDAR_BY_ID = `SELECT * FROM calendar WHERE id = ?`;
const SELECT_REQUEST_BY_ID = `SELECT * FROM request WHERE id = ?`;
const SELECT_USERS_BY_NAME = `SELECT * FROM user WHERE name = ?`;
const SELECT_REQUEST_BY_FROM_USER_ID = `SELECT * FROM request WHERE fromUserId = ?`;
const SELECT_REQUEST_BY_TO_USER_ID = `SELECT * FROM request WHERE toUserId = ?`;
const SELECT_CALENDAR_BY_USER_ID = `SELECT * FROM calendar WHERE userId = ?`;

export default {
  create: {
    CREATE_TABLE_USER,
    CREATE_TABLE_CALENDAR,
    CREATE_TABLE_CALENDAR_REQUEST,
  },
  insert: {
    INSERT_USER,
    INSERT_CALENDAR,
    INSERT_REQUEST,
  },
  delete: {
    DELETE_USER,
    DELETE_CALENDAR,
    DELETE_REQUEST,
  },
  update: {
    UPDATE_USER,
    UPDATE_CALENDAR,
    UPDATE_REQUEST,
  },
  select: {
    SELECT_USER_BY_ID,
    SELECT_CALENDAR_BY_ID,
    SELECT_REQUEST_BY_ID,
    SELECT_USERS_BY_NAME,
    SELECT_REQUEST_BY_FROM_USER_ID,
    SELECT_REQUEST_BY_TO_USER_ID,
    SELECT_CALENDAR_BY_USER_ID,
  },
};
