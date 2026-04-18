import express from "express";
import { z } from "zod";
import { AnalyticsEvent } from "../models/AnalyticsEvent.js";
import { Inquiry } from "../models/Inquiry.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

export const analyticsRouter = express.Router();

// Record analytics event
analyticsRouter.post("/event", async (req, res, next) => {
  try {
    const body = z
      .object({
        event: z.string().min(1).max(80),
        path: z.string().max(500).optional(),
        meta: z.record(z.string(), z.any()).optional(),
      })
      .parse(req.body);

    const createdEvent = await AnalyticsEvent.create(body);

    // Keep console log for dev observability
    // eslint-disable-next-line no-console
    console.log("analytics:event", body.event, body.path ?? "");

    return res.status(202).json({ ok: true, id: createdEvent._id });
  } catch (err) {
    return next(err);
  }
});

// Admin: Get Analytics Dashboard stats
analyticsRouter.get("/dashboard", requireAdmin, async (req, res, next) => {
  try {
    const daysParam = parseInt(req.query.days, 10);
    const days = isNaN(daysParam) || daysParam <= 0 ? 30 : daysParam;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - days);

    const [pageViews, recentInquiriesCount, latestInquiries] = await Promise.all([
      AnalyticsEvent.countDocuments({ event: "page_view", createdAt: { $gte: targetDate } }),
      Inquiry.countDocuments({ createdAt: { $gte: targetDate } }),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).lean()
    ]);

    // ── 1. Area Data Pipeline ──
    const dailyAgg = await AnalyticsEvent.aggregate([
      { $match: { event: "page_view", createdAt: { $gte: targetDate } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, views: { $sum: 1 } } },
    ]);
    const areaMap = new Map(dailyAgg.map(d => [d._id, d.views]));
    const areaData = [];
    for (let i = 0; i < days; i++) {
       const d = new Date(targetDate);
       d.setDate(d.getDate() + i);
       const dateString = d.toISOString().split("T")[0];
       areaData.push({
         name: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
         views: areaMap.get(dateString) || 0
       });
    }

    // ── 2. Source Data Pipeline ──
    const sourceAgg = await AnalyticsEvent.aggregate([
      { $match: { event: "page_view", createdAt: { $gte: targetDate } } },
      { $group: { _id: "$meta.referrer", count: { $sum: 1 } } }
    ]);
    let direct = 0, search = 0, social = 0, referral = 0;
    sourceAgg.forEach(doc => {
      const ref = String(doc._id || "").toLowerCase();
      if (!ref || ref === "direct") direct += doc.count;
      else if (ref.includes("google") || ref.includes("bing") || ref.includes("yahoo")) search += doc.count;
      else if (ref.includes("facebook") || ref.includes("instagram") || ref.includes("twitter") || ref.includes("t.co")) social += doc.count;
      else referral += doc.count;
    });
    const sourceData = [
      { name: "Direct Search", value: direct, color: "#3b82f6" },
      { name: "Social Media", value: social, color: "#f59e0b" },
      { name: "Search Engine", value: search, color: "#10b981" },
      { name: "Referral", value: referral, color: "#6366f1" },
    ].filter(s => s.value > 0);

    // ── 3. Regional (Country) Pipeline ──
    const countryAgg = await AnalyticsEvent.aggregate([
      { $match: { event: "page_view", createdAt: { $gte: targetDate } } },
      { $group: { _id: "$meta.timezone", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);
    const formatTimezone = (tz) => tz ? tz.split("/").pop().replace(/_/g, " ") : "Unknown";
    const countryData = countryAgg.map(c => ({
      name: formatTimezone(c._id),
      value: c.count
    }));

    // ── 4. Weekly Heatmap Pipeline ──
    const heatmapAgg = await AnalyticsEvent.aggregate([
      { $match: { event: "page_view", createdAt: { $gte: targetDate } } },
      { $project: { dayOfWeek: { $dayOfWeek: "$createdAt" }, hour: { $hour: "$createdAt" } } },
      { $group: { _id: { day: "$dayOfWeek", hour: "$hour" }, count: { $sum: 1 } } }
    ]);
    
    // Map DOW (1=Sun, 7=Sat) to Mon-Sun
    const daysArr = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const timesArr = [{label: "9am", range:[0,11]}, {label:"12pm", range:[11,14]}, {label:"3pm", range:[14,17]}, {label:"6pm", range:[17,23]}];
    
    const activityHeatmap = timesArr.map(tBlock => {
      return {
        time: tBlock.label,
        data: daysArr.map((dName, dayIdx) => {
           // MongoDB $dayOfWeek: Sun = 1, Mon = 2
           const mongoDay = dayIdx === 6 ? 1 : dayIdx + 2; 
           let val = 0;
           heatmapAgg.forEach(h => {
             if (h._id.day === mongoDay && h._id.hour >= tBlock.range[0] && h._id.hour < tBlock.range[1]) {
               val += h.count;
             }
           });
           // normalize to 0-3 scale
           const intensity = val === 0 ? 0 : val < 5 ? 1 : val < 15 ? 2 : 3;
           return { day: dName, value: intensity };
        })
      };
    });

    const rawConversion = pageViews > 0 ? (recentInquiriesCount / pageViews) * 100 : 0;
    const conversionRate = Math.min(rawConversion, 100).toFixed(1);

    return res.json({ 
      ok: true, 
      stats: {
        period: "Last 30 Days",
        pageViews,
        inquiries: recentInquiriesCount,
        conversionRate: parseFloat(conversionRate),
        latestInquiries,
        areaData,
        sourceData,
        countryData,
        activityHeatmap
      }
    });
  } catch (err) {
    return next(err);
  }
});

