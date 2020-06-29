/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

// import {
//   TICKET_CONTEXT_NAME,
//   TICKET_RELATION_CONTEXT_PROCESS,
//   TICKET_PROCESS_TYPE,
//   TICKET_RELATION_PROCESS_STEP,
//   TICKET_STEP_TYPE,
//   TICKET_RELATION_STEP_TICKET,
//   TICKET_TICKET_TYPE,
//   TICKET_RELATION_PROCESS_OBJET,
//   TICKET_OBJECT_TYPE
// } from '../../constants';
// import { FileSystem } from 'spinal-core-connectorjs_type';

// export default class BackEndTicket {
//   constructor() {
//     this.info = {
//       contextStructure: [],
//       allTickets: []
//     };
//   }

//   async getProcess() {
//     const processes = await this.ticketContext.getChildren([TICKET_RELATION_CONTEXT_PROCESS]);
//     const prom = [];
//     for (const processNode of processes) {
//       let exist = this.info.contextStructure.find((e) => e.id === processNode.info.id.get());
//       if (exist) {
//         exist.name = processNode.info.name.get();
//       } else {
//         exist = {
//           name: processNode.info.name.get(),
//           id: processNode.info.id.get(),
//           server_id: processNode._server_id,
//           nbrTickets: 0
//         };
//         this.info.contextStructure.push(exist);

//       }
//       prom.push(this.getSteps(exist));
//     }
//     return Promise.all(prom);
//   }

//   async getSteps(processObj) {
//     const processNode = FileSystem._objects[processObj.server_id];

//   }

//   async init(graph) {
//     this.ticketContext = await graph.getContext(TICKET_CONTEXT_NAME);






//   }
// }
