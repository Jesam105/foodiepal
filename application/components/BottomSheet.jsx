import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const BottomSheet = () => {
  return (
    <View style={styles.bottomSheetContainer}>
      <View style={styles.line} />
    </View>
  );
};
const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: "blue",
    position: "absolute",
    top: SCREEN_HEIGHT / 1.5,
    borderRadius: 25,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    alignSelf: "center",
    marginVertical: 15,
  },
});

export default BottomSheet;
