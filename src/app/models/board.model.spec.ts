import { boardsResponse, boardUIData } from '../services/board.snapshot';
import { BoardMapper, BoardModel, BoardModelUI } from './board.model';

describe('BoardMapper :: ', () => {
    it('should execute the canary test', () => {
        return expect(true).toBe(true);
    });

    it('toUIModel :: should correctly convert to UI model', () => {
        const bm = new BoardMapper();
        expect(bm.toUIModel(boardsResponse.data[0])).toEqual(boardUIData);
    });

    it('toServiceModel :: should correctly convert to Service model', () => {
        const bm = new BoardMapper();
        expect(bm.toServiceModel(boardUIData)).toEqual({} as BoardModel);
    });
});

