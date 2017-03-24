import {User} from "./user";
/**
 * Created by benzro on 23.03.17.
 */

export class Game {
    public id:number;
    public token: string;
    public status: string;
    public numPlayers: number;
    public name: string;
    public players: User[];

    constructor(){
    }
}
