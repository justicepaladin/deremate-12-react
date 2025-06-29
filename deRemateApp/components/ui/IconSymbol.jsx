import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  person: "person",
  history: "history",
  qrcode: "qr-code-scanner",
  camera: "camera-alt",
  xmark: "close",
};

export function IconSymbol({ name, size = 24, color, style = null }) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
