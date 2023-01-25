/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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
    SpinalContext,
    SpinalGraphService,
    SpinalNode,
} from 'spinal-env-viewer-graph-service';
import * as constants from "../../constants";
import AttributeService from 'spinal-env-viewer-plugin-documentation-service';


export async function getRoomCategoryInventory(node: SpinalNode) {
    let returnObj = {
        node: node.getName().get(),
        objectType: "ROOM_AREA_INVENTORY",
        // headers: ["name", "area"],
        headers: ["name", "area", "floor", node.getName().get()],
        array: [],
        resume: {},
        resumeUnit: "m²"
    };
    let groups = await node.getChildren(constants.GROUP_RELATION_NAME);
    for (let group of groups) {
        let rooms = await group.getChildren(constants.SPACE_ROOM_RELATION);
        // returnObj.headers.push(group.getName().get());
        returnObj.resume[group.getName().get()] = [0, 0];
        for (let room of rooms) {
            let floors = await room.getParents("hasGeographicRoom");
            const floor = floors.find((flr) => flr.getType().get() == "geographicFloor");
            let attr = await AttributeService.findOneAttributeInCategory(room, "Spatial", "area");
            if (attr != -1) {
                let obj = {
                    name: room.getName().get(),
                    area: Math.floor(attr.value.get()),
                    floor: floor.getName().get()
                }
                // obj[group.getName().get()] = "x";
                obj[node.getName().get()] = group.getName().get();
                returnObj.resume[group.getName().get()][0] += 1;
                returnObj.resume[group.getName().get()][1] += Math.floor(attr.value.get());
                returnObj.array.push(obj);
            }
        }
    }
    return returnObj;
}

export async function getRoomContextInventory(node: SpinalNode) {
    let returnObj = {
        node: node.getName().get(),
        objectType: "ROOM_AREA_INVENTORY",
        // headers: ["name", "area"],
        headers: ["name", "area", "floor"],
        array: [],
        resume: {},
        resumeUnit: "m²"
    };
    let categories = await node.getChildren(constants.CATEGORY_RELATION_NAME);
    for (let category of categories) {
        returnObj.headers.push(category.getName().get());
        let groups = await category.getChildren(constants.GROUP_RELATION_NAME);
        for (let group of groups) {
            let rooms = await group.getChildren(constants.SPACE_ROOM_RELATION);
            returnObj.resume[group.getName().get()] = [0, 0];
            for (let room of rooms) {
                let floors = await room.getParents("hasGeographicRoom");
                const floor = floors.find((flr) => flr.getType().get() == "geographicFloor");
                let index = returnObj.array.findIndex(elt => elt.name == room.getName().get());
                let attr = await AttributeService.findOneAttributeInCategory(room, "Spatial", "area");
                if (index == -1) {
                    returnObj.resume[group.getName().get()][0] += 1;
                    if(attr != -1){
                        let obj = {
                            name: room.getName().get(),
                            area: Math.floor(attr.value.get()),
                            floor: floor.getName().get()
                        }
                        obj[category.getName().get()] = group.getName().get();
                        returnObj.resume[group.getName().get()][1] += Math.floor(attr.value.get());
                        returnObj.array.push(obj);
                    }
                }
                else {
                    returnObj.array[index][category.getName().get()] = group.getName().get();
                    returnObj.resume[group.getName().get()][0] += 1;
                    if(attr != -1){
                        returnObj.resume[group.getName().get()][1] += Math.floor(attr.value.get());
                    }
                }
            }
        }

    }
    return returnObj;
}