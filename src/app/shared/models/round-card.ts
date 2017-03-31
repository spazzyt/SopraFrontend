
export class RoundCard {

  //Backend attributes
  //==================



  //Additional Frontend attributes
  //==============================

  //unique identifier
  public id:number;

  //ships of new round
  public shipId_1;
  public shipSize_1;

  public shipId_2;
  public shipSize_2;

  public shipId_3;
  public shipSize_3;

  public shipId_4;
  public shipSize_4;


  constructor(fourNewShips:number[][]){

    //ship 1
    this.shipId_1=fourNewShips[0][0];
    this.shipSize_1=fourNewShips[0][1];

    //ship 2
    this.shipId_2=fourNewShips[1][0];
    this.shipSize_2=fourNewShips[1][1];

    //ship 3
    this.shipId_3=fourNewShips[2][0];
    this.shipSize_3=fourNewShips[2][1];

    //ship 4
    this.shipId_4=fourNewShips[3][0];
    this.shipSize_4=fourNewShips[3][1];
  }

}
