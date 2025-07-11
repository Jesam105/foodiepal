import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const AdminUser = (props) => (
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
    class="lucide lucide-user-cog"
    {...props}
  >
    <Circle cx="18" cy="15" r="3" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M10 15H6a4 4 0 0 0-4 4v2" />
    <Path d="m21.7 16.4-.9-.3" />
    <Path d="m15.2 13.9-.9-.3" />
    <Path d="m16.6 18.7.3-.9" />
    <Path d="m19.1 12.2.3-.9" />
    <Path d="m19.6 18.7-.4-1" />
    <Path d="m16.8 12.3-.4-1" />
    <Path d="m14.3 16.6 1-.4" />
    <Path d="m20.7 13.8 1-.4" />
  </Svg>
);

export default AdminUser;
