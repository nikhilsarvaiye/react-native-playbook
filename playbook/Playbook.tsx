/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Button,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import Draggable from 'react-native-draggable';
import {SketchCanvas} from '@terrylinla/react-native-sketch-canvas';
import {Observer} from 'mobx-react-lite';
import {
  Button as RButton,
  ButtonGroup,
  withTheme,
  Text as RText,
} from 'react-native-elements';
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <RButton
                title={'Save'}
                buttonStyle={{
                  ...styles.topButtonStyle,
                  backgroundColor: '#009b56',
                }}
                containerStyle={styles.topButtonContainerStyle}
                onPress={() => {
                  // TODO: save this whole object as document
                }}
              />
              <RButton
                title={'Delete Move'}
                buttonStyle={{
                  ...styles.topButtonStyle,
                  backgroundColor: 'red',
                }}
                containerStyle={{
                  ...styles.topButtonContainerStyle,
                  width: 100,
                }}
                onPress={() => {
                  playbook?.deleteMove();
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

          {playbook && (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: 'white', marginTop: 5}}>
                {playbook.currentMoveIndex + 1} of {playbook.moves.length} Moves
              </Text>
              <Slider
                style={{width: '80%', height: 20}}
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
          {!playbook.isPlaying && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <RButton
                title={'Prev'}
                buttonStyle={styles.topButtonStyle}
                containerStyle={styles.topButtonContainerStyle}
                onPress={() => {
                  playbook?.prev();
                }}
              />
              <RButton
                icon={{
                  ...styles.iconStyle,
                  name: 'times',
                }}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainerStyle}
                onPress={() => {
                  playbook?.currentMove?.clear();
                }}
              />
              <RButton
                icon={{
                  ...styles.iconStyle,
                  name: 'play',
                  color: 'white',
                }}
                buttonStyle={{
                  ...styles.buttonStyle,
                  backgroundColor: 'red',
                }}
                containerStyle={styles.buttonContainerStyle}
                onPress={() => {
                  playbook?.play();
                }}
              />
              <RButton
                icon={{
                  ...styles.iconStyle,
                  name: 'undo',
                }}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.buttonContainerStyle}
                onPress={() => {
                  playbook?.currentMove?.undo();
                }}
              />
              <RButton
                title={'Next'}
                buttonStyle={styles.topButtonStyle}
                containerStyle={styles.topButtonContainerStyle}
                onPress={() => {
                  playbook?.next(true);
                }}
              />
            </View>
          )}
          {playbook.isPlaying && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <RButton
                icon={{
                  ...styles.iconStyle,
                  name: 'step-backward',
                }}
                buttonStyle={{
                  ...styles.buttonStyle,
                }}
                containerStyle={styles.buttonContainerStyle}
                onPress={() => {
                  playbook?.replay();
                }}
              />
              {playbook.isPaused ? (
                <RButton
                  icon={{
                    ...styles.iconStyle,
                    name: 'play',
                    color: 'white',
                  }}
                  buttonStyle={{
                    ...styles.buttonStyle,
                    backgroundColor: 'red',
                  }}
                  containerStyle={styles.buttonContainerStyle}
                  onPress={() => {
                    playbook?.play();
                  }}
                />
              ) : (
                <RButton
                  icon={{
                    ...styles.iconStyle,
                    name: 'pause',
                  }}
                  buttonStyle={{
                    ...styles.buttonStyle,
                    backgroundColor: '#ddd',
                  }}
                  containerStyle={styles.buttonContainerStyle}
                  onPress={() => {
                    playbook?.pause();
                  }}
                />
              )}
              <RButton
                icon={{
                  ...styles.iconStyle,
                  name: 'stop',
                }}
                buttonStyle={{
                  ...styles.buttonStyle,
                }}
                containerStyle={styles.buttonContainerStyle}
                onPress={() => {
                  playbook?.stop();
                }}
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
    backgroundColor: '#181d35',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  dragDrop: {
    zIndex: 999999,
  },
  iconStyle: {
    type: 'font-awesome',
    size: 15,
    name: 'play',
    color: 'black',
  },
  buttonStyle: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
    borderRadius: 50,
  },
  buttonContainerStyle: {
    width: 60,
    height: 30,
    marginHorizontal: 5,
    marginVertical: 0,
  },
  topButtonStyle: {
    // backgroundColor: '#ffffff',
    borderWidth: 0,
    borderRadius: 50,
    padding: 3,
    marginTop: 5,
  },
  topButtonContainerStyle: {
    width: 80,
    height: 40,
    marginHorizontal: 5,
    marginVertical: 10,
  },
});
