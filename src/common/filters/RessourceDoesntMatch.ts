import { BadRequestException } from "@nestjs/common";

export class RessourceDoesntMatch extends BadRequestException {
    constructor(message:string) {
      super(message);
    }
}