import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- 3D MATH HELPERS (PCA) ---
export const computePCA = (vectors) => {
    if (!vectors || vectors.length === 0) return [];

    // 1. Center the data
    const mean = vectors[0].map((_, i) => vectors.reduce((a, b) => a + b[i], 0) / vectors.length);
    const centered = vectors.map(v => v.map((val, i) => val - mean[i]));

    // 2. Simplified projection (Random Projection method)
    const dim = vectors[0].length;
    const basis = [[], [], []];
    for (let i = 0; i < dim; i++) {
        basis[0].push(Math.sin(i));
        basis[1].push(Math.cos(i * 1.5));
        basis[2].push(Math.sin(i * 2.5));
    }

    return centered.map((v, idx) => {
        const x = v.reduce((sum, val, i) => sum + val * basis[0][i], 0);
        const y = v.reduce((sum, val, i) => sum + val * basis[1][i], 0);
        const z = v.reduce((sum, val, i) => sum + val * basis[2][i], 0);
        return { x, y, z, originalIndex: idx };
    });
};

// --- INSIGHTS COMPUTATION ---

/**
 * Compute mood-activity correlation insights from chart data
 * @param {Array} correlationData - Array of {name, avgMoodScore, moodChange, activityCount}
 * @returns {Object} Summary object with insights
 */
export const computeMoodActivityInsights = (correlationData) => {
    if (!correlationData || correlationData.length === 0) return null;

    const byAvg = [...correlationData].sort((a, b) => b.avgMoodScore - a.avgMoodScore);
    const byChange = [...correlationData].sort((a, b) => b.moodChange - a.moodChange);
    const byCount = [...correlationData].sort((a, b) => b.activityCount - a.activityCount);

    const topLiked = byAvg[0];
    const topDuringNegative = byAvg[byAvg.length - 1];
    const topImprover = byChange[0];
    const topWorse = byChange[byChange.length - 1];
    const mostFrequent = byCount[0];

    const totalActivities = correlationData.length;
    const totalEngagements = correlationData.reduce((sum, d) => sum + (d.activityCount || 0), 0);
    const avgEngagementPerActivity = totalEngagements > 0 ? Math.round(totalEngagements / totalActivities) : 0;
    const avgMoodOverall = Math.round(correlationData.reduce((sum, d) => sum + (d.avgMoodScore || 0), 0) / totalActivities);

    return {
        topLiked,
        topDuringNegative,
        topImprover,
        topWorse,
        mostFrequent,
        totalActivities,
        totalEngagements,
        avgEngagementPerActivity,
        avgMoodOverall
    };
};

// --- REPORT GENERATION ---

export const generateCSV = (data, filename = "report.csv") => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(obj => Object.values(obj).map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
};

/**
 * Generates a PDF report with charts (images) and data tables.
 * @param {string} userName - Name of the user
 * @param {Object} images - { scoreChart, distChart, pieChart, moodChart, etc. }
 * @param {Array} emotionalLogs - Array of emotional log objects
 * @param {Array} activityLogs - Array of activity log objects
 * @param {Object} moodActivityInsights - Optional quick insights from mood-activity correlation
 */
