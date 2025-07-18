import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const Cancel = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-square-x"
    {...props}
  >
    <Rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <Path d="m15 9-6 6" />
    <Path d="m9 9 6 6" />
  </Svg>
);

export default Cancel;
