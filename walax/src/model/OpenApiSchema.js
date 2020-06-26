import ModelBase from './ModelBase';
import w from '../Walax';
import { observable } from 'mobx';
import { WalaxSchema } from './WalaxSchema';
export class OpenApiSchema extends WalaxSchema {
  constructor(uri = false) {
    super();
    this._init();
    this.uri = uri;
  }

  _init() {
    this.uri = false;
    this.schema = false;
    this._ops = null;
    this._models = null;
    this._modelNames = null;
    this._managers = null;
  }

  get uri() { return this._uri; }
  set uri(uri) {
    w.net.get(uri).then(data => {
      this._init();
      this._uri = uri;
      this.schema = data;
      // may as well initialize these
      this.ops && this.modelNames && this.models;
    });
  }

  get modelNames() {
    if (!this._modelNames) {
      let mappings = new Map();
      let names = new Set(Object
        .values(this.ops)
        .map(v => v?.op[1]));
      names.forEach(x => {
        // check for plurals
        ['s', 'es'].forEach(y => {
          names.delete(x + y) && mappings.set(x + y, x);
        });
      });
      w.log.info('parsed model names', names, mappings);
      this._modelMap = mappings;
      this._modelNames = names;
    }
    return this._modelNames;
  }

  get modelMap() {
    return this.modelNames && this._modelMap;
  }

  get models() {
    if (!this._models && this.modelNames && this.ops) {
      this._models = observable.map();
      this._modelNames.forEach(model => {
        class WalaxProxyModel extends ModelBase {
          static _wlx_model = model;
        }
        // todo add properties URGENT
        this._models[model] = WalaxProxyModel;

      });
      w.log.info('regenerating model classes', this._models);
    }
    return this._models;
  }

  get ops() {
    if (!this._ops && this.schema?.paths) {
      this._ops = observable.map();
      Object.entries(this.schema.paths).map(p => Object.entries(methods).map(m => {
        let opId = m[1].operationId;
        console.log(opId);
        this._ops[opId] = {
          path: p[0],
          method: m[0],
          detail: m[1],
          op: opId
            .match(/[A-Z]?[a-z]+/g)
            .map(s => s.toLowerCase())
        };
      }));
      w.log.info('built operations map', this._ops);
    }
    return this._ops;
  }
}
