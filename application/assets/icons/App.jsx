import * as React from "react";
import Svg, { Path, Circle, Rect } from "react-native-svg";

const App = (props) => (
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
    class="lucide lucide-layout-grid"
    {...props}
  >
    <Rect width="7" height="7" x="3" y="3" rx="1" />
    <Rect width="7" height="7" x="14" y="3" rx="1" />
    <Rect width="7" height="7" x="14" y="14" rx="1" />
    <Rect width="7" height="7" x="3" y="14" rx="1" />
  </Svg>
);

export default App;
