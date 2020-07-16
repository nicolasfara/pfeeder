export class Pet {
  id: string;
  name: string;
  weight: number;
  petType: PetType;
  age: number;
  breed: string;
  currentFodder: string;
}
export enum PetType {
  Dog = 'dog',
  Cat = 'cat',
  Other = 'other',
}
