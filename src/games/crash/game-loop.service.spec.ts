import { Test, TestingModule } from '@nestjs/testing';
import { GameLoopService } from './game-loop.service';
import { GameService } from './game.service';
import { ConfigService } from '@nestjs/config';
import { GameStatus } from './enums/game-status.enums';
import { Bet, GameState } from './state/game-state.model';

describe('GameLoopService', () => {
  let service: GameLoopService;

  const getStateSnapshotMock = jest.fn();
  const setGameStatusMock = jest.fn();
  const updateCoefficientMock = jest.fn();
  const restartGameMock = jest.fn();

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
            updateCoefficient: updateCoefficientMock,
            restartGame: restartGameMock,
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

  const createBet = (userId: string): Bet => ({
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

  const createGameState = (overrides: Partial<GameState> = {}): GameState => ({
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
    it('should start betting countdown if there are enough players and status is correct', () => {
      getStateSnapshotMock.mockReturnValue(createGameState());

      service.startBettingCountdownIfNeeded();

      expect(setGameStatusMock).toHaveBeenCalledTimes(1);
      expect(setGameStatusMock).toHaveBeenCalledWith(
        GameStatus.BETTING_WAITING,
      );
      expect(jest.getTimerCount()).toBe(1);
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
    it('should call countdown finished after betting delay', () => {
      getStateSnapshotMock.mockReturnValue(createGameState());
      const startBettingCountdownFinishedSpy = jest
        .spyOn(service, 'startBettingCountdownFinished')
        .mockImplementation(jest.fn());

      service.startBettingCountdownIfNeeded();

      expect(startBettingCountdownFinishedSpy).not.toHaveBeenCalled();

      jest.advanceTimersByTime(4999);

      expect(startBettingCountdownFinishedSpy).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);

      expect(startBettingCountdownFinishedSpy).toHaveBeenCalledTimes(1);
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
    it('should start game and timers if status is betting waiting', () => {
      getStateSnapshotMock.mockReturnValue(
        createGameState({ status: GameStatus.BETTING_WAITING }),
      );
      const startCrashTimerSpy = jest
        .spyOn(service, 'startCrashTimer')
        .mockImplementation(jest.fn());
      const startCoefficientUpdatesSpy = jest
        .spyOn(service, 'startCoefficientUpdates')
        .mockImplementation(jest.fn());

      service.startBettingCountdownFinished();

      expect(setGameStatusMock).toHaveBeenCalledTimes(1);
      expect(setGameStatusMock).toHaveBeenCalledWith(GameStatus.IN_PROGRESS);
      expect(startCrashTimerSpy).toHaveBeenCalledTimes(1);
      expect(startCrashTimerSpy).toHaveBeenCalledWith(100);
      expect(startCoefficientUpdatesSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('startCrashTimer', () => {
    it('should start crashed phase after crash time', () => {
      const startCrashedPhaseSpy = jest
        .spyOn(service, 'startCrashedPhase')
        .mockImplementation(jest.fn());

      service.startCrashTimer(100);

      expect(startCrashedPhaseSpy).not.toHaveBeenCalled();
      expect(jest.getTimerCount()).toBe(1);

      jest.advanceTimersByTime(99);

      expect(startCrashedPhaseSpy).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);

      expect(startCrashedPhaseSpy).toHaveBeenCalledTimes(1);
      expect(jest.getTimerCount()).toBe(0);
    });
  });

  describe('startCoefficientUpdates', () => {
    it('should send coefficient updates every 100ms', () => {
      service.startCoefficientUpdates();

      expect(updateCoefficientMock).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(updateCoefficientMock).toHaveBeenNthCalledWith(1, 1.0);

      jest.advanceTimersByTime(100);

      expect(updateCoefficientMock).toHaveBeenNthCalledWith(2, 1.1);
    });
  });

  describe('startCrashedPhase', () => {
    it('should stop coefficient updates, set ended status, and restart game after crashed delay', () => {
      service.startCoefficientUpdates();

      jest.advanceTimersByTime(100);

      expect(updateCoefficientMock).toHaveBeenCalledTimes(1);

      updateCoefficientMock.mockClear();

      service.startCrashedPhase();

      expect(setGameStatusMock).toHaveBeenCalledTimes(1);
      expect(setGameStatusMock).toHaveBeenCalledWith(GameStatus.ENDED);
      expect(jest.getTimerCount()).toBe(1);

      jest.advanceTimersByTime(1000);

      expect(updateCoefficientMock).not.toHaveBeenCalled();
      expect(restartGameMock).not.toHaveBeenCalled();

      jest.advanceTimersByTime(4000);

      expect(restartGameMock).toHaveBeenCalledTimes(1);
      expect(jest.getTimerCount()).toBe(0);
    });
  });
});
