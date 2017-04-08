export class Colour {
}

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
