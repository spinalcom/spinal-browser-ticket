import 'spinal-core-connectorjs_type'
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { spinalServiceTicket } from "spinal-service-ticket"
import { TicketInterface } from 'spinal-models-ticket/dist/SpinalTicket';
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import { SPINAL_TICKET_SERVICE_STEP_TYPE, SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME } from "spinal-service-ticket/dist/Constants"

class TicketDescription {
  ticket: Object;
  name: string;
  creationDate: Date;
  step: string;
  events: Array<Object>;
  comments: Array<Object>;
  priority: string;

  constructor(ticket, name, creationDate) {
    this.ticket = ticket;
    this.name = name;
    this.creationDate = creationDate;
    this.step = "";
    this.events = [];
    this.comments = [];
    this.priority = "";
  }
};

async function getTicketDescription(ticket: TicketInterface): Promise<TicketDescription> {
  console.debug("ticket",ticket)
  let ticketDesc = new TicketDescription(
    ticket,
    ticket.name,
    ticket.creationDate,
  );

  let ticketNode = SpinalGraphService.getRealNode(ticket.id);
  ticketDesc.comments = await serviceDocumentation.getNotes(ticketNode);
  console.debug("real ticket", ticketNode);
  let stepinfo = await SpinalGraphService.getParents(ticket.id, SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME);
  stepinfo = stepinfo.filter(step => step.type.get() === SPINAL_TICKET_SERVICE_STEP_TYPE);
  console.debug("step : ", stepinfo, ticket.stepId)
  ticketDesc.step = stepinfo[0].name.get();

  ticketDesc.events = await spinalServiceTicket.getLogs(ticket.id);

  let priority = ticket.priority;
  switch(priority)
  {
    case 0:
      ticketDesc.priority = 'spinal-twin.TicketPriority.Occasion'
      break;
    case 1:
      ticketDesc.priority = 'spinal-twin.TicketPriority.Normal'
      break;
    case 2:
      ticketDesc.priority = 'spinal-twin.TicketPriority.Urgent'
      break;
  }

  return ticketDesc;
}

module.exports = {
  getTicketDescription
}