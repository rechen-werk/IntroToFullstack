export interface CalendarRequest {
    id: string;
    from_user_id: string;
    to_user_id: string;
    start: Date;
    end: Date;
    title: string;
    status: Status;
    active: boolean
}

export enum Status {
    open,
    accepted,
    denied,
}