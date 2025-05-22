import * as React from "react";
import Svg, { Path, Rect, Line } from "react-native-svg";

const Card = (props) => (
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
    class="lucide lucide-credit-card"
    {...props}
  >
    <Rect width="20" height="14" x="2" y="5" rx="2" />
    <Line x1="2" x2="22" y1="10" y2="10" />
  </Svg>
);

export default Card;
