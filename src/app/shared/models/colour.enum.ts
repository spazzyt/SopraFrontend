export class Colour {
}

//protocol:
//---------
//player1, bottom-left: black
//player2: top-left: white
//player3: top-right: brown
//player4: bottom-right: gray

export enum ColourEnum {
  black=<any>"black",
  white=<any>"white",
  brown=<any>"brown",
  gray=<any>"gray"
}

interface IColourEnum{
  value: string;
  name: ColourEnum;
}
