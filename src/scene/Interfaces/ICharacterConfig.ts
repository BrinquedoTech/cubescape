import { CubeRotationDirection } from "../Enums/CubeRotationDirection";
import { MoveDirection } from "../Enums/MoveDirection";

export type IMoveSurfaceDirectionConfig = {
    [key in MoveDirection]: {
        [key in CubeRotationDirection]: {
            x: number;
            y: number;
        };
    };
};
