import React, { useState, useEffect, useMemo } from "react";
import html2canvas from "html2canvas";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { generatePDFReport, generateCSV } from "../../utils/reportUtils";
import {
    MdFileDownload,
    MdOutlineCalendarToday,
    MdPictureAsPdf,
    MdTableView,
    MdCheckCircle,
    MdRadioButtonUnchecked
} from "react-icons/md";
import Card from "../../dashboard/card";
import Swal from 'sweetalert2';

// Services & Auth
import { fetchUserEmbeddings } from "../../services/guardianDashboardService";
import { getIdFromToken } from "../../utils/auth"; // You might need a helper for name

// Chart Components
import ReportDisplayWidgets from "../../dashboard/report/ReportDisplayWidgets";
import ReportPieChartCard from "../../dashboard/report/ReportPieChartCard";
import ReportBarChartCard from "../../dashboard/report/ReportBarChartCard";
import ReportLineChartCard from "../../dashboard/report/ReportLineChartCard";
import MoodActivityCorrelation from "../../dashboard/default/MoodActivityCorrelation";
import MessagePatternInsights from "../../components/MessagePatternInsights";

// Hooks for raw data
import { useInterventionData } from "../../hooks/useInterventionData";
import { useEmotionalLogs } from "../../hooks/useEmotionalLogs";
import FloatingNavbar from "../../layout/FloatingNavbar";

