import React from 'react';
import {configure} from 'mobx';
import {PlaybookStore} from './playbook/playbook.store';
import {Playbook} from './playbook/Playbook';

const playbook = new PlaybookStore();

configure({
  enforceActions: 'never',
});

const App = () => {
  return <Playbook playbook={playbook} />;
};

export default App;
