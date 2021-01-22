export class Fodder {
  // tslint:disable-next-line:variable-name
  _id: object;
  name: string;
  companyName: string;
  price: number;
  weight: number;
  nutritionFacts: {
    kcal: number;
    proteins: number;
    fats: number;
    vitamins: number;
    carbohydrates: number;
  };
}
