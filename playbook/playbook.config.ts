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
    y: 350,
    draggable: true,
    title: '1',
    active: true,
  },
  {
    id: 2,
    x: 300,
    y: 350,
    draggable: true,
    title: '2',
    active: false,
  },
  {
    id: 3,
    x: 180,
    y: 260,
    draggable: true,
    title: '3',
    active: false,
  },
  {
    id: 4,
    x: 60,
    y: 175,
    draggable: true,
    title: '4',
    active: false,
  },
  {
    id: 5,
    x: 300,
    y: 175,
    draggable: true,
    title: '5',
    active: false,
  },
];
