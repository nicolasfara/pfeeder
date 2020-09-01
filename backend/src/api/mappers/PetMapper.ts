import {BaseMapper} from "./BaseMapper";
import {PetDocument, PetVm} from "../models/Pet";
import {Service} from "typedi";

@Service()
export class PetMapper implements BaseMapper<PetVm, PetDocument> {
    mapArrayDocument(document: PetDocument[]): PetVm[] {
        return document.map(this.mapper)
    }

    mapSingleDocument(document: PetDocument): PetVm {
        return this.mapper(document)
    }

    private mapper = (document: PetDocument): PetVm => {
        return {
            id: document.id,
            name: document.name,
            age: document.age,
            breed: document.breed,
            currentFodder: document.currentFodder.toHexString(),
            idealWeight: document.idealWeight,
            petType: document.petType,
            rationPerDay: document.rationPerDay,
            userId: document.userId.toHexString(),
            weight: document.weight,
        }
    }
}