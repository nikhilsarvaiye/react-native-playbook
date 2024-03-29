import {action, makeObservable, observable} from 'mobx';
import {SketchCanvas, Path} from '@terrylinla/react-native-sketch-canvas';
import {PlaybookPlayer} from './playbook.models';

export class PlaybookMoveStore {
  private canvas: SketchCanvas;
  players: PlaybookPlayer[] = [];
  paths: Path[] = [];
  notes: string = '';
  strokeColor: string = 'red';

  constructor(canvas: SketchCanvas, players?: PlaybookPlayer[]) {
    if (!canvas) {
      throw new Error('please pass valid canvas reference');
    }
    this.canvas = canvas;
    if (players) {
      this.players = players;
    }
    console.log('players');
    console.log(this.players.length);
    this.canvas.clear();
    this.paths.forEach(path => this.canvas.addPath(path));

    makeObservable(this, {
      players: observable,
      notes: observable,
      reDraw: action,
    });
  }

  draw = () => {
    this.canvas.clear();
    this.paths.forEach(path => this.canvas.addPath(path));
  };

  reDraw = () => {
    const _players = JSON.parse(JSON.stringify(this.players));
    this.players.splice(0, this.players.length);
    this.save();
    setTimeout(() => {
      this.draw();
      this.players.push(..._players);
    });
  };

  undo = () => {
    console.log('Undoing move');
    this.canvas.undo();
    this.save();
  };

  clear = () => {
    console.log('Clearing move');
    this.canvas.clear();
    this.save();
  };

  save = () => {
    console.log('Saving move');
    this.paths = this.canvas.getPaths();
  };
}
