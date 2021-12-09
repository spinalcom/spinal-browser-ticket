import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import {
  EQUIPMENT_TYPE,
  TICKET_TICKET_TYPE,
} from '../../constants';

/**
 * Script to setup viewer & ticket interaction
 */

// untyped window to use 'BimObjectService' without error
const anyWin : any = window;

/**
 * Script to setup viewer & ticket interaction
 *
 * @param ticketContext Context Node to run the script on
 */
export default async function addObjectToTicket(ticketContext: spinal.Model)
{
  console.debug("root :", ticketContext);
  const relations = [..."SpinalSystemServiceTicketHasTicket"];
  // Get tickets in the graph from the given node and below
  const listTicket : spinal.Model[] = await ticketContext.find(relations, (n) =>
  {
    if (
      n.getType().get() === TICKET_TICKET_TYPE
      || n.getType().get() === "SpinalSystemServiceTicketTypeTicket"
    ) {
      // When a ticket is found, add it to the spinalgraphservice
      // so it can be found later using getRealnode
      SpinalGraphService._addNode(n);
      return true;
    }
    return false
  });

  for (const ticket of listTicket)
  {
    // get the parents of the tickets then find the bimobject connected to the ticket
    const parents = await ticket.getParents("SpinalSystemServiceTicketHasTicket");
    const bimParent = parents.find( p => {
      return p.getType().get() !== "SpinalSystemServiceTicketTypeStep"
    });
    console.debug("bim parent :", bimParent)
    if (typeof bimParent === "undefined")
    {
      // skip tickets with no connection to non step node
      continue;
    }

    // get all the bimobjects from the tickets' parents
    const objects: spinal.Model[] = await bimParent.find(relations, (n) =>
    {
      if (
        n.getType().get() === EQUIPMENT_TYPE
        || n.getType().get() === "BimObject"
      ) {
        SpinalGraphService._addNode(n);
        return true;
      }
      return false
    });
    let bimIds = []
    for (const object of objects) {
      bimIds.push(object.info.bimFileId.get());
    }


  //   // turn node of the bim objects into viewer compatible objects
  //   const bimObjects = []
  //   for (const object of objects) {
  //     const bimFileId = object.info.bimFileId.get();
  //     const dbId = object.info.dbid.get();
  //     const model = anyWin.spinal.BimObjectService.getModelByBimfile(bimFileId);
  //     if (model) {
  //       const obj = getOrAddModelIfMissing(bimObjects, model);
  //       obj.selection.push(dbId);
  //     }
  //   }

    // add the objects as an attribute of the ticket
    console.debug("before :", ticket)
    if (bimIds.length > 0)
    {
      if (typeof ticket.objects !== "undefined")
      {
        console.debug("mod :", ticket.objects, bimIds)
        ticket.mod_attr("objects", bimIds)
      }
      else
      {
        console.debug("add :", bimIds)
        ticket.add_attr("objects", bimIds);
      }
      console.debug("after :", ticket)
    }
  }
  console.debug("ticket list :", listTicket);
}

function getOrAddModelIfMissing(array, model): { selection: number[], model } {
  for (const obj of array) {
    if (obj.model === model) {
      return obj;
    }
  }
  const obj = {
    selection: [],
    model
  };
  array.push(obj);
  console.debug("model added", array)
  return obj;
}