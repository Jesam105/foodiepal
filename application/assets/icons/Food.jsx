import { View, Text } from "react-native";
import React from "react";
import Svg, { Path } from "react-native-svg";

const Food = (props) => (
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
    class="lucide lucide-soup"
    {...props}
  >
    <Path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
    <Path d="M7 21h10" />
    <Path d="M19.5 12 22 6" />
    <Path d="M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62" />
    <Path d="M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62" />
    <Path d="M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62" />
  </Svg>
);

export default Food;
