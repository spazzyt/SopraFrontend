
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
  constructor(id_:number, type_: string, name_?: string){

    this.id = id_;
    this.type = type_;
    if(type_ == 'Statue'){  //type statue only has one kind of card
      this.name = 'statue';
    }
    else    //HARDCODED name (as used by image) based on ID, as provided by backend (-> do not change)
    {
      if(type_ == 'Green'){
        if(this.id >= 10 && this.id <= 11){  //Pyramid Dec
          this.name = 'pyramiddec';
        }
        else if(this.id >= 12 && this.id <= 13){ //Obelisk Dec
          this.name = 'obeliskdec';
        }
        else if(this.id >= 14 && this.id <= 15){ //Burial Dec
          this.name = 'burialdec';
        }
        else if(this.id >= 16 && this.id <= 17){ //Temple Dec
          this.name = 'templedec';
        }
      }
      else if(type_ == 'Red'){
        if(this.id >= 18 && this.id <= 19){  //pavedpath
          this.name = 'pavedpath';
        }
        else if(this.id >= 20 && this.id <= 21){ //sarcophagus
          this.name = 'sarcophagus';
        }
        else if(this.id >= 22 && this.id <= 23){ //entrance
          this.name = 'entrance';
        }
      }
      else if(type_ == 'Blue'){
        if(this.id >= 24 && this.id <= 26){  //chisel
          this.name = 'chisel';
        }
        else if(this.id >= 27 && this.id <= 28){ //lever
          this.name = 'lever';
        }
        else if(this.id >= 29 && this.id <= 30){ //hammer
          this.name = 'hammer';
        }
        else if(this.id >= 31 && this.id <= 33){ //sail
          this.name = 'sail';
        }
      }
    }

    this.imageUrl = "../../../assets/images/cards/" + this.name + ".png";
  }

  /**

   CARDS BY ID (as provided by backend)
   -----------

   0-9: Statue                          PURPLE
   10-11: Pyramid Decoration            GREEN
   12-13: Obelisk Decoration
   14-15: Burial Chamber Decoration
   16-17: Temple Decoration
   18-19: Paved Path                    RED
   20-21: Sarcophagus
   22-23: Entrance
   24-26: Chisel                        BLUE
   27-28: Lever
   29-30: Hammer
   31-33: Sail



   List of possible cards:
   -----------------------

   RED CARDS
   - Paved Path (2)
   - Sarcophagus (2)
   - Entrance (2)

   GREEN CARDS
   - Pyramid Decoration (2)
   - Temple Decoration (2)
   - Burial Chamber Decoration (2)
   - Obelisk Decoration (2)

   PURPLE CARD
   - Statue (10)

   BLUE CARDS
   - Chisel (3)
   - Lever (2)
   - Hammer (2)
   - Sail (3)

   */
}
