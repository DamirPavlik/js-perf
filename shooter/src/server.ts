import { createGameRunner, onClose, onMessage } from "./game";
import * as consts from "./game/consts";
import { getConfig } from "./cli";
import { getLogger, initLogger } from "./logger";
import { getWriter } from "./game/data-writer";

import * as uws from "uWebSockets.js"

const args = getConfig();
consts.initFromEnv();
consts.initFromCLI(args);
initLogger(args);
getWriter(args);

const runner = createGameRunner();

getLogger().info(args, "starting server");

uws.App().ws('/*', {
    close: (ws) => {
        onClose(ws)
    },

    open: (ws) => {
        runner(ws)
    },

    message: (ws, message, isBinary) => {
        onMessage(ws, Buffer.from(message).toString())
    }
    
  }).listen(42069, (listenSocket) => {
    if (listenSocket) {
        getLogger().info("listening on", args.port);
        console.log("listening on", args.port);
    } else {
        getLogger().error("cannot start server");
        console.error("cannot start server");
    }
    
});

