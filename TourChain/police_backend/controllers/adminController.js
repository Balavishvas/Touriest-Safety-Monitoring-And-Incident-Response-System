
const User = require('../models/User');
const Profile = require('../models/Profile');
const ActiveJourney = require('../models/ActiveJourney');
const PanicCall = require('../models/PanicCall');
const LocationHistory = require('../models/LocationHistory');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalTourists = await User.countDocuments({ role: 'Tourist' });
        const activeJourneys = await ActiveJourney.countDocuments({ status: { $in: ['Active', 'Panic'] } });
        const activePanics = await PanicCall.countDocuments({ status: 'Active', type: 'Manual' });
        const activeAnomalies = await PanicCall.countDocuments({ status: 'Active', type: 'AI-Anomaly' });
        res.json({ totalTourists, activeJourneys, activePanics, activeAnomalies });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllTourists = async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['phone', 'createdAt']);

        // Enhance with latest GPS from LocationHistory
        const tourists = await Promise.all(profiles.map(async (p) => {
            const activeJourney = await ActiveJourney.findOne({ user: p.user._id, status: { $in: ['Active', 'Panic'] } });
            let latestLoc = null;
            let status = 'safe';

            if (activeJourney) {
                status = activeJourney.status.toLowerCase();

                // If status is Panic, check if it's an AI Anomaly
                if (activeJourney.status === 'Panic') {
                    const latestPanic = await PanicCall.findOne({ journeyId: activeJourney._id, status: 'Active' }).sort({ createdAt: -1 });
                    if (latestPanic && latestPanic.type === 'AI-Anomaly') {
                        status = 'anomaly';
                    }
                }

                const history = await LocationHistory.findOne({ journeyId: activeJourney._id });
                if (history && history.locations.length > 0) {
                    latestLoc = history.locations[history.locations.length - 1];
                }
            }

            return {
                id: p.user._id,
                name: p.fullName,
                phone: p.user.phone,
                status: status,
                lat: latestLoc ? latestLoc.lat : null,
                lng: latestLoc ? latestLoc.lng : null,
                createdAt: p.user.createdAt
            };
        }));

        res.json(tourists);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.getPanicCalls = async (req, res) => {
    try {

        const panicCalls = await PanicCall.find().sort({ createdAt: -1 }).populate('userId', 'phone');
        res.json(panicCalls);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.updatePanicCallStatus = async (req, res) => {
    const { status } = req.body;

    if (!['Acknowledged', 'Resolved'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status.' });
    }

    try {
        const panicCall = await PanicCall.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );
        if (!panicCall) {
            return res.status(404).json({ message: 'Panic call not found.' });
        }
        res.json(panicCall);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.deletePanicCall = async (req, res) => {
    try {
        const panicCall = await PanicCall.findByIdAndDelete(req.params.id);
        if (!panicCall) {
            return res.status(404).json({ message: 'Panic call not found.' });
        }
        res.json({ message: 'Alert deleted successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.getJourneyLiveTrack = async (req, res) => {
    try {
        const history = await LocationHistory.findOne({ journeyId: req.params.journeyId });
        if (!history) {
            return res.status(404).json({ message: 'No location history found for this journey.' });
        }
        res.json(history.locations);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllJourneys = async (req, res) => {
    try {
        const journeys = await ActiveJourney.find().sort({ createdAt: -1 });
        // Map to field names expected by the frontend
        const formatted = journeys.map(j => ({
            journeyId: j._id,
            name: j.itinerary?.draftName || 'Unnamed Journey',
            status: j.status,
            touristId: j.user,
            createdAt: j.createdAt
        }));
        res.json(formatted);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

const EfirReport = require('../models/EfirReport');

exports.getEfirReports = async (req, res) => {
    try {

        const efirReports = await EfirReport.find()
            .sort({ createdAt: -1 })
            .populate('tourist', 'phone fullName')
            .populate('panicCall');

        res.json(efirReports);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.saveEfirReport = async (req, res) => {
    try {
        const { efirId, panicCallId, touristId, incidentLocation, description, actions } = req.body;

        // Check if report already exists for this panic call
        let report = await EfirReport.findOne({ panicCall: panicCallId });
        if (report) {
            return res.status(400).json({ message: 'Incident Report already exists for this panic alert.' });
        }

        report = new EfirReport({
            efirId,
            panicCall: panicCallId,
            tourist: touristId,
            incidentLocation,
            description,
            actions,
            status: 'Filed'
        });

        await report.save();
        res.json(report);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.verifyQrToken = async (req, res) => {
    try {
        const { token } = req.body;
        const journey = await ActiveJourney.findOne({ qrCodeToken: token }).populate('user', 'fullName phone');
        if (!journey) {
            return res.status(404).json({ message: 'Invalid or expired QR token.' });
        }

        res.json({
            success: true,
            touristName: journey.user.fullName,
            touristId: journey.user._id,
            status: journey.status,
            journeyId: journey._id
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

