import { Model } from "spinal-core-connectorjs_type";
export interface TicketInterface {
    id?: string;
    stepId?: string;
    processId?: string;
    name: string;
    type?: string;
    note?: string;
    equipment?: string;
    state?: string;
    creationDate?: number;
    sourceId?: string;
    images?: string[];
    urls?: string[];
    [key: string]: any;
}
export declare class SpinalTicket extends Model {
    constructor(ticket: TicketInterface);
}
