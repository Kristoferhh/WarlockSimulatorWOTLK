import { TalentTree, Talent, TalentName } from '../Types'

export interface TalentTreeStruct {
  Name: TalentTree
  Rows: Talent[][]
}

export const Talents: TalentTreeStruct[] = [
  {
    Name: TalentTree.Affliction,
    Rows: [
      [
        {
          Name: TalentName.ImprovedCurseOfAgony,
          RankIds: [18827, 18829],
          IconName: '',
        },
      ],
    ],
  },
  {
    Name: TalentTree.Demonology,
    Rows: [],
  },
  {
    Name: TalentTree.Destruction,
    Rows: [],
  },
]