export const generatePDFReport = (userName, images, emotionalLogs, activityLogs, moodActivityInsights = null) => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    let yPos = 20;

    // --- COLOR PALETTE (Light Theme) ---
    const primaryColor = [43, 54, 116]; // Dark Navy for Headers
    const secondaryColor = [100, 100, 100]; // Dark Grey for text

    // --- HEADER ---
    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);
    doc.text(`Well-Being Report`, margin, yPos);

    yPos += 10;
    doc.setFontSize(11);
    doc.setTextColor(...secondaryColor);
    doc.text(`User: ${userName}`, margin, yPos);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPos + 6);
    yPos += 15;

    // Separator Line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    // --- VISUAL ANALYTICS SECTION ---
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text("Visual Analytics Overview", margin, yPos);
    yPos += 15;

    const addTitle = (title) => {
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0); // black
        doc.text(title, margin, yPos);
        yPos += 2;
    }

    const addChartToPdf = (imgData) => {
        if (!imgData) return;

        // 1. Get image dimensions
        const props = doc.getImageProperties(imgData);
        const ratio = props.width / props.height;

        // 2. Get page size
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // 3. Max width = full page width minus margins
        const maxWidth = pageWidth - margin * 2;

        // 4. Scale image to max width, keep aspect ratio
        let w = maxWidth;
        let h = w / ratio;

        // 5. Auto page break if image exceeds page height
        if (yPos + h > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
        }

        // 6. Center horizontally
        const xPos = margin;

        // 7. Add image
        doc.addImage(imgData, 'PNG', xPos, yPos, w, h);

        // 8. Advance cursor
        yPos += h + 25;
    };

    // Helper for Table Page Breaks
    const checkPageBreak = (neededSpace = 30) => {
        if (yPos + neededSpace > 280) {
            doc.addPage();
            yPos = 20;
        }
    };

    // Add charts sequentially
    if (images.pieChart) addChartToPdf(images.pieChart);
    if (images.widgets) addTitle("Emotion Summary");
    if (images.widgets) addChartToPdf(images.widgets);
    if (images.scoreChart) addChartToPdf(images.scoreChart);
    if (images.distChart) addChartToPdf(images.distChart);
    if (images.moodChart) addChartToPdf(images.moodChart);

    // --- MOOD-ACTIVITY INSIGHTS SECTION ---
    if (moodActivityInsights) {
        const yPosBefore = yPos;
        checkPageBreak(50);
        const pageBreakHappened = yPos !== yPosBefore;

        // Add spacing before insights only if no page break
        if (!pageBreakHappened) {
            yPos -= 15;
        }

        doc.setFontSize(12);
        doc.setTextColor(...primaryColor);
        doc.text("Quick Insights", margin, yPos);
        yPos += 8;

        let boxY = yPos;

        // Positive engagement
        if (moodActivityInsights.topLiked) {
            doc.setFontSize(9);
            doc.setTextColor(...primaryColor);
            doc.text("• When you feel positive:", margin, boxY);
            boxY += 4;
            doc.setFontSize(8);
            doc.setTextColor(...secondaryColor);
            doc.text(`You engage with ${moodActivityInsights.topLiked.name} (${moodActivityInsights.topLiked.avgMoodScore}% avg)`, margin + 2, boxY, { maxWidth: pageWidth - margin * 2 - 2 });
            boxY += 6;
        }

        // Mood booster
        if (moodActivityInsights.topImprover) {
            doc.setFontSize(9);
            doc.setTextColor(...primaryColor);
            doc.text("• Mood booster:", margin, boxY);
            boxY += 4;
            doc.setFontSize(8);
            doc.setTextColor(...secondaryColor);
            doc.text(`${moodActivityInsights.topImprover.name} increases mood +${moodActivityInsights.topImprover.moodChange}`, margin + 2, boxY, { maxWidth: pageWidth - margin * 2 - 2 });
            boxY += 6;
        }

        // Consider limiting
        if (moodActivityInsights.topWorse && moodActivityInsights.topWorse.moodChange < 0) {
            doc.setFontSize(9);
            doc.setTextColor(...primaryColor);
            doc.text("• Consider limiting:", margin, boxY);
            boxY += 4;
            doc.setFontSize(8);
            doc.setTextColor(...secondaryColor);
            doc.text(`${moodActivityInsights.topWorse.name} may lower mood ${moodActivityInsights.topWorse.moodChange}`, margin + 2, boxY, { maxWidth: pageWidth - margin * 2 - 2 });
            boxY += 6;
        }
        // Stats
        boxY += 2;
        doc.setFontSize(8);
        doc.setTextColor(...secondaryColor);
        const statsLines = [
            `Total Engagements: ${moodActivityInsights.totalEngagements}`,
            `Avg Frequency: ${moodActivityInsights.avgEngagementPerActivity} per activity`,
            `Overall Mood: ${moodActivityInsights.avgMoodOverall}%`,
            `Activities Tracked: ${moodActivityInsights.totalActivities}`
        ];
        statsLines.forEach((line, i) => {
            doc.text(line, margin, boxY);
            boxY += 3;
        });

        yPos = boxY + 25;
    }

    // --- EMOTIONAL LOGS TABLE ---
    if (emotionalLogs && emotionalLogs.length > 0) {
        checkPageBreak();
        yPos += 10;
        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.text("Emotional History", margin, yPos);
        yPos += 5;

        const tableColumn = ["Time", "Emotion", "Mood Score", "Confidence"];
        const tableRows = emotionalLogs.map(log => [
            new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
            log.emotion_label,
            log.emotional_score !== null ? log.emotional_score : "-",
            log.confidence_score !== null ? `${Math.round(log.confidence_score * 100)}%` : "-"
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: yPos,
            theme: 'striped', // Standard clean look
            headStyles: {
                fillColor: primaryColor,
                textColor: 255,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 10,
                cellPadding: 4,
                textColor: 50
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250] // Very light grey for readability
            },
        });

        yPos = doc.lastAutoTable.finalY + 15;
    }

    // --- ACTIVITY LOGS TABLE ---
    if (activityLogs && activityLogs.length > 0) {
        checkPageBreak();

        // Ensure header doesn't get orphaned at bottom of page
        if (yPos > 250) { doc.addPage(); yPos = 20; }

        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.text("Intervention Activities", margin, yPos);
        yPos += 5;

        const tableColumn = ["Time", "Activity", "Duration", "Mood Impact"];
        const tableRows = activityLogs.map(log => {
            const moodChange = log.mood_rating && log.mood_rating.length >= 2
                ? (log.mood_rating[1] - log.mood_rating[0])
                : 0;
            const sign = moodChange > 0 ? "+" : "";

            return [
                new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
                log.intervention_type,
                log.duration || "-",
                `${sign}${moodChange}`
            ];
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: yPos,
            theme: 'striped',
            headStyles: {
                fillColor: primaryColor,
                textColor: 255,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 10,
                cellPadding: 4,
                textColor: 50
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250]
            },
        });
    }

    doc.save(`WellBeing_Report_${userName}_${new Date().toISOString().split('T')[0]}.pdf`);
};