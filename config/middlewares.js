const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);
const env = require("dotenv").config();
const mysql = require('mysql2')
const express = require("express");
const session = require("express-session");

module.exports = {
    body,
    validationResult,
    bcrypt,
    salt,
    mysql,
    express,
    session,
    env
}