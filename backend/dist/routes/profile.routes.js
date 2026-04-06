"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controllers/profile.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Apply requireAuth to all profile routes
router.use(auth_middleware_1.requireAuth);
router.get('/', profile_controller_1.getProfile);
router.post('/', profile_controller_1.updateProfile);
exports.default = router;
