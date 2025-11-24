import Elysia from "elysia";
import { supplyRoutes } from "./supply";

export const pttRoutes = new Elysia().group("/ptt", (c) => c.use(supplyRoutes));
