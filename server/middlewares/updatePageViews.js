const Statistic = require('../models/Statistic'); // 确保路径正确

async function updatePageViews(req, res, next) {
    try {
        const pageViewsStat = await Statistic.findOne({ title: "Site Visits" });
        if (pageViewsStat) {
            pageViewsStat.count += 1;
            await pageViewsStat.save();
        } else {
            // 如果没有找到相应的统计数据，就创建一个
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
    next(); // 确保请求继续处理
}

module.exports = updatePageViews;
