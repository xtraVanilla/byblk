import React from "react";
import {
  Dimensions,
  ImageSourcePropType,
  ImageURISource,
  StyleSheet,
} from "react-native";
import Animated from "react-native-reanimated";

const { Extrapolate, interpolate } = Animated;
const { height: wHeight, width: wWidth } = Dimensions.get("window");

export const backgroundImage = require("./assets/background.jpeg");

export const HEADER_IMAGE_HEIGHT = wHeight / 3;
const styles = StyleSheet.create({
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: wWidth,
    resizeMode: "cover",
  },
});

interface HeaderImageProps {
  y: Animated.Value<number>;
  imageSrc:
    | number
    | ImageURISource
    | ImageURISource[]
    | Animated.Node<ImageSourcePropType>;
}

export default ({ y, imageSrc }: HeaderImageProps) => {
  const height = interpolate(y, {
    inputRange: [-100, 0],
    outputRange: [HEADER_IMAGE_HEIGHT + 100, HEADER_IMAGE_HEIGHT],
    extrapolateRight: Extrapolate.CLAMP,
  });
  const top = interpolate(y, {
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolateLeft: Extrapolate.CLAMP,
  });
  return (
    <Animated.Image source={imageSrc} style={[styles.image, { top, height }]} />
  );
};
