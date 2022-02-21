/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import Draggable from 'react-native-draggable';
import RNSketchCanvas, {
  SketchCanvas,
} from '@terrylinla/react-native-sketch-canvas';
import ViewShot, {captureRef} from 'react-native-view-shot';

const App = () => {
  const canvas = useRef<ViewShot>();

  const capture = () => {
    if (canvas?.current != null) {
      console.clear();
      captureRef(canvas, {
        result: 'base64',
      }).then(
        uri => console.log('Image saved to', uri),
        error => console.error('Oops, snapshot failed', error),
      );
      const uri = canvas.current.capture();
      console.log(uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        {/* <SketchCanvas
          ref={sketchBoard}
          style={{flex: 1}}
          strokeColor={'red'}
          strokeWidth={7}
          children={
            <View>
              <Text>...D to rasterize...</Text>
            </View>
          }></SketchCanvas> */}

        <ViewShot
          ref={canvas}
          options={{}}
          onCapture={(uri: string) => {
            console.log(uri);
          }}>
          <Button
            title="Capture"
            onPress={e => {
              capture();
            }}
          />
          <View style={styles.dragDrop}>
            <Draggable
              x={75}
              y={100}
              renderSize={45}
              renderColor="#5B6FD2"
              renderText="Drag"
              isCircle
              // shouldReverse
              onLongPress={() => console.log('long press')}
              onShortPressRelease={() => console.log('press drag')}
              onPressIn={() => console.log('in press')}
              onPressOut={() => console.log('out press')}
            />
            <Draggable x={200} y={300} renderColor="red" renderText="B" />
            <Draggable />
          </View>
          <RNSketchCanvas
            localSourceImage={
              {
                filename: 'playbook.png', // 'playbook.png',
                directory: RNSketchCanvas.MAIN_BUNDLE,
                mode: 'AspectFit',
              } as any
            }
            containerStyle={{backgroundColor: 'transparent', flex: 1}}
            canvasStyle={{backgroundColor: 'transparent', flex: 1}}
            defaultStrokeIndex={0}
            defaultStrokeWidth={5}
            closeComponent={
              <View style={styles.functionButton}>
                <Text style={{color: 'white'}}>Close</Text>
              </View>
            }
            undoComponent={
              <View style={styles.functionButton}>
                <Text style={{color: 'white'}}>Undo</Text>
              </View>
            }
            clearComponent={
              <View style={styles.functionButton}>
                <Text style={{color: 'white'}}>Clear</Text>
              </View>
            }
            eraseComponent={
              <View style={styles.functionButton}>
                <Text style={{color: 'white'}}>Eraser</Text>
              </View>
            }
            strokeComponent={color => (
              <View
                style={[{backgroundColor: color}, styles.strokeColorButton]}
              />
            )}
            strokeSelectedComponent={(color, index, changed) => {
              return (
                <View
                  style={[
                    {backgroundColor: color, borderWidth: 2},
                    styles.strokeColorButton,
                  ]}
                />
              );
            }}
            strokeWidthComponent={w => {
              return (
                <View style={styles.strokeWidthButton}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      marginHorizontal: 2.5,
                      width: Math.sqrt(w / 3) * 10,
                      height: Math.sqrt(w / 3) * 10,
                      borderRadius: (Math.sqrt(w / 3) * 10) / 2,
                    }}
                  />
                </View>
              );
            }}
            saveComponent={
              <View style={styles.functionButton}>
                <Text style={{color: 'white'}}>Save</Text>
              </View>
            }
            savePreference={() => {
              return {
                folder: 'RNSketchCanvas',
                filename: String(Math.ceil(Math.random() * 100000000)),
                transparent: false,
                imageType: 'png',
                cropToImageSize: true,
              };
            }}
          />
        </ViewShot>
      </View>
    </View>
  );
};

const commonStyles = StyleSheet.create({
  full: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  cell: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    backgroundColor: 'white',
    ...commonStyles.full,
  },
  examples: {
    ...commonStyles.full,
    padding: 5,
    paddingBottom: 0,
  },
  example: {
    paddingBottom: 5,
    flex: 1,
    flexDirection: 'row',
  },
  exampleLeft: {
    ...commonStyles.cell,
  },
  exampleRight: {
    ...commonStyles.cell,
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
  strokeColorButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  strokeWidthButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#39579A',
  },
  functionButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    height: 30,
    width: 60,
    backgroundColor: '#39579A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  dragDrop: {
    zIndex: 999999,
  },
});

export default App;
