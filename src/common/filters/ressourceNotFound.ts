import { BadRequestException } from "@nestjs/common";

export class RessouceNotFoundException extends BadRequestException {
    constructor(message:string) {
      super(message);
    }
}