import {makeObservable, observable, computed, action} from 'mobx';
import {SketchCanvas} from '@terrylinla/react-native-sketch-canvas';
import {PlaybookPlayer} from './playbook.models';
import {PlaybookMoveStore} from './playbookMove.store';

export class PlaybookStore {
  private canvas: SketchCanvas | null = null;
  private defaultPlayers: PlaybookPlayer[] = [];
  moves: PlaybookMoveStore[] = [];
  currentMove: PlaybookMoveStore | null = null;
  currentMoveIndex: number = -1;
  isPlaying: boolean = false;
  isPaused: boolean = false;
  timeInterval: any;

  constructor() {
    makeObservable(this, {
      moves: observable,
      currentMove: observable,
      currentMoveIndex: observable,
      setCurrentMoveIndex: action,
      play: action,
      stop: action,
      hasPrev: computed,
      hasNext: computed,
      isPlaying: observable,
      isPaused: observable,
      deleteMove: action,
    });
  }

  init = (canvas: SketchCanvas, players: PlaybookPlayer[]) => {
    this.canvas = canvas;
    this.defaultPlayers = players;
    if (this.moves.length === 0) {
      this.addMove();
    }
  };

  addMove = () => {
    if (this.canvas != null) {
      // this add players from last move if present else default players
      const lastMovePlayers = JSON.parse(
        JSON.stringify(
          this.moves.length
            ? this.moves[this.moves.length - 1].players
            : this.defaultPlayers,
        ),
      );
      const move = new PlaybookMoveStore(this.canvas, lastMovePlayers);
      this.moves.push(move);
      this.currentMove = move;
      this.setCurrentMoveIndex();
    }
  };

  load = () => {
    if (this.moves.length) {
      this.currentMove = this.moves[0];
    }
  };

  play = () => {
    const interval = 1000;
    if (this.moves.length) {
      // play should be from start unless paused
      if (!this.isPaused) {
        this.first();
      }
      this.isPaused = false;
      this.isPlaying = true;
      this.timeInterval = setInterval(() => {
        console.log('playing move ' + (this.currentMoveIndex + 1));
        this.next();
        if (this.currentMoveIndex === this.moves.length - 1) {
          setTimeout(() => {
            this.stop();
          }, interval);
        }
      }, interval);
    }
  };

  replay = () => {
    this.isPaused = false;
    this.currentMoveIndex = 0;
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    this.play();
  };

  pause = () => {
    this.isPaused = true;
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  };

  stop = () => {
    console.log(
      'stopping playbook - current move ' + (this.currentMoveIndex + 1),
    );
    this.isPlaying = false;
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.first();
    }
  };

  moveTo = (index: number) => {
    if (this.moves.length && index < this.moves.length) {
      this.currentMove = this.moves[index];
      this.setCurrentMoveIndex();
      this.currentMove.draw();
    }
  };

  first = () => {
    this.moveTo(0);
  };

  prev = () => {
    if (this.currentMoveIndex > 0) {
      this.currentMove = this.moves[this.currentMoveIndex - 1];
      this.setCurrentMoveIndex();
      this.currentMove.draw();
    }
  };

  next = (allowAdd = false) => {
    if (
      this.currentMoveIndex > -1 &&
      this.currentMoveIndex < this.moves.length - 1
    ) {
      this.currentMove = this.moves[this.currentMoveIndex + 1];
      this.setCurrentMoveIndex();
      this.currentMove.draw();
    } else if (allowAdd) {
      this.addMove();
    }
  };

  deleteMove = () => {
    if (this.currentMove) {
      console.log('deleting move ' + (this.currentMoveIndex + 1));
      this.moves.splice(this.currentMoveIndex, 1);
      this.currentMoveIndex--;
    }
    if (this.moves.length === 0) {
      this.addMove();
    } else {
      this.moveTo(this.currentMoveIndex);
    }
  };

  get hasNext() {
    return (
      this.currentMoveIndex > -1 &&
      this.currentMoveIndex < this.moves.length - 1
    );
  }

  get hasPrev() {
    return this.currentMoveIndex > 0 && this.moves.length > 1;
  }

  setCurrentMoveIndex = () => {
    this.currentMoveIndex = this.currentMove
      ? this.moves.indexOf(this.currentMove)
      : -1;
  };
}
