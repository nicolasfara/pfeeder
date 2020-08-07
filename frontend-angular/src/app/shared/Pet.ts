export class Pet {
  userId: string;
  name: string;
  weight: number;
  age: number;
  petType: PetType;
  breed: string;
  rationPerDay: [
    {
      name: string;
      time: Date;
      ration: number;
    },
  ];
  currentFodder: string;
}
export enum PetType {
  Dog = 'dog',
  Cat = 'cat',
  Other = 'other',
}
