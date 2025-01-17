import { OverlayToaster } from "@blueprintjs/core";
import { once } from "./once.ts"

export const getToaster = once(() => OverlayToaster.create());