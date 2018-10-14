export class ResponseEntity<T = any> {
  code: number;
  msg: string;
  timestamp: number;
  data: T;

  ok() {
    return this.code == 10000;
  }
}

export class BaseApi {
  constructor() {
  }
}

export class Entity {
  _id: string;
  created: number;
  updated: number;
  active: number;
}
