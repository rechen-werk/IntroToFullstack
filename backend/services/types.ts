class Calendar {
    id: number;
    icsContent: string;
    email: string;
    active: boolean;

    constructor(id: number, ics_content: string, email: string, active: boolean) {
        this.id = id;
        this.icsContent = ics_content;
        this.email = email;
        this.active = active;
    }
}

class CalendarRequest { 
    id: string;
    fromEmail: string; 
    toEmail: string; 
    start: Date; 
    end: Date; 
    title: string; 
    description: string;
    status: RequestStatus;
    active: boolean;

    constructor(id: string, fromEmail: string, toEmail: string, start: Date, end: Date, title: string, description: string, status: RequestStatus, active: boolean) {
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

export { Calendar, CalendarRequest, RequestStatus };