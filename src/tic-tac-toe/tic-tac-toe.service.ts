import { PlayerEntity } from '../player/player.entity';
import { TicTacToeRepository } from './tic-tac-toe.repository';
import { TicTacToeEntity } from './tic-tac-toe.entity';
import { TicTacToeDto } from '../dtos/tic-tac-toe.dto';
import { PlayerRepository } from '../player/player.repository';

export class TicTacToeService {
    private readonly ticTacToeRepository: TicTacToeRepository;
    private readonly playerRepository: PlayerRepository;

    constructor(
        ticTacToeRepository: TicTacToeRepository,
        playerRepository: PlayerRepository,
    ) {
        this.ticTacToeRepository = ticTacToeRepository;
        this.playerRepository = playerRepository;
    }

    public create(): TicTacToeDto {
        const ticTacToe = this.ticTacToeRepository.create();

        return TicTacToeEntity.toDto(ticTacToe);
    }

    public step(
        ticTacToeId: string,
        playerId: string,
        selectRow: number,
        selectColumn: number,
    ): TicTacToeDto | undefined {
        const ticTacToe = this.ticTacToeRepository.getById(ticTacToeId);
        const player = this.playerRepository.getById(playerId);

        if (ticTacToe && player) {
            const isFreeCell = this.isFreeCell(ticTacToe, selectRow, selectColumn);
            const isCorrectPlayer = ticTacToe.symbolNextPlayer !== player.symbol;

            if (!isFreeCell || !isCorrectPlayer) {
                this.changeCell(ticTacToe, selectRow, selectColumn, player);
                ticTacToe.symbolNextPlayer = this.changeCurrentPlayer(ticTacToe.symbolNextPlayer);
            }
        }

        return ticTacToe
            ? TicTacToeEntity.toDto(ticTacToe)
            : undefined;
    }

    public isWin(ticTacToeId: string, playerId: string): boolean {
        const ticTacToe = this.ticTacToeRepository.getById(ticTacToeId);
        const player = this.playerRepository.getById(playerId);

        if (ticTacToe && player) {
            return this.isWinHorizontal(ticTacToe, player)
                || this.isWinVertical(ticTacToe, player)
                || this.isWinMainDiagonal(ticTacToe, player)
                || this.isWinSideDiagonal(ticTacToe, player);
        }

        return false;
    }

    public clean(ticTacToeId: string): void {
        const ticTacToe = this.ticTacToeRepository.getById(ticTacToeId);

        if (!ticTacToe) return;

        for (let i = 0; i < ticTacToe.countRow; i++) {
            ticTacToe.field[i] = [];

            for (let j = 0; j < ticTacToe.countColumn; j++) {
                ticTacToe.field[i][j] = ' ';
            }
        }
    }

    public debugPrint(ticTacToeDto: TicTacToeDto): void {
        const ticTacToe = TicTacToeEntity.FromDto(ticTacToeDto);

        for (let i = 0; i < ticTacToe.countRow; i++) {
            let str = '';

            for (let j = 0; j < ticTacToe.countColumn; j++) {
                str += ticTacToe.field[i][j] + '|';
            }
        }
    }

    private changeCurrentPlayer(symbolCurrentPlayer: string): string {
        return symbolCurrentPlayer === 'X'
            ? 'O'
            : 'X';
    }

    private isFreeCell(
        ticTacToe: TicTacToeEntity,
        selectRow: number,
        selectColumn: number
    ): boolean {
        return ticTacToe.field[selectRow][selectColumn] === ticTacToe.EMPTY_CELL;
    }

    private changeCell(
        ticTacToe: TicTacToeEntity,
        selectRow: number,
        selectColumn: number,
        player: PlayerEntity
    ): void {
        ticTacToe.field[selectRow][selectColumn] = player.symbol;
    }

    private isWinHorizontal(ticTacToe: TicTacToeEntity, player: PlayerEntity): boolean {
        const playerSymbol = player.symbol;

        for (let i = 0; i < ticTacToe.countRow; i++) {
            let countWinCell = 0;

            for (let j = 0; j < ticTacToe.countColumn; j++) {
                if (ticTacToe.field[i][j] === playerSymbol) {
                    countWinCell++;
                }
            }

            if (countWinCell === ticTacToe.countRow) return true;
        }

        return false;
    }

    private isWinVertical(ticTacToe: TicTacToeEntity, player: PlayerEntity): boolean {
        const playerSymbol = player.symbol;
        for (let i = 0; i < ticTacToe.countColumn; i++) {
            let countWinCell = 0;

            for (let j = 0; j < ticTacToe.countRow; j++) {
                if (ticTacToe.field[j][i] === playerSymbol) {
                    countWinCell++;
                }
            }

            if (countWinCell === ticTacToe.countColumn) return true;
        }

        return false;
    }

    private isWinMainDiagonal(ticTacToe: TicTacToeEntity, player: PlayerEntity): boolean {
        const playerSymbol = player.symbol;
        let countWinCell = 0;

        for (let i = 0; i < ticTacToe.countRow; i++) {
            if (ticTacToe.field[i][i] === playerSymbol) {
                countWinCell++;
            }
        }

        return countWinCell === ticTacToe.countRow;
    }

    private isWinSideDiagonal(ticTacToe: TicTacToeEntity, player: PlayerEntity): boolean {
        const playerSymbol = player.symbol;
        let countWinCell = 0;

        for (let i = 0; i < ticTacToe.countRow; i++) {
            const columnIndex = ticTacToe.countColumn - i - 1;

            if (ticTacToe.field[i][columnIndex] === playerSymbol) {
                countWinCell++;
            }
        }

        return countWinCell === ticTacToe.countRow;
    }
}