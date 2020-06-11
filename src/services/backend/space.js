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

import { ROOM_TYPE } from "spinal-env-viewer-context-geographic-service/build/constants";


import q from "q";

export default class Space {

    constructor() {
        this.allContext;

        this.initDefer = q.defer();

    }

    async init(graph) {

        // let contexts = await graph.getChildren("hasContext");


        // // a partir de tous les contexte, on récupère les contexte de type groupe 
        // let roomsGroupContext = contexts.filter(context => {
        //     return context.info.type.get() === groupService.constants.ROOMS_GROUP_CONTEXT;
        // })


        // let Icontexts = roomsGroupContext.map(async (context) => {
        //     //console.log(context);
        //     return this.Icontext(context);
        // })

        // let res = await Promise.all(Icontexts);

        const contexts = await groupManagerService.getGroupContexts(ROOM_TYPE).then(el => SpinalGraphService.getRealNode(el.id.get()));

        const Icontexts = contexts.map(el => this.Icontext(el));

        const res = await Promise.all(Icontexts)

        this.initDefer.resolve(res);

        console.log("resss", res);




        // let categories = roomsGroupContext.map(async (context) => {
        //     //console.log(context);
        //     return { context: context, categorie: await groupService.getCategorie(context.info) }
        // })


        // //console.log("eeeeeeeeeeeeeeeeeeeeeeeeeppppppppp", categories[1])

        // //console.log("tttttttttttttttttttttt", categories)

        // this.allContext = await Promise.all(categories);

        // console.log("ggggggggggggggggggg", this.allContext)



        // // parmis les contexte de groupe, on cherche l'ensemble des group 
        // let allGroups = roomsGroupContext.map(async group => {

        //     return {
        //         groups: await groupService.getGroups(group.info)
        //     }
        // })



        // this.allGroups = await Promise.all(allGroups);






        // // let allAttributes = serviceDocumentation.getAllAttributes


    }


    getData() {
        return this.initDefer.promise;
    }



    async Icontext(context) {
        let catLst = await groupService.getCategorie(context.info)
        let arr = [];
        for (let cat of catLst) {
            arr.push(this.Icategorie(cat))
        }

        return {
            name: context.info.name.get(),
            id: context.info.id.get(),
            categories: await Promise.all(arr)

        }
    }


    async Icategorie(categorie) {
        let grpLst = await groupService.getGroups(categorie);



        let arr2 = [];
        for (let grp of grpLst) {
            arr2.push(this.Igroup(grp))
        }

        return {
            name: categorie.name.get(),
            id: categorie.id.get(),
            groups: await Promise.all(arr2)
        }
    }

    async Igroup(group) {
        let roomLst = await groupService.getElementsLinked(group.id.get());
        let arr3 = [];
        for (let room of roomLst) {
            arr3.push(this.Iroom(room))
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
        }

    }

    getsurface(arr) {
        for (let attribute of arr) {
            if (attribute.label.get() === "surface") {
                return parseFloat(attribute.value.get());
            }
        }
        return 0;

    }

    async Iroom(room) {
        let realnode = SpinalGraphService.getRealNode(room.id.get());
        let attributesLst = await serviceDocumentation.getAllAttributes(realnode);
        let espace = this.getsurface(attributesLst);
        return {
            name: room.name.get(),
            id: room.id.get(),
            surface: espace,

        }
    }







    getRandomColor() {
        var letters = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }


    //     async getAllContext(graph) {
    //         await this.initDefer.promise
    //         return this.allContext;
    //     }

    //     async getAllGroups(graph) {
    //         await this.initDefer.promise
    //         return this.allGroups;
    //     }

    //     async getGroupsByCategory(categorie) {
    //         // retur les groupe, spinalcom/edf de la catégory
    //         return groupService.getGroups(categorie)

    //     }


    //     async getRoomCount(groupId) {
    //         let rooms = await SpinalGraphService.getChildren(groupId, [groupService.constants.GROUP_TO_ROOMS_RELATION]);
    //         return rooms.length;
    //     }



}
