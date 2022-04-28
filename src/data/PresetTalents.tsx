import { TalentName } from "../Types";

export const PresetTalents: {
  name: string;
  talents: { [key in keyof typeof TalentName]?: number };
}[] = [];
