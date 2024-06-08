class User {
    name: string;
    email: string;

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }
}
class Calendar {
    icsContent: string;
    email: string;

    constructor(icsContent: string, email: string) {
        this.icsContent = icsContent;
        this.email = email;
    }
}

class CalendarRequest { 
    id: string;
    fromEmail: string; 
    toEmail: string; 
    start: string; 
    end: string; 
    title: string;
    status: RequestStatus;

    constructor(id: string, fromEmail: string, toEmail: string, start: string, end: string, title: string, status: RequestStatus) {
        this.id = id;
        this.fromEmail = fromEmail;
        this.toEmail = toEmail;
        this.start = start;
        this.end = end;
        this.title = title;
        this.status = status;
    }
}

enum RequestStatus {
    OPEN,
    ACCEPTED,
    DENIED,
}

export { User, Calendar, CalendarRequest, RequestStatus };