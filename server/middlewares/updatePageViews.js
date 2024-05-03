const Statistic = require('../models/Statistic');

async function updatePageViews(req, res, next) {
    try {
        const pageViewsStat = await Statistic.findOne({ title: "Site Visits" });
        if (pageViewsStat) {
            pageViewsStat.count += 1;
            await pageViewsStat.save();
        } else {
            const newStat = new Statistic({
                title: "Site Visits",
                count: 1,
                description: "Total number of page views on the website",
                icon: "bi-eye"
            });
            await newStat.save();
        }
    } catch (error) {
        console.error('Error updating page views:', error);
    }
    next();
}

module.exports = updatePageViews;
