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


// import { groupService } from "spinal-env-viewer-room-manager/services/service.js";

import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";

import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import { FileSystem } from 'spinal-core-connectorjs_type';
// import { ROOM_TYPE } from "spinal-env-viewer-context-geographic-service/build/constants";

import { spinalControlPointService } from "spinal-env-viewer-plugin-control-endpoint-service";
import tinygradient from "tinygradient";
import { REFERENCE_OBJECT_RELATION_NAME, BIM_OBJECT_TYPE } from 'spinal-env-viewer-plugin-forge/dist/Constants'
// import { SpinalForgeViewer } from 'spinal-env-viewer-plugin-forge'

import q from "q";


// const spinalForgeViewer = new SpinalForgeViewer();

export default class Heatmap {

  constructor() {
    this.allContext;

    this.initDefer = q.defer();

  }

  async init(graph) {


    //"SpinalControlPointGroupContext"
    //ROOM_TYPE
    await SpinalGraphService.waitForInitialization();
    let contextNodes = await graph.getChildren("hasContext");
    const cons = await groupManagerService.getGroupContexts("SpinalControlPointGroupContext");
    const contexts = contextNodes.filter(context => {
      for (const con of cons) {
        let id = typeof con.id === "string" ? con.id : con.id.get();
        if (context.info.id.get() === id) return true;
      }
      return false;

    });

    const Icontexts = contexts.map(el => this.Icontext(el));
    const res = await Promise.all(Icontexts);
    this.initDefer.resolve(res);


  }


  getData() {
    return this.initDefer.promise;
  }

  async getDataFilterItem(item) {
    const data = await this.initDefer.promise;
    if (!item) return data;
    const itemNode = FileSystem._objects[item.server_id];
    if (itemNode.getType().get() !== "geographicFloor") {
      return data;
    }

    const idsAGarder = item.children.map(obj => obj.id);
    const tmp = [];
    for (const d of data) {
      const cats = [];
      for (const cat of d.categories) {
        const groups = [];
        for (const grp of cat.groups) {
          const profils = [];
          for (const r of grp.profils) {
            if (idsAGarder.includes(r.id)) profils.push(r);
          }
          groups.push({
            profils,
            id: grp.id,
            name: grp.name,
            color: grp.color
          });
        }
        cats.push({
          groups,
          id: cat.id,
          name: cat.name
        });
      }
      tmp.push({
        categories: cats,
        id: d.id,
        name: d.name
      });
    }

    return tmp;
  }

  async Icontext(context) {
    let catLst = await groupManagerService.getCategories(context.info.id.get());
    const contextId = context.info.id.get();
    let arr = [];
    for (let cat of catLst) {
      arr.push(this.Icategorie(cat, contextId));
    }

    return {
      name: context.info.name.get(),
      id: context.info.id.get(),
      categories: await Promise.all(arr)
    };
  }

  async Icategorie(categorie, contextId) {
    let grpLst = await groupManagerService.getGroups(categorie.id.get());
    let arr2 = [];
    for (let grp of grpLst) {
      arr2.push(this.Igroup(grp, contextId));
    }
    return {
      name: categorie.name.get(),
      id: categorie.id.get(),
      groups: await Promise.all(arr2)
    };
  }

  async Igroup(group, contextId) {
    let profilLst = await groupManagerService.getElementsLinkedToGroup(group.id.get());
    let arr3 = [];
    for (let profil of profilLst) {
      arr3.push(this.Iprofil(profil, contextId));
    }

    if (typeof group.color === "undefined") {
      const color = this.getRandomColor();
      group.add_attr("color", color);
    }

    return {
      name: group.name.get(),
      id: group.id.get(),
      color: group.color.get(),
      rooms: await Promise.all(arr3)
    };
  }

  getsurface(arr) {
    for (let attribute of arr) {
      if (attribute.label.get() === "surface" || attribute.label.get() === "area") {
        return parseFloat(attribute.value.get());
      }
    }
    return 0;


  }

  async Iprofil(profil, contextId) {
    let realnode = SpinalGraphService.getRealNode(profil.id.get());
    let attributesLst = await serviceDocumentation.getAllAttributes(realnode);
    let espace = this.getsurface(attributesLst);
    let itemLinked = await this.getElementLinkedToProfil(profil);
    let endpointsProfils = await this.getEndpointsProfil(contextId, profil);

    return {
      name: profil.name.get(),
      id: profil.id.get(),
      surface: espace,
      rooms: itemLinked,
      endpointsProfils: endpointsProfils
    };
  }

  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getElementLinkedToProfil(profil) {
    const id = profil.id.get();
    return spinalControlPointService.loadElementLinked(id).then((result) => {
      const promises = []

      for (let i = 0; i < result.length; i++) {
        SpinalGraphService._addNode(result[i])
        const groupId = result[i].getId().get()
        promises.push(spinalControlPointService.getDataFormated(groupId))
      }

      return Promise.all(promises).then((result) => {
        const profilFound = result.flat().find(el => el.id === id);

        if (!profilFound) return [];

        const prom = profilFound.rooms.map(async room => {
          room.references = await this._getRoomReferences(room.id);
          return room
        });

        return Promise.all(prom).then((references) => {
          return references.flat();
        })
      })
    })
  }

