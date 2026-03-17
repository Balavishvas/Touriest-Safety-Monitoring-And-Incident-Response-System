const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middlewares/authMiddleware');
const {
    getDashboardStats,
    getAllTourists,
    getPanicCalls,
    updatePanicCallStatus,
    getJourneyLiveTrack,
    getAllJourneys,
    getEfirReports,
    saveEfirReport,
    verifyQrToken,
    deletePanicCall
} = require('../controllers/adminController');


router.use(protectAdmin);


router.get('/stats', getDashboardStats);
router.get('/tourists', getAllTourists);
router.get('/panic-calls', getPanicCalls);
router.put('/panic-calls/:id/status', updatePanicCallStatus);
router.delete('/panic-calls/:id', deletePanicCall);
router.get('/journeys', getAllJourneys);
router.get('/journeys/:journeyId/live-track', getJourneyLiveTrack);


router.get('/efir-reports', getEfirReports);
router.post('/efir-reports', saveEfirReport);
router.post('/verify-qr', verifyQrToken);

module.exports = router;
