export class Fodder {
  id: string;
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
