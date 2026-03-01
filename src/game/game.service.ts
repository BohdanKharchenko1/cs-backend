import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { GameParticipant } from './entities/game-participant.entity';
import { GameState } from './state/game-state.model';
import { createInitialGameState } from './state/game-state.factory';

@Injectable()
export class GameService {
  private gameState: GameState = createInitialGameState();
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    @InjectRepository(GameParticipant)
    private readonly gameParticipantRepository: Repository<GameParticipant>,
  ) {}

  createNewGame() {
    return (this.gameState = createInitialGameState());
  }
  getGameState() {
    return this.gameState;
  }
}
