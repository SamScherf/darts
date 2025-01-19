import { OverlayToaster } from "@blueprintjs/core";
import { once } from "./once"

export const getToaster = once(() => OverlayToaster.createAsync());