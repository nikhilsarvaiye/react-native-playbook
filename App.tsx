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
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  Text,
  TouchableOpacity,
  Button,
} from 'react-native';

import Canvas, {
  Image as CanvasImage,
  Path2D,
  ImageData,
} from 'react-native-canvas';
import Draggable from 'react-native-draggable';
import {SketchCanvas} from '@terrylinla/react-native-sketch-canvas';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import ViewShot, {captureRef} from 'react-native-view-shot';

const Example = ({sample, children}: any) => (
  <View style={styles.example}>
    <View style={styles.exampleLeft}>{children}</View>
    <View style={styles.exampleRight}>
      <Image source={sample} style={{width: 100, height: 100}} />
    </View>
  </View>
);

const App = () => {
  const handleImageData = (canvas: Canvas) => {
    canvas.width = 100;
    canvas.height = 100;

    const context = canvas.getContext('2d');
    context.fillStyle = 'purple';
    context.fillRect(0, 0, 100, 100);

    context.getImageData(0, 0, 100, 100).then(imageData => {
      const data = Object.values(imageData.data);
      const length = Object.keys(data).length;
      for (let i = 0; i < length; i += 4) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
      }
      const imgData = new ImageData(canvas, data, 100, 100);
      context.putImageData(imgData, 0, 0);
    });
  };

  const handlePurpleRect = async (canvas: Canvas) => {
    canvas.width = 1000;
    canvas.height = 1000;

    const context = canvas.getContext('2d');

    // context.fillStyle = 'purple';
    // context.fillRect(0, 0, 1000, 1000);

    const {width} = await context.measureText('yo');
  };

  const handleRedCircle = (canvas: Canvas) => {
    canvas.width = 100;
    canvas.height = 100;

    const context = canvas.getContext('2d');

    context.fillStyle = 'red';
    context.arc(50, 50, 49, 0, Math.PI * 2, true);
    context.fill();
  };

  const handleImageRect = (canvas: Canvas) => {
    const image = new CanvasImage(canvas);
    canvas.width = 100;
    canvas.height = 100;

    const context = canvas.getContext('2d');

    image.src =
      'https://upload.wikimedia.org/wikipedia/commons/6/63/Biho_Takashi._Bat_Before_the_Moon%2C_ca._1910.jpg';
    image.addEventListener('load', () => {
      context.drawImage(image, 0, 0, 100, 100);
    });

    image.addEventListener('mouseup', () => {
      alert('mouse up');
    });

    image.addEventListener('load', () => {
      context.drawImage(image, 0, 0, 100, 100);
    });
  };

  const handlePath = (canvas: Canvas) => {
    canvas.width = 100;
    canvas.height = 100;
    const context = canvas.getContext('2d');

    context.fillStyle = 'red';
    context.fillRect(0, 0, 100, 100);

    const ellipse = new Path2D(canvas);
    ellipse.ellipse(50, 50, 25, 35, (45 * Math.PI) / 180, 0, 2 * Math.PI);
    context.fillStyle = 'purple';
    context.fill(ellipse);

    context.save();
    context.scale(0.5, 0.5);
    context.translate(50, 20);
    const rectPath = new Path2D(canvas, 'M10 10 h 80 v 80 h -80 Z');

    context.fillStyle = 'pink';
    context.fill(rectPath);
    context.restore();
  };

  const handleGradient = async (canvas: Canvas) => {
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    const gradient = await ctx.createLinearGradient(0, 0, 200, 0);
    gradient.addColorStop(0, 'green');
    gradient.addColorStop(1, 'white');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 100, 100);
  };

  const handleEmbedHTML = (canvas: Canvas) => {
    const image = new CanvasImage(canvas);
    canvas.width = 100;
    canvas.height = 100;

    const context = canvas.getContext('2d');

    const htmlString = '<b>Hello, World!</b>';
    const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 40px; background: lightblue; width: 100vw; height: 100vh;">
          <span style="background: pink;">
            ${htmlString}
          </span>
        </div>
    </foreignObject>
</svg>
`;
    image.src = `data:image/svg+xml,${encodeURIComponent(svgString)}`;

    image.addEventListener('load', () => {
      context.drawImage(image, 0, 0, 100, 100);
    });
  };

  const onPressButton = () => {
    // alert('You tapped the button!');
  };

  let canvasMain: Canvas = null;

  const handleCanvas = async (canvas: Canvas) => {
    canvas.width = 1000;
    canvas.height = 1000;

    canvasMain = canvas;

    const context = canvas.getContext('2d');

    context.fillStyle = 'purple';
    // context.fillRect(0, 0, 1000, 1000);

    // const {width} = await context.measureText('yo');
  };

  function drawLines(ctx, pts) {
    ctx.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length - 1; i += 2) {
      ctx.lineTo(pts[i], pts[i + 1]);
    }
  }

  const history = [];
  const movements = [];

  const refs = useRef<ViewShot>();

  const capture = () => {
    if (refs?.current != null) {
      console.clear();
      console.log('s');
      captureRef(refs, {
        result: 'base64',
      }).then(
        uri => console.log('Image saved to', uri),
        error => console.error('Oops, snapshot failed', error),
      );
      const uri = refs.current?.capture();
      console.log(uri);
    }
  };

  const sketchBoard = useRef<SketchCanvas>();
  const save = () => {
    if (sketchBoard?.current != null) {
      const uri = sketchBoard.current?.save(
        'png',
        false,
        'RNSketchCanvas',
        String(Math.ceil(Math.random() * 100000000)),
        true,
        true,
        true,
      );
      alert(uri);
    }
  };

  return (
    // <ViewShot
    //   ref={refs}
    //   options={{format: 'jpg', quality: 0.9}}
    //   onCapture={(uri: string) => {
    //     alert(uri);
    //   }}>

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
          ref={refs}
          options={{}}
          onCapture={(uri: string) => {
            console.log(uri);
          }}>
          <Button
            title="Shot"
            onPress={e => {
              capture();
            }}></Button>
          <View
            style={{
              position: 'absolute',
              zIndex: 9999999,
            }}>
            <Draggable
              x={75}
              y={100}
              renderSize={56}
              renderColor="black"
              renderText="DDDDD me"
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
            children={
              <View>
                <Draggable x={300} y={300} renderColor="blue" renderText="D" />
              </View>
            }
            containerStyle={{backgroundColor: 'white', flex: 1}}
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
            }}></RNSketchCanvas>
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
});

export default App;
