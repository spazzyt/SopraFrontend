export class GameStatus {
}

export enum GameStatusEnum {
  pending=<any>"pending",
  active=<any>"active",
  round1=<any>"round1",
  round2=<any>"round2",
  round3=<any>"round3",
  round4=<any>"round4",
  round5=<any>"round5",
  round6=<any>"round6",
  terminated=<any>"terminated"
}

interface IGameStatusEnum{
  value: string;
  name: GameStatusEnum;
}
