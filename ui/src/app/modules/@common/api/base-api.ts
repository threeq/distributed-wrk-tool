
export class ResponseEntity {
  code: number;
  message: string;
  timestamp: number;
  data: any;
}

export class BaseApi {
  constructor(){}
  checkOK(result: ResponseEntity) {
    return result.code == 200;
  }
}
