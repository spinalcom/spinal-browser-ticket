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

import {
  BUILDING_REFERENCE_CONTEXT,
  BUILDING_RELATION,
  FLOOR_REFERENCE_CONTEXT,
  FLOOR_RELATION,
  ZONE_RELATION,
  ROOM_RELATION,
  ROOM_TYPE,
  GEO_RELATIONS,
  EQUIPMENT_TYPE
} from '../../constants';
import { EventBus } from '../event';
import { FileSystem } from 'spinal-core-connectorjs_type';
import ProcessOnChange from '../utlils/ProcessOnChange';

export default class BackEndSpatial {
  constructor() {
    this.floorsContext = null;
    this.handleFloorsBinded = this.handleFloors.bind(this);
    this.handleFloorRoomsBinded = this.handleFloorRooms.bind(this);
    this.floorsProcess = new ProcessOnChange(this.handleFloorsBinded, { type: 'throttle', timeout: 2000 });
    this.roomsProcess = new Map();
    this.floorSelected = null;
    this.floors = [];
  }

  async init(graph) {
    const [floorsContext, building] = await Promise.all([
      graph.getContext(FLOOR_REFERENCE_CONTEXT),
      this.getBuilding(graph)
    ]);

    this.floorsContext = floorsContext;
    this.building = building;
    this.floorsProcess.add(this.floorsContext, true);
    EventBus.$on("get-side-bar-floors-data", () => {
      if (this.floors.length === 0) this.floorsProcess.fctOnChange();
      else EventBus.$emit("side-bar-change", this.floors, this.building);
    });
    EventBus.$on("get-side-bar-rooms-data", (floorSelected) => {
      this.floorSelected = floorSelected;
      this.getRoomProcess(FileSystem._objects[floorSelected.server_id]).process.fctOnChange();
    });
  }

  async getBuilding(graph) {
    const buildingContext = await graph.getContext(BUILDING_REFERENCE_CONTEXT);
    const [buildingNode] = await buildingContext.getChildren([BUILDING_RELATION]);
    try {

      return {
        name: buildingNode.info.name.get(),
        id: buildingNode.info.id.get(),
        server_id: buildingNode._server_id
      };
    } catch (e) {
      return undefined;
    }
  }

  async handleFloors() {
    const floors = await this.floorsContext.getChildren([FLOOR_RELATION]);
    this.floors = [];
    for (const floor of floors) {
      this.floorsProcess.add(floor, false);
      // eslint-disable-next-line no-await-in-loop
      const children = await this.handleFloorRooms(floor);
      this.floors.push({
        name: floor.info.name.get(),
        id: floor.info.id.get(),
        server_id: floor._server_id,
        children
      });
    }
    // console.log('this.building', this.building);
    // if (!this.building)
    // this.building = await this.getBuilding(graph);

    EventBus.$emit("side-bar-change", this.floors, this.building);
  }

  async handleFloorRooms(floorModel) {
    let roomsProcess = this.getRoomProcess(floorModel);
    const roomsModels = await floorModel.find([ZONE_RELATION, ROOM_RELATION],
      (obj) => obj.info.type.get() === ROOM_TYPE);

    roomsProcess.process.add(floorModel, false);
    for (const room of roomsModels) {
      roomsProcess.process.add(room, false);
      this.existInSet(roomsProcess.items, 'id', {
        name: room.info.name.get(),
        id: room.info.id.get(),
        server_id: room._server_id
      });
    }
    // if (this.floorSelected && this.floorSelected.id === floorModel.info.id.get()) {
    // }
    EventBus.$emit("side-bar-room-change", roomsProcess.items, floorModel.info.id.get());
    return roomsProcess.items;
  }
  existInSet(setObj, key, objToAdd) {
    for (const obj of setObj) {
      if (obj[key] === objToAdd[key]) {
        for (const key1 in objToAdd) {
          if (objToAdd.hasOwnProperty(key1)) {
            obj[key1] = objToAdd[key1];
          }
        }
        return obj;
      }
    }
    setObj.add(objToAdd);
    return objToAdd;
  }

  getRoomProcess(floorModel) {
    const floorId = floorModel.info.id.get();
    if (this.roomsProcess.has(floorId)) {
      return this.roomsProcess.get(floorId);
    } else {
      const item = {
        items: new Set(),
        process: new ProcessOnChange(() => {
          return this.handleFloorRooms(floorModel);
        }, { type: 'throttle', timeout: 1000 })
      };
      this.roomsProcess.set(floorId, item);
      return item;
    }
  }

  /**
   * @param { {server_id: number} } item
   * @memberof BackEndSpatial
   * @returns { Promise<{model, selection: number[] }[]>}
   */
  async getLstByModel(item) {
    const node = getNodeFromItem(item);
    const listNode = await node.find(GEO_RELATIONS, (n) => {
      return (n.getType().get() === EQUIPMENT_TYPE || n.getType().get() === "BimObject")
    });
    return sortBIMObjectByModel(listNode);
  }
}

/**
 * @param { {server_id: number} } item
 * @returns
 */
function getNodeFromItem(item) {
  return FileSystem._objects[item.server_id];
}

function sortBIMObjectByModel(arrayOfBIMObject) {
  let arrayModel = [];
  for (const nodeBIMObject of arrayOfBIMObject) {
    const bimFileId = nodeBIMObject.info.bimFileId.get();
    const dbId = nodeBIMObject.info.dbid.get();
    const model = spinal.BimObjectService.getModelByBimfile(bimFileId);
    const obj = getOrAddModelIfMissing(arrayModel, model);
    obj.selection.push(dbId);
  }
  return arrayModel;
}
function getOrAddModelIfMissing(array, model) {
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
  return obj;
}
