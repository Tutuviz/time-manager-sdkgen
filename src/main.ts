import { SdkgenHttpServer } from "@sdkgen/node-runtime";
import { api } from "./generated/api";
import "./controller";

const server = new SdkgenHttpServer(api, {});

server.listen(8000);
