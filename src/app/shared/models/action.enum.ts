export enum Action {
}


export enum ActionEnum {
  fillSledWithStonesFromQuarry=<any>"takeStonesFromQuarry",
  placeStoneFromSledToShip=<any>"placeStoneFromSledToShip",
  placeStoneFromSledToShip1=<any>"placeStoneFromSledToShip1",
  placeStoneFromSledToShip2=<any>"placeStoneFromSledToShip2",
  placeStoneFromSledToShip3=<any>"placeStoneFromSledToShip3",
  placeStoneFromSledToShip4=<any>"placeStoneFromSledToShip4",
  sailShip=<any>"sailShip",
  sailShipToMarket=<any>"sailShipToMarket",
  sailShipToTemple=<any>"sailShipToTemple",
  sailShipToPyramid=<any>"sailShipToPyramid",
  sailShipBurialChamber=<any>"sailShipToBurialChamber",
  sailShipObelisk=<any>"sailShipToObelisk",
  takeMarketCard=<any>"takeMarketCard",
  takeGreenMarketCard=<any>"takeGreenMarketCard",
  takeGreenMarketCardPyramidDecoration=<any>"takeGreenMarketCardPyramidDecoration",
  takeGreenMarketCardObeliskDecoration=<any>"takeGreenMarketCardObeliskDecoration",
  takeGreenMarketCardBurialChamberDecoration=<any>"takeGreenMarketCardBurialChamberDecoration",
  takeGreenMarketCardTempleDecoration=<any>"takeGreenMarketCardTempleDecoration",
  takeRedMarketCard=<any>"takeRedMarketCard",
  takeRedMarketCardSacophargus=<any>"takeRedMarketCardSacophargus",
  takeRedMarketCardEntrance=<any>"takeRedMarketCardEntrance",
  takeRedMarketCardPavedPath=<any>"takeRedMarketCardPavedPath",
  takeBlueMarketCard=<any>"takeBlueMarketCard",
  takeMarketCardHammer=<any>"takeRedMarketHammer",
  takeMarketCardSail=<any>"takeRedMarketSail",
  takeMarketCardLever=<any>"takeRedMarketLever",
  takeMarketCardChisel=<any>"takeRedMarketChisel",
  playBlueMarketCard=<any>"playBlueMarketCard",
  playBlueMarketCardHammer=<any>"playBlueMarketCardHammer",
  playBlueMarketCardSail=<any>"playBlueMarketCardSail",
  playBlueMarketCardLever=<any>"playBlueMarketCardLever",
  playBlueMarketCardChisel=<any>"playBlueMarketCardChisel"
}


interface IActionEnum{
  value: string;
  name: ActionEnum;
}
