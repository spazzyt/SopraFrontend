export class Position {
}

export enum PositionEnum {

  //NEW enums, as used by backend
  Quarry=<any>"Quarry",
  Sled=<any>"Sled",
  Pyramid=<any>"Pyramid",
  Temple=<any>"Temple",
  BurialChamber=<any>"BurialChamber",
  Obelisk=<any>"Obelisk",
  Market=<any>"Market",
  DepartingHarbour=<any>"DepartingHarbour",
  PlayerCardStack=<any>"PlayerCardStack",

}

interface IPositionEnum{
  value: string;
  name: PositionEnum;
}
