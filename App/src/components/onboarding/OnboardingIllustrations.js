import Svg, { Circle, G, Path, Rect, Line } from 'react-native-svg';
import { colors } from '../../constants/themes';

const SIZE = 200;
const BG = colors.primaryLight;
const DARK = colors.primaryDark;
const SOFT = colors.primary;
const DEEP = '#0B6B3A';

export function BookStackIcon() {
  return (
    <Svg width={SIZE} height={SIZE} viewBox="0 0 200 200">
      <Circle cx="100" cy="100" r="92" fill={BG} />
      <Rect x="42" y="122" width="116" height="28" rx="9" fill={DARK} />
      <Rect x="50" y="92" width="100" height="30" rx="9" fill={SOFT} />
      <Rect x="58" y="62" width="84" height="30" rx="9" fill={DEEP} />
      <Rect x="70" y="48" width="7" height="30" rx="3" fill="#FFD166" />
      <Rect x="146" y="57" width="7" height="26" rx="3" fill="#FF9F1C" />
      <G stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.9">
        <Line x1="66" y1="132" x2="66" y2="140" />
        <Line x1="96" y1="132" x2="96" y2="140" />
      </G>
    </Svg>
  );
}

export function SearchDownloadIcon() {
  return (
    <Svg width={SIZE} height={SIZE} viewBox="0 0 200 200">
      <Circle cx="100" cy="100" r="92" fill={BG} />
      <Circle cx="78" cy="72" r="26" fill="none" stroke={DARK} strokeWidth="8" />
      <Line x1="97" y1="91" x2="115" y2="109" stroke={DARK} strokeWidth="8" strokeLinecap="round" />
      <Line x1="78" y1="98" x2="78" y2="130" stroke={DEEP} strokeWidth="7" strokeLinecap="round" />
      <Line x1="66" y1="120" x2="90" y2="120" stroke={DEEP} strokeWidth="7" strokeLinecap="round" />
      <Line x1="52" y1="142" x2="104" y2="142" stroke={DARK} strokeWidth="8" strokeLinecap="round" />
      <Rect x="108" y="84" width="40" height="52" rx="6" fill={SOFT} />
      <Line x1="124" y1="92" x2="132" y2="92" stroke={DARK} strokeWidth="6" strokeLinecap="round" />
      <Rect x="92" y="116" width="18" height="12" rx="6" fill="#FFFFFF" />
    </Svg>
  );
}

export function GlobeBookIcon() {
  return (
    <Svg width={SIZE} height={SIZE} viewBox="0 0 200 200">
      <Circle cx="100" cy="100" r="92" fill={BG} />
      <G stroke={SOFT} strokeWidth="7" strokeLinecap="round" fill="none">
        <Path d="M40 96 Q100 40 160 96" />
        <Path d="M40 128 Q100 176 160 128" />
      </G>
      <Path d="M118 52 Q132 84 132 108 Q132 132 118 162" fill="none" stroke={SOFT} strokeWidth="7" strokeLinecap="round" />
      <Rect x="70" y="62" width="54" height="96" rx="12" fill="#FFFFFF" stroke={DARK} strokeWidth="6" />
      <Rect x="80" y="72" width="34" height="58" rx="5" fill={SOFT} />
      <Line x1="80" y1="116" x2="114" y2="116" stroke={DARK} strokeWidth="4" strokeLinecap="round" />
      <Line x1="80" y1="126" x2="108" y2="126" stroke={DARK} strokeWidth="4" strokeLinecap="round" />
      <Circle cx="97" cy="146" r="6" fill={DARK} />
    </Svg>
  );
}