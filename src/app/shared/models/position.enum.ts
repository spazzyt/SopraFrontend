export class Position {
}

export enum PositionEnum {

  Quarry=<any>"Quarry",
  Sled=<any>"Sled",
  Pyramid=<any>"Pyramid",
  Temple=<any>"Temple",
  BurialChamber=<any>"BurialChamber",
  Obelisk=<any>"Obelisk",
  Market=<any>"Market",
  DepartingHarbour=<any>"DepartingHarbour",
  PlayerCardStack=<any>"PlayerCardStack",
  ShipToken=<any>"ShipToken",

}

interface IPositionEnum{
  value: string;
  name: PositionEnum;
}
