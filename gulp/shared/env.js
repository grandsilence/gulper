"use strict";

const fs = require("fs");

if (!fs.existsSync(".env")) {
    console.log("ВНИМАНИЕ: .env не найден, будет создан новый из _.example.env. " + 
    "Отредактируйте .env и перезапустите приложение");   
    
    fs.copyFileSync("_.example.env", ".env");
    process.exit(1);
}

require('dotenv').config();
