export enum Action {
}


export enum ActionEnum {
  fillSledWithStonesFromQuarry=<any>"takeStonesFromQuarry",
  placeStoneFromSledToShip=<any>"placeStoneFromSledToShip",
  placeStoneFromSledToShip1=<any>"placeStoneFromSledToShip1",
  placeStoneFromSledToShip1ToSlot1=<any>"placeStoneFromSledToShip1ToSlot1",
  placeStoneFromSledToShip1ToSlot2=<any>"placeStoneFromSledToShip1ToSlot2",
  placeStoneFromSledToShip1ToSlot3=<any>"placeStoneFromSledToShip1ToSlot3",
  placeStoneFromSledToShip1ToSlot4=<any>"placeStoneFromSledToShip1ToSlot4",
  placeStoneFromSledToShip2=<any>"placeStoneFromSledToShip2",
  placeStoneFromSledToShip2ToSlot1=<any>"placeStoneFromSledToShip2ToSlot1",
  placeStoneFromSledToShip2ToSlot2=<any>"placeStoneFromSledToShip2ToSlot2",
  placeStoneFromSledToShip2ToSlot3=<any>"placeStoneFromSledToShip2ToSlot3",
  placeStoneFromSledToShip2ToSlot4=<any>"placeStoneFromSledToShip2ToSlot4",
  placeStoneFromSledToShip3=<any>"placeStoneFromSledToShip3",
  placeStoneFromSledToShip3ToSlot1=<any>"placeStoneFromSledToShip3ToSlot1",
  placeStoneFromSledToShip3ToSlot2=<any>"placeStoneFromSledToShip3ToSlot2",
  placeStoneFromSledToShip3ToSlot3=<any>"placeStoneFromSledToShip3ToSlot3",
  placeStoneFromSledToShip3ToSlot4=<any>"placeStoneFromSledToShip3ToSlot4",
  placeStoneFromSledToShip4=<any>"placeStoneFromSledToShip4",
  placeStoneFromSledToShip4ToSlot1=<any>"placeStoneFromSledToShip4ToSlot1",
  placeStoneFromSledToShip4ToSlot2=<any>"placeStoneFromSledToShip4ToSlot2",
  placeStoneFromSledToShip4ToSlot3=<any>"placeStoneFromSledToShip4ToSlot3",
  placeStoneFromSledToShip4ToSlot4=<any>"placeStoneFromSledToShip4ToSlot4",
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
