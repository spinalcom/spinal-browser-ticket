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
  File,
  spinalCore,
  FileSystem
} from 'spinal-core-connectorjs_type';

import {
  decriAes,
  decriB64
} from './utlils/crypt';
let $ = require("jquery");
import axios from "axios";
import Q from "q";

function getParameterByName(name: string, url: string = window.location.href) {
  name = name.replace(/[[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

class SpinalIO {
  loadPromise: Map<string, Promise<spinal.Model>>;
  loadedPtr: Map<number, Promise<spinal.Model>>;
  connectPromise: Promise<void>;
  user: { username: string, password: string }
  conn: spinal.FileSystem;

  constructor() {
    this.loadPromise = new Map();
    this.loadedPtr = new Map();
    this.connectPromise = null;
    this.user = null;
    this.conn = null;
  }
  decriJson(encryptedHex) {
    try {
      const k = [10, 95, 124, 68, 55, 24, 90, 57, 34, 65, 81, 22, 75, 7, 110,
        1
      ];
      const str = decriAes(k, encryptedHex);
      return JSON.parse(str);
    } catch (e) {
      const str = decriB64(encryptedHex);
      try {
        return JSON.parse(str);
      } catch (e) {
        return '';
      }
    }
  }
  getauth() {
    if (this.user !== null) return this.user;
    const encryptedHex = window.localStorage.getItem('spinalhome_cfg');
    this.user = this.decriJson(encryptedHex);
    return this.user;
  }
  connect() {
    if (this.connectPromise !== null) {
      return this.connectPromise;
    }

    this.connectPromise = new Promise((resolve, reject) => {
      $(document).ready(() => {
        FileSystem.CONNECTOR_TYPE = "Browser";
        const user = this.getauth();
        if (this.user.username) {
          const serverHost = window.location.origin;
          // this.getServerConfig().then( => {
          return axios.get(`${serverHost}/get_user_id`, {
            params: {
              u: user.username,
              p: user.password
            }
          }).then(response => {
            let id = parseInt(response.data);
            const host = serverHost.replace(/https?:\/\//, "");
            this.conn = spinalCore.connect(
              `http://${id}:${user.password}@${host}/`
            );
            resolve();
          }, () => {
            // window.location = "/html/drive/";
            reject('Authentication Connection Error');
          });
          // });
        } else {
          // window.location = '/html/drive/';
          reject('Authentication Connection Error');
        }
      });
    });
    return this.connectPromise;
  }
  getModelPath(): string {
    const cryptedPath = getParameterByName('path');
    if (!cryptedPath) throw new Error('No "path" attribute found in the url');
    const k = [10, 95, 124, 68, 55, 24, 90, 57, 34, 65, 81, 22, 75, 7, 110,
      1
    ];
    try {
      const decripted = decriAes(k, cryptedPath);
      if (decripted[0] !== '/') throw "not a path";
      return decripted;
    } catch (e) {
      const decripted = decriB64(cryptedPath);
      return decripted;
    }
  }

  getModel(): Promise<spinal.Model> {
    try {
      const path = this.getModelPath();
      return this.load(path);
    } catch (e) {
      return this.load('/__users__/public/digital_twin/default');
    }
  }

  async load(path: string): Promise<spinal.Model> {
    await this.connect();
    if (this.loadPromise.has(path)) {
      return this.loadPromise.get(path);
    }

    const prom: Promise<spinal.Model> = new Promise((resolve, reject) => {
      try {
        spinalCore.load(
          this.conn, path,
          (model) => {
            resolve(model);
          },
          () => {
            reject(new Error(`Load Error path: '${path}'`));
          });
      } catch (e) {
        reject(e);
      }
    });
    this.loadPromise.set(path, prom)
    return prom;
  }

  async loadPtr(ptr: spinal.Ptr<any> | spinal.Pbr<any>): Promise<spinal.Model> {
    if (ptr instanceof File) return this.loadPtr(ptr._ptr);
    await this.connect();
    const server_id: number = ptr.data.value;
    if (this.loadedPtr.has(server_id)) {
      return this.loadedPtr.get(server_id)
    }
    const prom: Promise<spinal.Model> = new Promise((resolve, reject) => {
      try {
        this.conn.load_ptr(
          server_id,
          (model) => {
            if (!model)
              reject(new Error(`LoadedPtr Error server_id: '${server_id}'`));
            else resolve(model);
          });

      } catch (e) {
        reject(e);
      }
    });
    this.loadedPtr.set(server_id, prom)
    return prom;
  }

  waitNodeReady(node: any) : Promise<void>
  {
    return new Promise(resolve => {
      const aibe = setInterval(() => {
        if (typeof(FileSystem._objects[node._server_id]) !== "undefined")
        {
          clearInterval(aibe);
          return resolve();
        }
      }, 500)
    })
  }
}
export const spinalIO = new SpinalIO();
var anyWin: any = window;
if (!anyWin.spinal) { anyWin.spinal = {}; }
if (!anyWin.spinal.spinalSystem) { anyWin.spinal.spinalSystem = spinalIO; }
