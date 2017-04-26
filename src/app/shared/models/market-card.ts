
export class MarketCard {


  //unique identifier
  public id:number=-1;

  //card type
  public type:string="";

  // Possible Types:
  // Statue
  // Blue
  // Green
  // Red

  //card name (statue, burialdec, sarcophagus etc. in the format as used in the image url)
  public name:string="";

  //card image
  public imageUrl:string="";



  //constructor
  constructor(id_:number, type_?: string, name_?: string){

    this.id = id_;
    this.type = type_;
    this.name = 'statue';
    /*
    if(type_ == 'Statue'){    //TODO remove as soon as backend delivers correct name
      this.name = 'statue';
    }
    else
      this.name = name_;
    */

    this.imageUrl = "../../../assets/images/cards/" + this.name + ".png"    //TODO ensure that name has the correct format
  }


  /** List of possible cards:

   RED CARDS
   - Paved Path (2)
   - Sarcophagus (2)
   - Entrance (2)

   GREEN CARDS
   - Pyramid Decoration (2)
   - Temple Decoration (2)
   - Burial Chamber Decoration (2)
   - Obelisk Decoration (2)

   VIOLET CARD
   - Statue (10)

   BLUE CARDS
   - Chisel (3)
   - Lever (2)
   - Hammer (2)
   - Sail (3)

   */

}
