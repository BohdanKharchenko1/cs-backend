import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserService } from '../../user/user.service';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GameParticipant } from './entities/game-participant.entity';

describe('GameService', () => {
  let service: GameService;

  let gameRepository: jest.Mocked<Partial<Repository<Game>>>;
  let gameParticipantRepository: jest.Mocked<
    Partial<Repository<GameParticipant>>
  >;
  const eventEmitter = jest.fn();
  beforeEach(async () => {
    gameRepository = {
      findOne: jest.fn(),
    };
    gameParticipantRepository = {
      findOne: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: EventEmitter2,
          useValue: eventEmitter,
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Game),
          useValue: gameRepository,
        },
        {
          provide: getRepositoryToken(GameParticipant),
          useValue: gameParticipantRepository,
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
