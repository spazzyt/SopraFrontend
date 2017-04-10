export class Colour {
}

//protocol:
//---------
//player1, bottom-left: brown
//player2: top-left: white
//player3: top-right: gray
//player4: bottom-right: black

export enum ColourEnum {
  brown=<any>"brown",
  white=<any>"white",
  gray=<any>"gray",
  black=<any>"black"
}

interface IColourEnum{
  value: string;
  name: ColourEnum;
}
