import { DeviceState } from "../../Enums/DeviceState";

const FogConfig = {
  enabled: false,
  [DeviceState.Desktop]: {
    near: 18,
    far: 24,
  },
  [DeviceState.Mobile]: { 
    portrait: { near: 21, far: 25.5 },
    landscape: { near: 16, far: 20 },
  },
};

export default FogConfig;
