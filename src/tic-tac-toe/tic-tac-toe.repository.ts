import { TicTacToeEntity } from './tic-tac-toe.entity';
import { v4 as uuidv4 } from 'uuid';

export class TicTacToeRepository {
    private readonly ticTacToes: TicTacToeEntity[];

    constructor() {
        this.ticTacToes = [];
    }

    public create(): TicTacToeEntity {
        const ticTacToe = new TicTacToeEntity();
        ticTacToe.id = uuidv4();

        this.ticTacToes.push(ticTacToe);

        return ticTacToe;
    }

    public getById(ticTacToeId: string): TicTacToeEntity | undefined {
        return this.ticTacToes.find((ticTacToe: TicTacToeEntity) => ticTacToe.id === ticTacToeId);
    }
}