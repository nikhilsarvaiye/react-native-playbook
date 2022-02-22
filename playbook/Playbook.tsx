/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Button, Text} from 'react-native';
import Draggable from 'react-native-draggable';
import {SketchCanvas} from '@terrylinla/react-native-sketch-canvas';
import {Observer} from 'mobx-react-lite';
import Slider from '@react-native-community/slider';
import {PlaybookStore} from './playbook.store';
import {players, settings} from './playbook.config';

// Hook
// Our hook
export function useDebounce(value: any, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function that will be called every time ...
      // ... useEffect is re-called. useEffect will only be re-called ...
      // ... if value changes (see the inputs array below).
      // This is how we prevent debouncedValue from changing if value is ...
      // ... changed within the delay period. Timeout gets cleared and restarted.
      // To put it in context, if the user is typing within our app's ...
      // ... search box, we don't want the debouncedValue to update until ...
      // ... they've stopped typing for more than 500ms.
      return () => {
        clearTimeout(handler);
      };
    },
    // Only re-call effect if value changes
    // You could also add the "delay" var to inputs array if you ...
    // ... need to be able to change that dynamically.
    [value],
  );

  return debouncedValue;
}

export const Playbook = ({playbook}: {playbook: PlaybookStore}) => {
  const canvas = useRef<SketchCanvas>();
  const [playerPosition, setPlayerPosition] = useState({id: 0, x: 0, y: 0});
  const debouncedPlayerPosition = useDebounce(playerPosition, 1000);

  // Effect for API call
  useEffect(
    () => {
      console.log(playerPosition);
      const player =
        playerPosition?.id > 0
          ? playbook?.currentMove?.players.find(x => x.id === playerPosition.id)
          : null;
      if (player) {
        player.x = playerPosition.x;
        player.y = playerPosition.y;
      }
    },
    [debouncedPlayerPosition], // Only call effect if debounced search term changes
  );

  useEffect(() => {
    if (canvas.current) {
      // TODO: if there are existing moves you can pass here in Playbook constructor
      playbook?.init(canvas.current, players);
    }
  }, [playbook]);

  return (
    <Observer>
      {() => (
        <View style={styles.container}>
          {!playbook.isPlaying && (
            <View style={{flexDirection: 'row'}}>
              <Button
                title="Prev Move"
                onPress={() => {
                  if (canvas.current) {
                    playbook?.prev();
                  }
                }}
                disabled={!playbook.hasPrev}
              />
              <Button
                title="Next Move"
                onPress={() => {
                  if (canvas.current) {
                    playbook?.next();
                  }
                }}
                disabled={!playbook.hasNext}
              />
              <Button
                title="Add Move"
                onPress={() => {
                  if (canvas.current) {
                    playbook?.addMove();
                  }
                }}
              />

              <Button
                title="Save All"
                color={'green'}
                onPress={() => {
                  // TODO: save this whole object as document
                }}
              />
            </View>
          )}
          <View style={styles.dragDrop}>
            {/* <Text>{JSON.stringify(playbook?.currentMove?.players)}</Text> */}
            {playbook?.currentMove?.players.map((player, index) => {
              const a: any = {};
              return (
                <Draggable
                  x={player.x}
                  y={player.y}
                  renderSize={settings.playerSize}
                  renderColor={settings.playerColor}
                  renderText={player.title}
                  isCircle
                  key={index}
                  onDrag={(event, gestureState) => {
                    // setPlayerPosition({
                    //   id: player.id,
                    //   x: gestureState.moveX,
                    //   y: gestureState.moveY,
                    // });
                    // a.x0 = gestureState.x0;
                    // a.y0 = gestureState.y0;
                  }}
                  onDragRelease={() => {
                    // player.x = a.x0;
                    // player.y = a.y0;
                  }}
                />
              );
            })}
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <SketchCanvas
              ref={canvas}
              style={{flex: 1}}
              strokeColor={'red'}
              strokeWidth={7}
              localSourceImage={
                {
                  filename: 'playbook.png', // 'playbook.png',
                  directory: SketchCanvas.MAIN_BUNDLE,
                  mode: 'ScaleToFill',
                } as any
              }
              containerStyle={{backgroundColor: 'transparent', flex: 1}}
              canvasStyle={{backgroundColor: 'transparent', flex: 1}}
              onStrokeEnd={() => {
                playbook?.currentMove?.save();
              }}
            />
          </View>
          {/* <Text>{(playbook.getCurrentMoveIndex() + 1) of Total {playbook.moves.length}}</Text> */}
          {!playbook.isPlaying && (
            <View>
              <Button
                title="Undo"
                onPress={() => {
                  playbook?.currentMove?.undo();
                }}
              />
              <Button
                title="Clear"
                onPress={() => {
                  playbook?.currentMove?.clear();
                }}
              />
              <Button
                title="Play"
                color={'green'}
                onPress={() => {
                  playbook?.play();
                }}
              />
            </View>
          )}
          {playbook.isPaused && (
            <View>
              <Button
                title="Play"
                color={'green'}
                onPress={() => {
                  playbook?.play();
                }}
              />
            </View>
          )}
          {playbook.isPlaying && !playbook?.isPaused && (
            <View>
              <Button
                title="Pause"
                onPress={() => {
                  playbook?.pause();
                }}
              />
            </View>
          )}
          {playbook?.isPlaying && (
            <View>
              <Button
                title="Stop"
                color={'red'}
                onPress={() => {
                  playbook?.stop();
                }}
              />
            </View>
          )}
          {playbook && (
            <View>
              <Text>
                {playbook.currentMoveIndex + 1} of {playbook.moves.length}
              </Text>
              <Slider
                style={{width: 200, height: 40}}
                minimumValue={0}
                maximumValue={playbook?.moves.length}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                onValueChange={value => {
                  playbook.moveTo(value);
                }}
                value={playbook.currentMoveIndex}
              />
            </View>
          )}
        </View>
      )}
    </Observer>
  );
};

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  dragDrop: {
    zIndex: 999999,
  },
});
