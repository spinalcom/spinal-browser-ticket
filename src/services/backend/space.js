
import { groupService } from "spinal-env-viewer-room-manager/services/service.js";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import q from "q";

export default class Space {

    constructor() {
        this.allContext;
        
        this.initDefer = q.defer();

    }

    async init(graph) {

        console.log("debut de l'init")

        let contexts = await graph.getChildren("hasContext");

// a partir de tous les contexte, on récupère les contexte de type groupe 
        let roomsGroupContext = contexts.filter(context => {
            return context.info.type.get() === groupService.constants.ROOMS_GROUP_CONTEXT;
        })


        let categories = roomsGroupContext.map(async function (context) {
            //console.log(context);
            return {context: context, categorie: await groupService.getCategorie(context.info)}
        })

        console.log(await Promise.all(categories));
        this.allContext = await Promise.all(categories);
        


// parmis les contexte de groupe, on cherche l'ensemble des catégorie 
        // let allGroups = roomsGroupContext.map(async categorie => {
           
        //     return {
        //         groups: await groupService.getGroups(categorie.info)
        //     }
        // })


        // this.allGroups = await Promise.all(allGroups);

        this.initDefer.resolve();

    }

    async getAllContext(graph) {
        // await this.init();
        await this.initDefer.promise
        console.log("appelle de la methode getAllGroups")
        return this.allContext;
    }


    async getRoomCount(groupId) {
        let rooms = await  SpinalGraphService.getChildren(groupId, [groupService.constants.GROUP_TO_ROOMS_RELATION]);
        return rooms.length;
    }



}