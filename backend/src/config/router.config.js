// const express = require("express");
const authRoutes = require("../modules/auth/auth.routes");
const router = require("express").Router();

router.use("/api/auth", authRoutes);


module.exports = router;
