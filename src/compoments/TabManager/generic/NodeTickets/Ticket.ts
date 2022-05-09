import 'spinal-core-connectorjs_type'
import { SpinalContext, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { spinalServiceTicket } from "spinal-service-ticket"
import { TicketInterface } from 'spinal-models-ticket/dist/SpinalTicket';
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import { 
  GEO_RELATIONS,
  GEO_BUILDING_TYPE,
  GEO_FLOOR_TYPE,
  GEO_ROOM_TYPE,
  EQUIPMENT_TYPE,
} from "../../../../constants";
import { SPINAL_TICKET_SERVICE_STEP_TYPE, SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME } from "spinal-service-ticket/dist/Constants"

const GEO_TYPES = [ GEO_FLOOR_TYPE, GEO_ROOM_TYPE, EQUIPMENT_TYPE ];

class TargetDescription {
  name: string;
  type: string;
  ispath: boolean;
  path: string;

  constructor(node: SpinalNode) {
    this.name = node.name.get();
    this.type = node.type.get();
    this.ispath = false;
    this.path = "";
  }

  async pathPrepare(node: SpinalNode) : Promise<void>
  {
      let parent = await SpinalGraphService.getParents(node.id.get(), GEO_RELATIONS);
      if (parent.some(p => p.type.get() === GEO_BUILDING_TYPE))
      {
        parent = parent?.filter(p => p.type.get() === GEO_BUILDING_TYPE);
        this.path = parent[0].name.get() + '/';
        return;
      }
      parent = parent?.filter(p => GEO_TYPES.includes(p.type.get()));
      await this.pathPrepare(parent[0]);
      this.path += parent[0].name.get() + '/';
  }

  async setPath(node: SpinalNode) : Promise<void>
  {
    let real_node = SpinalGraphService.getRealNode(node.id.get());
    let context_id = node.contextIds._attribute_names[0];
    let context = await SpinalGraphService.getRealNode(context_id);

    if (GEO_TYPES.includes(node.type.get()))
    {
      this.ispath = true;
      await this.pathPrepare(node);
    } 
    else if (!(real_node instanceof SpinalContext))
    {
      let parent = await SpinalGraphService.getParents(node.id.get(), []);
      parent = parent?.filter(async p => await SpinalGraphService.getRealNode(p.id.get()) instanceof SpinalContext || p.contextIds._attribute_names.includes(context_id));
      this.path = parent[0].name.get();
    }
    else
    {
      console.log("Empty path : node is a context.");
    }
  }
};

class TicketDescription {
  ticket: Object;
  name: string;
  creationDate: Date;
  step: string;
  events: Array<Object>;
  comments: Array<Object>;
  priority: string;
  target: TargetDescription;

  constructor(ticket, name, creationDate) {
    this.ticket = ticket;
    this.name = name;
    this.creationDate = creationDate;
  }
};

async function getTicketDescription(ticket: TicketInterface): Promise<TicketDescription> {
  let ticketDesc = new TicketDescription(
    ticket,
    ticket.name,
    ticket.creationDate,
  );

  let ticketNode = SpinalGraphService.getRealNode(ticket.id);
  ticketDesc.comments = await serviceDocumentation.getNotes(ticketNode);
  
  let stepinfo = await SpinalGraphService.getParents(ticket.id, SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME);
  stepinfo = stepinfo.filter(step => step.type.get() === SPINAL_TICKET_SERVICE_STEP_TYPE);
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
        
  let targetinfo = await SpinalGraphService.getParents(ticket.id, SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME);
  // targetinfo = ticket.getParentsInContext()
  targetinfo = targetinfo.filter(step => step.type.get() !== SPINAL_TICKET_SERVICE_STEP_TYPE);
  ticketDesc.target = new TargetDescription(targetinfo[0]);
  ticketDesc.target.setPath(targetinfo[0]);

  return ticketDesc;
}

module.exports = {
  getTicketDescription
}