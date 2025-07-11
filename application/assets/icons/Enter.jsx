import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const Enter = (props) => {
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={"#000000"}
    fill={"none"}
  >
    <Path
      d="M8.9835 1.99998C6.17689 2.06393 4.53758 2.33109 3.41752 3.44727C2.43723 4.42416 2.10954 5.79742 2 7.99998M15.0165 1.99998C17.8231 2.06393 19.4624 2.33109 20.5825 3.44727C21.5628 4.42416 21.8905 5.79742 22 7.99998M15.0165 22C17.8231 21.9361 19.4624 21.6689 20.5825 20.5527C21.5628 19.5758 21.8905 18.2026 22 16M8.9835 22C6.17689 21.9361 4.53758 21.6689 3.41752 20.5527C2.43723 19.5758 2.10954 18.2026 2 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 15L17 17M16 11.5C16 9.01468 13.9853 6.99998 11.5 6.99998C9.01469 6.99998 7 9.01468 7 11.5C7 13.9853 9.01469 16 11.5 16C13.9853 16 16 13.9853 16 11.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx="11.5"
      cy="9.5"
      r="1.5"
      stroke="currentColor"
      strokeWidth={props.strokeWidth}
    />
  </Svg>;
};

export default Enter;
