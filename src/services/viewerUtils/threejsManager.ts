/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
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

const asset2 = require("../../assets/sprites/icon.svg");
const asset = require("../../assets/sprites/circle.svg");
const asset3 = require("../../assets/sprites/fan_coil.svg");
const asset4 = require("../../assets/sprites/icon.png");
const assetText = require("../../assets/sprites/textv2.svg");
const thermo = require("../../assets/thermo2.jpg")

import { Sprite } from "three";
import { SVGLoader } from "./SVGLoader"
import { SpinalGraphService  } from "spinal-env-viewer-graph-service";
// import THREE from "three"
// import { SVGLoader } from 
// JSONLoader Loader 
import { CSS2DRenderer, CSS2DObject } from './CSS2DRenderer';

import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';


import { EventBus } from "../../services/event";


export async function createSprite(position: { x: null, y: null, z: null }, data){
    let viewer = window.spinal.SpinalForgeViewer.viewerManager.viewer;
    // let border = "2px solid #14202C";
    await viewer.loadExtension('Autodesk.Edit3D');
    const label = new Autodesk.Edit3D.Label3D(viewer, position, data.text);
    let img = document.createElement("img");
    img.src = thermo;
    
    ////////////////////////// STYLES /////////////////////
    // label.container.childNodes[0].style.border = "2px solid #14202C";
    label.container.childNodes[0].style.borderStyle= "solid";
    label.container.childNodes[0].style.borderWidth= "3px";
    label.container.childNodes[0].style.borderColor= data.color;

    label.container.childNodes[0].style.backgroundColor = "#f9f9f9";
    label.container.childNodes[0].style.borderRadius = "100px";
    label.container.childNodes[0].style.color = "#14202C";
    label.container.childNodes[0].style.marginLeft = "-15px";
    label.container.childNodes[0].style.paddingLeft = "15px";
    label.container.childNodes[0].style.paddingRight = "5px";
    label.container.childNodes[0].style.marginRight = "0px";
    label.container.childNodes[0].style["z-index"] = 1;

    label.container.style.display = "flex";
    label.container.style.pointerEvents = 'auto';
    // label.container.style.backgroundColor = '#14202c';
    label.container.style.background = 'none';
    label.container.style.alignItems = 'center';
    label.container.style.height = 'fit-content';
    label.container.style.padding = '0px';
    label.container.style.color = 'transparent';
    label.container.style["box-shadow"] = 'none';

    img.style.height = "30px";
    img.style.width = "30px";
    // img.style.border = "2px solid #14202C";
    img.style.borderStyle= "solid";
    img.style.borderWidth= "3px";
    img.style.borderColor= data.color;

    img.style["z-index"] = 2;
    img.style["-moz-border-radius"] = "75px";
    img.style["-webkit-border-radius"] = "75px";
    img.style["border-radius"] = "75px";
    img.style["margin-left"] = "5px;"
    // = {
    //   "-moz-border-radius" : "75px",
    //   "-webkit-border-radius" : "75px",
    //   "border-radius" : "75px";
    // }
    // label.container.appendChild(img);

    

    label.container.insertBefore(img, label.container.childNodes[0]);

    EventBus.$on("sprite-clicked", (res) => {
      if(data.node == res){
        // label.container.style.border = "2px solid #00A2FF";
        // label.container.style.boxShadow = "0px 0px 20px 6px #14202c";
        // img.style.border = "2px solid #00A2FF";

        label.container.childNodes[0].style.border = "3px solid #00A2FF";
        label.container.childNodes[1].style.border = "3px solid #00A2FF";
        // label.container.childNodes[0].style.boxShadow = "-15px 0px 15px 3px #14202c";
        label.container.childNodes[1].style.boxShadow = "0px 0px 15px 3px #00A2FF";
        
      }
      else{
        label.container.childNodes[0].style.borderColor= data.color;
        label.container.childNodes[1].style.borderColor= data.color;

        // label.container.childNodes[0].style.border = "2px solid #14202C";
        // label.container.childNodes[1].style.border = "2px solid #14202C";


        // label.container.childNodes[0].style.boxShadow = "";
        label.container.childNodes[1].style.boxShadow = "";
        // border = "2px solid #14202C";
        // label.container.style.border = "";
        // label.container.style.boxShadow = "";
      }
    });
    EventBus.$on("remove-sprites", ()=>{
      label.dtor();
      return true;
    });
    EventBus.$on("update-sprite", res => {
      if(res.node == data.node){
        label.textDiv.textContent = res.text;
        label.container.childNodes[0].style.borderColor= res.color;
        label.container.childNodes[1].style.borderColor= res.color;
      }
    })
    label.container.addEventListener('click', async (res) => {
      EventBus.$emit("sprite-clicked", data.node);
      viewer.clearSelection()
      // res.stopPropagation();

      });
}