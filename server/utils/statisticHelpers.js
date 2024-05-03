const Statistic = require('../models/Statistic');

async function incrementPublishCount() {
    try {
        const stat = await Statistic.findOne({ title: "Published Articles" });
        if (stat) {
            stat.count += 1;
            await stat.save();
        } else {
            const newStat = new Statistic({
                title: "Published Articles",
                count: 1,
                description: "Total articles published on our blog",
                icon: "bi-journal-check"
            });
            await newStat.save();
        }
    } catch (error) {
    }
}

module.exports = {
    incrementPublishCount
};
