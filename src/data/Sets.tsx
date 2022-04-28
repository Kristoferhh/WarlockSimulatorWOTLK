import { ItemSet, Quality } from "../Types";

export const Sets: {
  Name: string;
  Set: ItemSet;
  Quality: Quality;
  Bonuses: number[];
}[] = [
  // T6
  {
    Name: "Malefic Raiment",
    Set: ItemSet.T6,
    Quality: Quality.Epic,
    Bonuses: [2, 4],
  },
];
