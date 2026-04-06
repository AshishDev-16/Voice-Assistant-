"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Apply requireAuth to all dashboard routes
router.use(auth_middleware_1.requireAuth);
router.get('/stats', dashboard_controller_1.getDashboardStats);
router.get('/intelligence', dashboard_controller_1.getIntelligence);
router.get('/usage', dashboard_controller_1.getUsage);
exports.default = router;
