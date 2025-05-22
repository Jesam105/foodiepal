import { View, Text } from 'react-native'
import React from 'react'
import Home from './Home';
import Mail from './Mail';
import Lock from './Lock';
import User from './User';
import Heart from './Heart';
import Plus from './Plus';
import Search from './Search';
import Location from './Location';
import Call from './Call';
import { theme } from '../../constants/theme';
import Camera from './Camera';
import Edit from './Edit';
import ArrowLeft from './ArrowLeft';
import ThreeDotsCircle from './ThreeDotsCircle';
import ThreeDotsHorizontal from './ThreeDotsHorizontal';
import Comment from './Comment';
import Share from './Share';
import Send from './Send';
import Delete from './Delete';
import Logout from './logout';
import Image from './Image';
import Video from './Video';
import Enter from './Enter';
import EyeOpen from './EyeOpen';
import EyeClose from './EyeClose';
import Description from './Description';
import Currency from './Currency'
import ChevronDoubleRight from './ChevronDoubleRight';
import ViewFinder from './ViewFinder';
import ArrowRight from './ArrowRight';
import Tick from './Tick';
import Cart from './Cart';
import Setting from './Setting';
import App from './App';
import Cancel from './Cancel';
import HeartSolid from './HeartSolid';
import Wallet from './Wallet';
import Review from './Review';
import Notification from './Notification';
import Error from './Error';
import Food from './Food';
import Card from './Card';
import AdminUser from './AdminUser';

const icons = {
    home: Home,
    mail: Mail,
    lock: Lock,
    user: User,
    heart: Heart,
    plus: Plus,
    search: Search,
    location: Location,
    call: Call,
    camera: Camera,
    edit: Edit,
    arrowLeft: ArrowLeft,
    threeDotsCircle: ThreeDotsCircle,
    threeDotsHorizontal: ThreeDotsHorizontal,
    comment: Comment,
    share: Share,
    send: Send,
    delete: Delete,
    logout: Logout,
    image: Image,
    video: Video,
    enter:Enter,
    eyeOpen:EyeOpen,
    eyeClose:EyeClose,
    description:Description,
    currency:Currency,
    chevronRight:ChevronDoubleRight,
    viewFinder:ViewFinder, 
    arrowRight: ArrowRight,
    tick: Tick,
    cart: Cart,
    setting: Setting,
    app: App,
    cancel: Cancel,
    heartSolid: HeartSolid,
    wallet: Wallet,
    review: Review,
    notification: Notification,
    error: Error,
    food: Food,
    card: Card,
    adminUser: AdminUser
}

const Icon = ({name, ...props}) => {
    const IconComponent = icons[name];
  return (
    <IconComponent
        height={props.size || 24}
        width={props.size || 24}
        strokeWidth={props.strokeWidth || 1.9}
        color={theme.colors.primary}
        {...props}
    />
  )
}

export default Icon;