  getEndpointsProfil(contextId, profil) {
    const id = profil.id.get();
    return spinalControlPointService.getControlPointProfil(contextId, id).then((result) => {

      const res = []
      for (let i = 0; i < result.endpoints.length; i++) {
        res.push(result.endpoints[i].get())
      }

      return res;
    })
  }


  ///////////////////////////////////////////////////////////
  //                surface  utilities                     //
  ///////////////////////////////////////////////////////////


  getContextSurface(contextObject) {
    let surface = 0;
    for (const category of contextObject.categories) {
      surface += this.getCategoriesSurface(category);
    }

    return surface;
  }

  getCategoriesSurface(categoryObject) {
    let surface = 0;

    for (const group of categoryObject.groups) {
      surface += this.getGroupSurface(group);
    }

    return surface;
  }

  getGroupSurface(groupObject) {
    let surface = 0;
    for (const room of groupObject.rooms) {
      surface += this.getRoomSurface(room);
    }
    return surface;
  }

  getRoomSurface(roomObject) {
    return roomObject.surface ? roomObject.surface : 0;
  }


  ///////////////////////////////////////////////////////////
  //                Rooms Count  utilities                 //
  ///////////////////////////////////////////////////////////

  getContextRoomCount(contextObject) {
    let roomCount = 0;
    for (const category of contextObject.categories) {
      roomCount += this.getCategoriesRoomCount(category);
    }

    return roomCount;
  }

  getCategoriesRoomCount(categoryObject) {
    let roomCount = 0;

    for (const group of categoryObject.groups) {
      roomCount += this.getGroupRoomCount(group);
    }

    return roomCount;
  }

  getGroupRoomCount(groupObject) {
    return groupObject.rooms.length;
  }




  ///////////////////////////////////////////////////////////////////////////
  ////                      HEATMAP UTILITIES                      ////
  ///////////////////////////////////////////////////////////////////////////

  getGradientColor(min, average, max) {
    let colorLength = average ? 10 : 2;
    let colors = average ? [min.color, average.color, max.color] : [min.color, max.color];

    let gradient = tinygradient(colors);

    return gradient.rgb(colorLength);
  }

  getColor(value, minValue, maxValue, gradientColor) {
    if (typeof minValue === "boolean" && typeof maxValue === "boolean")
      return value ? gradientColor[1].toHex() : gradientColor[0].toHex();

    if (!isNaN(value)) {
      let index = Math.floor(((value - minValue) * 10) / (maxValue - minValue));

      if (index < 0) {
        index = 0;
      } else if (index >= gradientColor.length) {
        index = gradientColor.length - 1;
      }

      return gradientColor[index].toHex();
    }
    return undefined;

  }

  getEnumGradientColor(liste) {
    return liste.map(el => ({ value: el.name, color: el.color }));
  }

  getEnumColor(value, liste) {
    const found = liste.find(el => el.name === value);
    if (found) return found.color;
  }

  _convertHexToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
      : null;
  }

  convertColorToVector(argColor) {

    let color = "";
    if (argColor) {
      color = argColor[0] === "#" ? argColor : `#${argColor}`;
    }

    if (color.trim().length == 0) return new THREE.Vector4(1, 0, 0, 0);

    const rgbColor = this._convertHexToRGB(color);

    return rgbColor
      ? new THREE.Vector4(
        rgbColor.r / 255,
        rgbColor.g / 255,
        rgbColor.b / 255,
        0.7
      )
      : new THREE.Vector4(1, 0, 0, 0);
  }

  async _getRoomReferences(roomId) {
    const info = SpinalGraphService.getInfo(roomId);
    let references = []

    if (info && info.type.get() === BIM_OBJECT_TYPE) {
      references = [info];
    } else {
      references = await SpinalGraphService.getChildren(roomId, [REFERENCE_OBJECT_RELATION_NAME]);
    }


    const bims = references.map(el => el.get());

    const bimMap = new Map();

    for (const bimObject of bims) {
      const bimFileId = bimObject.bimFileId;
      const dbid = bimObject.dbid;

      if (typeof bimMap.get(bimFileId) === "undefined") {
        bimMap.set(bimFileId, new Set());
      }

      bimMap.get(bimFileId).add(dbid);
    }

    const res = []

    for (const [key, value] of bimMap.entries()) {
      res.push({
        model: window.spinal.BimObjectService
          .getModelByBimfile(key),
        ids: Array.from(value)
      })
    }

    return res;
  }

}
