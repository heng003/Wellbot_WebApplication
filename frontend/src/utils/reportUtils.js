import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import NotoSansSC from '../font/NotoSansSC-VariableFont_wght.ttf';

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
 * @param {Function} t - Translation function
 */
export const generatePDFReport = async (userName, images, moodActivityInsights = null, messagePatternInsights = null, emotionalLogs, activityLogs, dateRange = null, t) => {
    const doc = new jsPDF();
    const safeT = t || ((k) => k); // Fallback

    // Load Custom Font for Chinese Support
    try {
        const response = await fetch(NotoSansSC);
        const blob = await response.blob();
        const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
        });

        doc.addFileToVFS("CustomFont.ttf", base64);
        doc.addFont("CustomFont.ttf", "CustomFont", "normal");
        doc.addFont("CustomFont.ttf", "CustomFont", "bold");
        doc.addFont("CustomFont.ttf", "CustomFont", "italic");
        doc.addFont("CustomFont.ttf", "CustomFont", "bolditalic");
        doc.setFont("CustomFont");
        console.log("Custom Chinese Font Loaded Successfully");
    } catch (e) {
        console.error("Failed to load custom font, falling back to default.", e);
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;

    // --- COLOR PALETTE (Light Theme) ---
    const primaryColor = [43, 54, 116]; // Dark Navy for Headers
    const secondaryColor = [100, 100, 100]; // Dark Grey for text
    const accentColor = [81, 154, 246]; // Brand Blue

    // --- 1. TITLE PAGE ---
    // Background decoration (optional subtle branding line)
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(1);
    doc.line(margin, 40, pageWidth - margin, 40);

    // Title
    doc.setFontSize(26);
    doc.setTextColor(...primaryColor);
    doc.setFont("CustomFont");
    doc.text(safeT('report.pdf.title'), pageWidth / 2, 80, { align: "center" });

    // Subtitle / User Info
    doc.setFontSize(14);
    doc.setFont("CustomFont");
    doc.setTextColor(...secondaryColor);
    doc.text(safeT('report.pdf.prepared_for'), pageWidth / 2, 100, { align: "center" });

    doc.setFontSize(18);
    doc.setTextColor(...primaryColor);
    doc.setFont("CustomFont");
    doc.text(userName, pageWidth / 2, 110, { align: "center" });

    // Date Range
    if (dateRange && dateRange.start && dateRange.end) {
        doc.setFontSize(12);
        doc.setTextColor(...secondaryColor);
        doc.setFont("CustomFont");
        const startStr = new Date(dateRange.start).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
        const endStr = new Date(dateRange.end).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
        doc.text(`${startStr} - ${endStr}`, pageWidth / 2, 120, { align: "center" });
    }

    // Generated Date Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    const dateStr = new Date().toLocaleDateString();
    const timeStr = new Date().toLocaleTimeString();
    doc.text(safeT('report.pdf.generated_on').replace('{{date}}', dateStr).replace('{{time}}', timeStr), pageWidth / 2, pageHeight - 20, { align: "center" });

    // Move to next page for content
    doc.addPage();
    let yPos = 20;

    // --- VISUAL ANALYTICS SECTION ---
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.setFont("CustomFont");
    doc.text(safeT('report.pdf.visual_analytics'), margin, yPos);
    yPos += 15;

    const addTitle = (title) => {
        doc.setFontSize(9);
        doc.setFont("CustomFont");
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
        const pW = doc.internal.pageSize.getWidth();
        const pH = doc.internal.pageSize.getHeight();

        // 3. Max width = full page width minus margins
        const maxWidth = pW - margin * 2;

        // 4. Scale image to max width, keep aspect ratio
        let w = maxWidth;
        let h = w / ratio;

        // 5. Auto page break if image exceeds page height
        if (yPos + h > pH - margin) {
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
        const pH = doc.internal.pageSize.getHeight();
        if (yPos + neededSpace > pH - margin) {
            doc.addPage();
            yPos = 20;
        }
    };

    // Add charts sequentially
    if (images.pieChart) addChartToPdf(images.pieChart);
    if (images.widgets) addTitle(safeT('report.options.widgets'));
    if (images.widgets) addChartToPdf(images.widgets);
    if (images.scoreChart) addChartToPdf(images.scoreChart);
    if (images.distChart) addChartToPdf(images.distChart);
    if (images.moodChart) addChartToPdf(images.moodChart);

    // --- MOOD-ACTIVITY INSIGHTS SECTION ---
    if (moodActivityInsights) {
        const yPosBefore = yPos;
        checkPageBreak(60);
        const pageBreakHappened = yPos !== yPosBefore;

        // Add spacing before insights only if no page break
        if (!pageBreakHappened) {
            yPos -= 15;
        }

        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.setFont("CustomFont");
        doc.text(safeT('report.pdf.activity_insights'), margin, yPos);
        yPos += 8;

        // 1. Stats Table
        const statsData = [
            [safeT('report.pdf.stats.total_engagements'), moodActivityInsights.totalEngagements],
            [safeT('report.pdf.stats.avg_freq'), moodActivityInsights.avgEngagementPerActivity],
            [safeT('report.pdf.stats.activities_tracked'), moodActivityInsights.totalActivities],
            [safeT('report.pdf.stats.overall_mood'), `${moodActivityInsights.avgMoodOverall}%`]
        ];

        autoTable(doc, {
            body: statsData,
            startY: yPos,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 2, textColor: secondaryColor, font: "CustomFont" },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 45 },
                1: { cellWidth: 40 }
            },
        });

        yPos = doc.lastAutoTable.finalY + 10;

        // 2. Key Insights Table
        const insightRows = [];

        if (moodActivityInsights.topLiked) {
            insightRows.push([
                safeT('report.pdf.insight_types.positive'),
                moodActivityInsights.topLiked.name,
                `${moodActivityInsights.topLiked.avgMoodScore}% Avg Mood`
            ]);
        }
        if (moodActivityInsights.topImprover) {
            insightRows.push([
                safeT('report.pdf.insight_types.booster'),
                moodActivityInsights.topImprover.name,
                `+${moodActivityInsights.topImprover.moodChange} Improvement`
            ]);
        }
        if (moodActivityInsights.topWorse && moodActivityInsights.topWorse.moodChange < 0) {
            insightRows.push([
                safeT('report.pdf.insight_types.limiting'),
                moodActivityInsights.topWorse.name,
                `${moodActivityInsights.topWorse.moodChange} Impact`
            ]);
        }

        if (insightRows.length > 0) {
            autoTable(doc, {
                head: [["Insight Type", "Activity", "Impact"]],
                body: insightRows,
                startY: yPos,
                theme: 'striped',
                headStyles: { fillColor: primaryColor, textColor: 255, font: "CustomFont" },
                styles: { fontSize: 10, cellPadding: 3, font: "CustomFont" },
                columnStyles: {
                    0: { fontStyle: 'bold', cellWidth: 50 },
                    1: { cellWidth: 'auto' },
                    2: { cellWidth: 40 }
                }
            });
            yPos = doc.lastAutoTable.finalY + 15;
        }
    }

    // --- MESSAGE PATTERN INSIGHTS SECTION ---
    if (messagePatternInsights) {
        checkPageBreak(80);

        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.setFont("CustomFont");
        doc.text(safeT('report.pdf.message_insights'), margin, yPos);
        yPos += 8;

        // 1. Stats Table
        const statsData = [
            [safeT('report.summary.total_messages'), messagePatternInsights.totalMessages],
            [safeT('report.summary.total_activities'), messagePatternInsights.uniqueMessages], // Reusing key? Or 'unique_msgs' from dashboard
            [safeT('report.pdf.stats.diversity_score'), `${messagePatternInsights.uniquePercentage}%`]
        ];
        // Correcting "Unique Messages" key usage logic above on the fly:
        // Use dashboard.message_insights.unique_msgs if available, but I don't have dashboard namespace access here easily unless I use full key.
        // I will use `report.pdf.stats` if I added it? No 'Unique Messages' there.
        // I'll stick to 'report.summary.total_activities' which is WRONG for unique messages.
        // Wait, 'report.summary.total_activities' is Total Activities.
        // I should use `dashboard.message_insights.unique_msgs`. SafeT should handle it if loaded.

        statsData[1][0] = safeT('dashboard.message_insights.unique_msgs');

        autoTable(doc, {
            body: statsData,
            startY: yPos,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 2, textColor: secondaryColor, font: "CustomFont" },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 40 },
                1: { cellWidth: 50 }
            },
        });

        yPos = doc.lastAutoTable.finalY + 10;

        // 2. Top Recurring Messages Table
        if (messagePatternInsights.topRecurring && messagePatternInsights.topRecurring.length > 0) {
            checkPageBreak(40);
            doc.setFontSize(11);
            doc.setTextColor(...primaryColor);
            doc.text(safeT('report.pdf.top_recurring'), margin, yPos);
            yPos += 6;

            const recurringRows = messagePatternInsights.topRecurring.map((msg, i) => [
                i + 1,
                msg.text,
                msg.emotion,
                msg.count,
                `${msg.percentage}%`
            ]);

            autoTable(doc, {
                head: [["#", safeT('report.pdf.headers.message'), safeT('report.pdf.headers.emotion'), safeT('report.pdf.headers.count'), safeT('report.pdf.headers.percent')]],
                body: recurringRows,
                startY: yPos,
                theme: 'striped',
                headStyles: { fillColor: primaryColor, textColor: 255, font: "CustomFont" },
                styles: { fontSize: 9, cellPadding: 3, font: "CustomFont" },
                columnStyles: {
                    0: { cellWidth: 10 },
                    1: { cellWidth: 'auto', overflow: 'linebreak' }, // Message takes remaining space & breaks
                    2: { cellWidth: 25 },
                    3: { cellWidth: 20 },
                    4: { cellWidth: 20 }
                }
            });

            yPos = doc.lastAutoTable.finalY + 10;
        }

        // 3. Emotion Frequency
        if (messagePatternInsights.emotionFreq) {
            checkPageBreak(40);
            doc.setFontSize(11);
            doc.setTextColor(...primaryColor);
            doc.text(safeT('report.pdf.emotion_freq'), margin, yPos);
            yPos += 6;

            const total = messagePatternInsights.totalMessages || 1;
            const sortedEmotions = Object.entries(messagePatternInsights.emotionFreq)
                .sort((a, b) => b[1] - a[1]);

            sortedEmotions.forEach(([emotion, count]) => {
                const pct = Math.round((count / total) * 100);
                doc.setFontSize(9);
                doc.setTextColor(50, 50, 50);
                doc.text(`${safeT(`landing.${emotion.toLowerCase()}`)}: ${count} (${pct}%)`, margin + 5, yPos);
                yPos += 5;
            });
            yPos += 10;
        }
    }

    // --- EMOTIONAL LOGS TABLE ---
    if (emotionalLogs && emotionalLogs.length > 0) {
        // Force new page for table
        doc.addPage();
        yPos = 20;

        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.setFont("CustomFont");
        doc.text(safeT('report.pdf.emotional_history'), margin, yPos);
        yPos += 5;

        const tableColumn = [
            safeT('report.pdf.headers.time'),
            safeT('report.pdf.headers.emotion'),
            safeT('report.pdf.headers.mood_score'),
            safeT('report.pdf.headers.confidence')
        ];
        const tableRows = emotionalLogs.map(log => {
            const dateVal = log.timestamp || log.ts; // Handle both key formats
            const rawLabel = log.emotion_label?.toLowerCase();
            const labelKey = rawLabel === 'angry' ? 'anger' : rawLabel; // Map angry -> anger for landing namespace

            return [
                new Date(dateVal).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
                safeT(`landing.${labelKey}`),
                log.emotional_score !== null ? log.emotional_score : "-",
                log.confidence_score !== null ? `${Math.round(log.confidence_score * 100)}%` : "-"
            ];
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: yPos,
            theme: 'striped', // Standard clean look
            headStyles: {
                fillColor: primaryColor,
                textColor: 255,
                fontStyle: 'bold',
                font: "CustomFont"
            },
            styles: {
                fontSize: 10,
                cellPadding: 4,
                textColor: 50,
                font: "CustomFont"
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250] // Very light grey for readability
            },
        });

        yPos = doc.lastAutoTable.finalY + 15;
    }

    // --- ACTIVITY LOGS TABLE ---
    if (activityLogs && activityLogs.length > 0) {
        // Force new page for table
        doc.addPage();
        yPos = 20;

        doc.setFontSize(14);
        doc.setTextColor(...primaryColor);
        doc.setFont("CustomFont");
        doc.text(safeT('report.pdf.intervention_activities'), margin, yPos);
        yPos += 5;

        const tableColumn = [
            safeT('report.pdf.headers.time'),
            safeT('report.pdf.headers.activity'),
            safeT('report.pdf.headers.duration'),
            safeT('report.pdf.headers.impact')
        ];
        const tableRows = activityLogs.map(log => {
            const moodChange = log.mood_rating && log.mood_rating.length >= 2
                ? (log.mood_rating[1] - log.mood_rating[0])
                : 0;
            const sign = moodChange > 0 ? "+" : "";

            // Map activity type to translation
            const activityTypeKey = log.intervention_type.toLowerCase().replace(/ /g, '_');
            const translatedActivity = safeT(`dashboard.pie_chart.types.${activityTypeKey}`) !== `dashboard.pie_chart.types.${activityTypeKey}`
                ? safeT(`dashboard.pie_chart.types.${activityTypeKey}`)
                : log.intervention_type;


            return [
                new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
                translatedActivity,
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
                fontStyle: 'bold',
                font: "CustomFont"
            },
            styles: {
                fontSize: 10,
                cellPadding: 4,
                textColor: 50,
                font: "CustomFont"
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250]
            },
        });
    }

    doc.save(`WellBeing_Report_${userName}_${new Date().toISOString().split('T')[0]}.pdf`);
};