const ReportPage = () => {
    const userId = getIdFromToken();
    // Assuming you can get the user name from local storage or token, otherwise fetch profile
    const userName = localStorage.getItem('fullName') || "Me";

    // --- 1. CONFIGURATION STATE ---

    // Period Config
    const [reportType, setReportType] = useState("month"); // 'month' | 'year'
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Format Config
    const [fileFormat, setFileFormat] = useState("pdf"); // 'pdf' | 'csv'

    // Loading State
    const [isGenerating, setIsGenerating] = useState(false);

    // PDF Options
    const [pdfConfig, setPdfConfig] = useState({
        widgets: true,
        score: true,
        dist: true,
        activity: true,
        mood: true,
        messages: true,
        emotionalTable: true,
        activityTable: true
    });

    // CSV Options
    const [csvConfig, setCsvConfig] = useState({
        emotionalLogs: true,
        activityLogs: true
    });

    const [moodActivityInsights, setMoodActivityInsights] = useState(null);
    const [embeddings, setEmbeddings] = useState([]);
    const [messageInsightsData, setMessageInsightsData] = useState(null);

    // --- 2. DATE LOGIC ---
    const { startDate, endDate } = useMemo(() => {
        const start = new Date(selectedDate);
        let end = new Date(selectedDate);

        start.setHours(0, 0, 0, 0);

        if (reportType === 'month') {
            start.setDate(1);
            end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);
        } else {
            start.setMonth(0, 1);
            end = new Date(start.getFullYear(), 11, 31, 23, 59, 59, 999);
        }

        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (end > today) {
            end = today;
        }

        return { startDate: start, endDate: end };
    }, [selectedDate, reportType]);

    // --- 3. FETCH DATA ---
    useEffect(() => {
        if (!pdfConfig.messages || !userId) return;
        const loadEmbeddings = async () => {
            try {
                const data = await fetchUserEmbeddings(userId, startDate, endDate);
                setEmbeddings(data || []);
            } catch (error) {
                console.error("Failed to fetch embeddings", error);
            }
        };
        loadEmbeddings();
    }, [pdfConfig.messages, userId, startDate, endDate]);

    // Stable hooks arguments
    const hookRefDate = useMemo(() => new Date(), []);
    const hookCustomRange = useMemo(() => ({ start: startDate, end: endDate }), [startDate, endDate]);

    const { data: activityLogs } = useInterventionData(userId, "custom", hookRefDate, hookCustomRange);
    const { data: emotionalLogs } = useEmotionalLogs(userId, startDate, endDate);

    // --- 4. ACTION HANDLERS ---

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            if (fileFormat === 'csv') {
                let downloaded = false;
                // CSV Export Logic
                if (csvConfig.activityLogs && activityLogs?.length > 0) {
                    const actData = activityLogs.map(log => ({
                        Category: "Activity",
                        Date: new Date(log.timestamp).toISOString(),
                        Type: log.intervention_type,
                        Duration: log.duration,
                        Mood_Before: log.mood_rating?.[0],
                        Mood_After: log.mood_rating?.[1]
                    }));
                    generateCSV(actData, `my_activity_logs_${reportType}.csv`);
                    downloaded = true;
                }

                if (csvConfig.emotionalLogs && emotionalLogs?.length > 0) {
                    const emoData = emotionalLogs.map(log => ({
                        Category: "Emotional",
                        Date: new Date(log.timestamp).toISOString(),
                        Type: log.emotion_label,
                        Mood_Score: log.emotional_score,
                        Confidence: log.confidence_score
                    }));
                    generateCSV(emoData, `my_emotional_logs_${reportType}.csv`);
                    downloaded = true;
                }

                if (downloaded) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'CSV data downloaded successfully.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                        customClass: {
                            title: 'swal-title',
                        }
                    });
                } else {
                    Swal.fire({
                        title: 'No Data',
                        text: 'No data available to export for the selected options.',
                        icon: 'info',
                        customClass: {
                            title: 'swal-title',
                        }
                    });
                }
            } else {
                // PDF Export Logic
                const capture = async (id) => {
                    const element = document.getElementById(id);
                    if (!element) return null;
                    try {
                        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
                        return canvas.toDataURL("image/png");
                    } catch (err) {
                        console.error(`Failed to capture chart ${id}:`, err);
                        return null;
                    }
                };

                const widgets = pdfConfig.widgets ? await capture("report-widgets") : null;
                const scoreChart = pdfConfig.score ? await capture("report-score-chart") : null;
                const distChart = pdfConfig.dist ? await capture("report-dist-chart") : null;
                const pieChart = pdfConfig.activity ? await capture("report-pie-chart") : null;
                const moodChart = pdfConfig.mood ? await capture("report-mood-chart") : null;

                const images = { widgets, scoreChart, distChart, pieChart, moodChart };
                const finalMsgInsights = pdfConfig.messages ? messageInsightsData : null;
                const finalEmoLogs = pdfConfig.emotionalTable ? emotionalLogs : [];
                const finalActLogs = pdfConfig.activityTable ? activityLogs : [];

                generatePDFReport(
                    userName,
                    images,
                    moodActivityInsights,
                    finalMsgInsights,
                    finalEmoLogs,
                    finalActLogs,
                    { start: startDate, end: endDate }
                );

                Swal.fire({
                    title: 'Success!',
                    text: 'PDF Report generated and downloaded.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: {
                        title: 'swal-title',
                    }
                });
            }
        } catch (error) {
            console.error("Report generation error:", error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to generate report. Please try again.',
                icon: 'error',
                customClass: {
                    title: 'swal-title',
                }
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const togglePdfConfig = (key) => setPdfConfig(prev => ({ ...prev, [key]: !prev[key] }));
    const toggleCsvConfig = (key) => setCsvConfig(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="main-container">
            <FloatingNavbar brandText="My Report Generator" />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* --- Left Column: Configuration --- */}
                <div className="xl:col-span-1 space-y-6">
                    <Card extra="p-4">
                        <h4 className="text-lg font-bold text-navy-700 mb-4">Configuration</h4>

                        {/* 1. Report Period */}
                        <div className="mb-3 flex gap-4">
                            <div className="w-1/2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Type</label>
                                <select
                                    className="block w-full rounded-xl border border-gray-300 bg-white text-sm text-gray-700 focus:border-brand-500"
                                    style={{ padding: "0.75rem" }}
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                >
                                    <option value="month">Monthly</option>
                                    <option value="year">Yearly</option>
                                </select>
                            </div>
                            <div className="w-1/2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Period</label>
                                <div className="flex items-center rounded-xl border border-gray-300 bg-white p-2.5">
                                    <MdOutlineCalendarToday className="text-gray-500 mr-2" />
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        showMonthYearPicker={reportType === 'month'}
                                        showYearPicker={reportType === 'year'}
                                        dateFormat={reportType === 'month' ? "MMM yyyy" : "yyyy"}
                                        className="bg-transparent text-sm font-medium text-gray-700 outline-none w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. File Format */}
                        <div className="mb-6">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block">File Format</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setFileFormat('pdf')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${fileFormat === 'pdf' ? 'border-[var(--primary-color)] bg-[#49afa430] text-[var(--primary-color)]' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                                >
                                    <MdPictureAsPdf className="text-2xl mb-1" />
                                    <span className="font-bold text-sm">PDF Report</span>
                                </button>
                                <button
                                    onClick={() => setFileFormat('csv')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${fileFormat === 'csv' ? 'border-[var(--primary-color)] bg-[#49afa430] text-[var(--primary-color)]' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                                >
                                    <MdTableView className="text-2xl mb-1" />
                                    <span className="font-bold text-sm">Raw CSV</span>
                                </button>
                            </div>
                        </div>

                        {/* 3. Dynamic Options */}
                        <div className="mb-6 border-t pt-4">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block">Include Data</label>

                            {fileFormat === 'pdf' ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePdfConfig('widgets')}>
                                        <span className="text-sm text-navy-700">Emotion Summary</span>
                                        {pdfConfig.widgets ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-400" />}
                                    </div>
                                    <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePdfConfig('activity')}>
                                        <span className="text-sm text-navy-700">Activity Distribution</span>
                                        {pdfConfig.activity ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-400" />}
                                    </div>
                                    <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePdfConfig('score')}>
                                        <span className="text-sm text-navy-700">Mood Score</span>
                                        {pdfConfig.score ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-400" />}
                                    </div>
                                    <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePdfConfig('dist')}>
                                        <span className="text-sm text-navy-700">Emotional Distribution</span>
                                        {pdfConfig.dist ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-400" />}
                                    </div>
                                    <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePdfConfig('mood')}>
                                        <span className="text-sm text-navy-700">Activity Impact</span>
                                        {pdfConfig.mood ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-400" />}
                                    </div>
                                    <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePdfConfig('messages')}>
                                        <span className="text-sm text-navy-700">Message Patterns</span>
                                        {pdfConfig.messages ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-400" />}
                                    </div>
                                    <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePdfConfig('emotionalTable')}>
                                        <span className="text-sm text-navy-700">Emotional Records</span>
                                        {pdfConfig.emotionalTable ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-400" />}
                                    </div>
                                    <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePdfConfig('activityTable')}>
                                        <span className="text-sm text-navy-700">Activity Records</span>
                                        {pdfConfig.activityTable ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-400" />}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleCsvConfig('emotionalLogs')}>
                                        <span className="text-sm text-navy-700">Emotional Raw Data</span>
                                        {csvConfig.emotionalLogs ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-400" />}
                                    </div>
                                    <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleCsvConfig('activityLogs')}>
                                        <span className="text-sm text-navy-700">Activity Raw Data</span>
                                        {csvConfig.activityLogs ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-400" />}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 italic">*Will download separate files if both are selected.</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className={`w-full flex items-center justify-center gap-2 my-3 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-500/30 ${isGenerating ? 'bg-[#2F756D] text-white cursor-not-allowed' : 'bg-[#3E9389] hover:bg-[#2F756D] text-white'}`}
                        >
                            {isGenerating ? (
                                <span>Generating...</span>
                            ) : (
                                <>
                                    <MdFileDownload className="text-xl" />
                                    {fileFormat === 'pdf' ? "Generate PDF Report" : "Download CSV Data"}
                                </>
                            )}
                        </button>
                    </Card>
                </div>

                {/* --- Right Column: Preview --- */}
                <div className="xl:col-span-2 space-y-6">
                    <Card extra="p-6 h-fit">
                        <h4 className="text-lg font-bold text-navy-700 mb-4">Report Summary</h4>
                        <div className="space-y-4 text-sm text-gray-700">
                            <div className="flex justify-between border-b pb-2">
                                <span>Reporting Period</span>
                                <span className="font-bold text-navy-700">
                                    {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>Total Messages</span><
                                    span className="font-bold text-navy-700">{messageInsightsData?.totalMessages || 0}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>Total Activities</span>
                                <span className="font-bold text-navy-700">{activityLogs?.length || 0}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>Emotional Entries</span>
                                <span className="font-bold text-navy-700">{emotionalLogs?.length || 0}</span>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg mt-4 text-gray-700 text-xs">
                                <p>The preview on below shows your data for the selected range. Items grayed out will be excluded from the PDF based on your selection.</p>
                            </div>
                        </div>
                    </Card>
                    <Card extra={!pdfConfig.widgets || fileFormat === 'csv' ? "p-2 pb-4 h-fit opacity-40 grayscale" : "p-2 pb-4 h-fit"}>
                        <h4 className="p-4 text-lg font-bold text-navy-700">Emotion Summary</h4>
                        <div id="report-widgets" className="pb-2">
                            <ReportDisplayWidgets userId={userId} startDate={startDate} endDate={endDate} />
                        </div>
                    </Card>
                </div>
            </div>
            <div className="mt-6 space-y-6">
                <div id="report-pie-chart" className={!pdfConfig.activity || fileFormat === 'csv' ? "opacity-40 grayscale" : ""} >
                    <ReportPieChartCard userId={userId} startDate={startDate} endDate={endDate} />
                </div>
                <div id="report-score-chart" className={!pdfConfig.score || fileFormat === 'csv' ? "opacity-40 grayscale" : ""} >
                    <ReportLineChartCard
                        userId={userId}
                        startDate={startDate}
                        endDate={endDate}
                        bucketType={reportType === 'year' ? 'month' : 'day'}
                    />
                </div>
                <div id="report-dist-chart" className={!pdfConfig.dist || fileFormat === 'csv' ? "opacity-40 grayscale" : ""}>
                    <ReportBarChartCard
                        userId={userId}
                        startDate={startDate}
                        endDate={endDate}
                        bucketType={reportType === 'year' ? 'month' : 'day'}
                    />
                </div>
                <div id="report-mood-chart" className={!pdfConfig.mood || fileFormat === 'csv' ? "opacity-40 grayscale" : ""}>
                    <MoodActivityCorrelation
                        userId={userId}
                        startDate={startDate}
                        endDate={endDate}
                        onInsightsChange={setMoodActivityInsights}
                    />
                </div>
                <div className={!pdfConfig.messages || fileFormat === 'csv' ? "opacity-40 grayscale" : ""}>
                    <MessagePatternInsights rawEmbeddings={embeddings} onInsightsCalculated={setMessageInsightsData} />
                </div>
            </div>
        </div >
    );
};

export default ReportPage;