class User {
    name: string;
    email: string;

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }
}
class Calendar {
    id: string;
    icsContent: string;
    email: string;
    active: boolean;

    constructor(id: string, icsContent: string, email: string, active: boolean) {
        this.id = id;
        this.icsContent = icsContent;
        this.email = email;
        this.active = active;
    }
}

class CalendarRequest { 
    id: string;
    fromEmail: string; 
    toEmail: string; 
    start: string; 
    end: string; 
    title: string; 
    description: string;
    status: RequestStatus;
    active: boolean;

    constructor(id: string, fromEmail: string, toEmail: string, start: string, end: string, title: string, description: string, status: RequestStatus, active: boolean) {
        this.id = id;
        this.fromEmail = fromEmail;
        this.toEmail = toEmail;
        this.start = start;
        this.end = end;
        this.title = title;
        this.description = description;
        this.status = status;
        this.active = active;
    }
}

enum RequestStatus {
    OPEN,
    ACCEPTED,
    DENIED,
}

export { User, Calendar, CalendarRequest, RequestStatus };