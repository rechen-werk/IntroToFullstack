export interface CalendarRequest {
    id: string;
    fromEmail: string;
    toEmail: string;
    start: Date;
    end: Date;
    title: string;
    status: Status;
}

export enum Status {
    open,
    accepted,
    denied,
}