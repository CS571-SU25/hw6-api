import fs from 'fs'

import express, { Express } from 'express';
import cookies from "cookie-parser";

import { CS571Initializer } from '@cs571/api-framework'
import HW6PublicConfig from './model/configs/hw6-public-config';
import HW6SecretConfig from './model/configs/hw6-secret-config';
import { CS571AllChatroomsRoute } from './routes/chatrooms';
import { CS571GetMessagesRoute } from './routes/get-messages';
import { CS571CreateMessageRoute } from './routes/create-message';
import { CS571DeleteMessageRoute } from './routes/delete-message';
import { CS571RegisterRoute } from './routes/register';
import { CS571LoginRoute } from './routes/login';
import { CS571LogoutRoute } from './routes/logout';
import { CS571WhoAmIRoute } from './routes/whoami';
import { CS571HW6DbConnector } from './services/hw6-db-connector';
import { CS571HW6TokenAgent } from './services/hw6-token-agent';
import { CS571PasswordsRoute } from './routes/passwords';

console.log("Welcome to HW6!");

const app: Express = express();

app.use(cookies());

// https://github.com/expressjs/express/issues/5275
declare module "express-serve-static-core" {
  export interface CookieOptions {
    partitioned?: boolean;
  }
}

const appBundle = CS571Initializer.init<HW6PublicConfig, HW6SecretConfig>(app, {
  allowNoAuth: [],
  skipAuth: false,
  skipCors: false
});

const db = new CS571HW6DbConnector(appBundle.config);
const ta = new CS571HW6TokenAgent(appBundle.config);

db.init();

const chatrooms = JSON.parse(fs.readFileSync('includes/chatrooms.json').toString());
const passwords = JSON.parse(fs.readFileSync(appBundle.config.PUBLIC_CONFIG.PASSWORDS_LOC).toString());

appBundle.router.addRoutes([
  new CS571AllChatroomsRoute(chatrooms, db),
  new CS571GetMessagesRoute(chatrooms, db),
  new CS571CreateMessageRoute(chatrooms, db, ta),
  new CS571DeleteMessageRoute(db, ta),
  new CS571RegisterRoute(db, ta, appBundle.config),
  new CS571LoginRoute(db, ta, appBundle.config),
  new CS571LogoutRoute(db, appBundle.config),
  new CS571WhoAmIRoute(db, ta),
  new CS571PasswordsRoute(passwords)
])

app.listen(appBundle.config.PORT, () => {
  console.log(`Running at :${appBundle.config.PORT}`);
});
