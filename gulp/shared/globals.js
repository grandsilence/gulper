"use strict";

const path = require("path");

global.__baseDir = path.resolve(path.resolve(__dirname, '../..'));
global.__aPath = (...absolutePath) => path.join(global.__baseDir, ...absolutePath);
//global.__aRequire = (absolutePath) => require(global.__aPath(absolutePath));
    
global.__env = process.env;

global.__developentEnv = global.__env.ENV === 'development' || global.__env.ENV === 'local';
global.__productionEnv = !global.__developentEnv; // process.env === 'production';    
