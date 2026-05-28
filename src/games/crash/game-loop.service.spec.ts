import { Test, TestingModule } from '@nestjs/testing';
import { GameLoopService } from './game-loop.service';
import { GameService } from './game.service';
import { ConfigService } from '@nestjs/config';
import { GameStatus } from './enums/game-status.enums';

describe('GameLoopService', () => {
  let service: GameLoopService;

  const getStateSnapshotMock = jest.fn();
  const setGameStatusMock = jest.fn();

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameLoopService,
        {
          provide: GameService,
          useValue: {
            getStateSnapshot: getStateSnapshotMock,
            setGameStatus: setGameStatusMock,
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => {
              const config: Record<string, number> = {
                BETTING_DELAY: 5000,
                MINIMUM_PLAYERS: 2,
                CRASHED_DELAY: 5000,
              };

              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<GameLoopService>(GameLoopService);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  const createBet = (userId: string) => ({
    user: {
      id: userId,
      username: '',
      photoUrl: '',
    },
    joinedAt: new Date(),
    betAmount: '',
    cashedOutAt: null,
    cashedOutAmount: null,
  });

  const createGameState = (overrides = {}) => ({
    id: '',
    status: GameStatus.WAITING_FOR_PLAYERS,
    createdAt: new Date(),
    coefficient: 0,
    startedAt: null,
    finishedAt: null,
    bets: [createBet('1'), createBet('2')],
    ...overrides,
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('startBettingCountdownIfNeeded', () => {
    it('should not start if there are not enough players', () => {
      getStateSnapshotMock.mockReturnValue(
        createGameState({
          bets: [createBet('1')],
        }),
      );

      service.startBettingCountdownIfNeeded();

      expect(setGameStatusMock).not.toHaveBeenCalled();
      expect(jest.getTimerCount()).toBe(0);
    });
    it.each([
      GameStatus.BETTING_WAITING,
      GameStatus.IN_PROGRESS,
      GameStatus.ENDED,
    ])('should not start if status is incorrect', (status) => {
      getStateSnapshotMock.mockReturnValue(
        createGameState({
          bets: [createBet('1'), createBet('2'), createBet('3')],
          status,
        }),
      );

      service.startBettingCountdownIfNeeded();

      expect(setGameStatusMock).not.toHaveBeenCalled();
      expect(jest.getTimerCount()).toBe(0);
    });
    it('should not start another countdown if betting timer already exists', () => {
      getStateSnapshotMock.mockReturnValue(
        createGameState({
          bets: [createBet('1'), createBet('2')],
          status: GameStatus.WAITING_FOR_PLAYERS,
        }),
      );

      service.startBettingCountdownIfNeeded();
      service.startBettingCountdownIfNeeded();

      expect(setGameStatusMock).toHaveBeenCalledTimes(1);
      expect(setGameStatusMock).toHaveBeenCalledWith(
        GameStatus.BETTING_WAITING,
      );
      expect(jest.getTimerCount()).toBe(1);
    });
  });

  describe('startBettingCountdownFinished', () => {
    it.each([
      GameStatus.WAITING_FOR_PLAYERS,
      GameStatus.IN_PROGRESS,
      GameStatus.ENDED,
    ])('should not start if status is incorrect', (status) => {
      getStateSnapshotMock.mockReturnValue(createGameState({ status }));
      const startCrashTimerSpy = jest.spyOn(service, 'startCrashTimer');
      const startCoefficientUpdatesSpy = jest.spyOn(
        service,
        'startCoefficientUpdates',
      );

      service.startBettingCountdownFinished();

      expect(setGameStatusMock).not.toHaveBeenCalled();
      expect(startCrashTimerSpy).not.toHaveBeenCalled();
      expect(startCoefficientUpdatesSpy).not.toHaveBeenCalled();
    });
  });
});
