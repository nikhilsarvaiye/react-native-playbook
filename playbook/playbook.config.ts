import {PlaybookPlayer, PlaybookSettings} from './playbook.models';

export const settings: PlaybookSettings = {
  playerColor: '#5B6FD2', // 'red',
  playerSize: 45,
  pathStrokeColor: 'red',
};

export const players: PlaybookPlayer[] = [
  {
    id: 1,
    x: 75,
    y: 430,
    draggable: true,
    title: '1',
  },
  {
    id: 2,
    x: 150,
    y: 430,
    draggable: true,
    title: '2',
  },
  {
    id: 3,
    x: 180,
    y: 275,
    draggable: true,
    title: '3',
  },
  // {
  //   id: 4,
  //   x: 65,
  //   y: 255,
  //   draggable: true,
  //   title: '4',
  // },
  // {
  //   id: 5,
  //   x: 435,
  //   y: 255,
  //   draggable: true,
  //   title: '5',
  // },
];
