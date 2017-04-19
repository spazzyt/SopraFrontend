export class GameStatus {
}

export enum GameStatusEnum {
  PENDING=<any>"PENDING",
  STARTING=<any>"STARTING",
  RUNNING=<any>"RUNNING",
  FINISHED=<any>"FINISHED"
}

interface IGameStatusEnum{
  value: string;
  name: GameStatusEnum;
}
