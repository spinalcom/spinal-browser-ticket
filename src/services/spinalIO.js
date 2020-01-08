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

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

class SpinalIO {
  constructor() {
    this.loadPromise = {};
    this.loadedPtr = {};
    this.connectPromise = null;
    this.user = null;
    this.conn = null;
    this.serverHost = null;
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
            this.conn = window.spinalCore.connect(
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
  getModelPath() {
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

  getModel() {
    try {
      const path = this.getModelPath();
      return this.load(path);
    } catch (e) {
      return this.load('/__users__/public/digital_twin/default');
      // return this.load('/__users__/admin/Digital twin'); // TEST
    }
  }

  load(path) {
    if (typeof this.loadPromise[path] !== 'undefined') {
      return this.loadPromise[path];
    }
    const promisefunc = async (resolve, reject) => {
      try {
        await this.connect();
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
    };
    this.loadPromise[path] = new Promise(promisefunc);
    return this.loadPromise[path];
  }

  loadPtr(ptr) {
    if (ptr instanceof File) return this.loadedPtr(ptr._ptr);
    const server_id = ptr.data.value;

    if (typeof this.loadedPtr[server_id] !== 'undefined') {
      return this.loadedPtr[server_id];
    }
    const promFunc = async (resolve, reject) => {
      try {
        await this.connect();
        this.conn.load_ptr(
          server_id,
          (model) => {
            resolve(model);
          },
          () => {
            reject(new Error(`LoadedPtr Error server_id: '${server_id}'`));
          });

      } catch (e) {
        reject(e);
      }
    };
    this.loadedPtr[server_id] = new Promise(promFunc);
    return this.loadedPtr[server_id];
  }
}
export const spinalIO = new SpinalIO();
if (!window.spinal) { window.spinal = {}; }
if (!window.spinal.spinalSystem) { window.spinal.spinalSystem = spinalIO; }
