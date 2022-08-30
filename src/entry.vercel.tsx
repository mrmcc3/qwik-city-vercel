import { qwikCity } from "@builder.io/qwik-city/middleware/vercel-edge";
import render from "./entry.ssr";

export default qwikCity(render);
