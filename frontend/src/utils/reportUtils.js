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
 * * @param {string} userName - Name of the user
 * @param {Object} images - { scoreChart: string(base64), distChart: string(base64), pieChart: string(base64) }
 * @param {Array} emotionalLogs - Array of emotional log objects
 * @param {Array} activityLogs - Array of activity log objects
 */
export const generatePDFReport = (userName, images, emotionalLogs, activityLogs) => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const maxContentWidth = pageWidth - (margin * 2);
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
    yPos += 10;

    // Configuration for Charts (Fixed Aspect Ratio Logic)
    const maxWidth = maxContentWidth;
    const maxHeight = 100; // Max height to ensure it fits nicely on page

    const addChartToPdf = (imgData) => {
        if (!imgData) return;

        // 1. Get original dimensions to calculate aspect ratio
        const props = doc.getImageProperties(imgData);
        const ratio = props.width / props.height;

        // 2. Calculate dimensions to fit within maxWidth/maxHeight
        let w = maxWidth;
        let h = w / ratio;

        // If height exceeds limit, scale down by height
        if (h > maxHeight) {
            h = maxHeight;
            w = h * ratio;
        }

        // 3. Auto-Page Break if chart won't fit
        if (yPos + h > 280) {
            doc.addPage();
            yPos = 20;
        }

        // 4. Horizontal Centering
        const xPos = margin + (maxWidth - w) / 2;

        // Add Image
        doc.addImage(imgData, 'PNG', xPos, yPos, w, h);
        yPos += h + 30; // Spacing
    };

    // Add charts sequentially
    if (images.pieChart) addChartToPdf(images.pieChart);
    if (images.scoreChart) addChartToPdf(images.scoreChart);
    if (images.distChart) addChartToPdf(images.distChart);

    // Helper for Table Page Breaks
    const checkPageBreak = (neededSpace = 30) => {
        if (yPos + neededSpace > 280) {
            doc.addPage();
            yPos = 20;
        }
    };

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