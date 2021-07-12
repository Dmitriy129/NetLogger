import * as http from 'http'

import { ServerMiddleware as NTServerMiddleware } from "@nuxt/types";

export type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;
export type ServerMiddlewareArgumentsType = ArgumentTypes<NTServerMiddleware>


export class IncomingMessage extends http.IncomingMessage {
    originalUrl?: http.IncomingMessage["url"];
    body: any
}


type ServerMiddleware = (req: IncomingMessage, res: ServerMiddlewareArgumentsType[1], next: ServerMiddlewareArgumentsType[2]) => void;

export default ServerMiddleware