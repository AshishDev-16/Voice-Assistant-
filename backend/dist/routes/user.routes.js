"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Apply requireAuth to all user routes
router.use(auth_middleware_1.requireAuth);
router.post('/credentials', user_controller_1.saveCredentials);
router.post('/onboarding', user_controller_1.completeOnboarding);
router.post('/generate-knowledge', user_controller_1.generateKnowledgeDraft);
router.get('/templates', user_controller_1.getIndustryTemplate);
router.delete('/', user_controller_1.deleteUser);
exports.default = router;
