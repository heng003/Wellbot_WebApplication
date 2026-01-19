import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
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
import { useTranslation } from 'react-i18next';

// Services & Auth
import { fetchActiveWards, fetchUserEmbeddings } from "../../services/guardianDashboardService";
import { getIdFromToken } from "../../utils/auth";

// Chart Components
import ReportDisplayWidgets from "../../dashboard/report/ReportDisplayWidgets";
import ReportPieChartCard from "../../dashboard/report/ReportPieChartCard";
import ReportBarChartCard from "../../dashboard/report/ReportBarChartCard";
import ReportLineChartCard from "../../dashboard/report/ReportLineChartCard";
import MoodActivityCorrelation from "../../dashboard/default/MoodActivityCorrelation";
import MessagePatternInsights from "../../components/MessagePatternInsights";

// Hooks for raw data (Tables)
import { useInterventionData } from "../../hooks/useInterventionData";
import { useEmotionalLogs } from "../../hooks/useEmotionalLogs";
import FloatingNavbar from "../../layout/FloatingNavbar";
import NoMonitoredUser from "../../components/NoMonitoredUser";

const ReportPage = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const guardianId = getIdFromToken();

    // --- 1. CONFIGURATION STATE ---
    const initialState = location.state || {};
    const [selectedWardId, setSelectedWardId] = useState(initialState.userId || "");
    const [wards, setWards] = useState([]);
    const [loadingWards, setLoadingWards] = useState(true);

    // Period Config
    const [reportType, setReportType] = useState("month"); // 'month' | 'year'
    const [selectedDate, setSelectedDate] = useState(
        initialState.startDate ? new Date(initialState.startDate) : new Date()
    );

    // Format Config
    const [fileFormat, setFileFormat] = useState("pdf"); // 'pdf' | 'csv'

    // Loading State
    const [isGenerating, setIsGenerating] = useState(false);

    const [messageInsightsData, setMessageInsightsData] = useState(null);

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

    // Mood-Activity Insights from chart
    const [moodActivityInsights, setMoodActivityInsights] = useState(null);
    const [embeddings, setEmbeddings] = useState([]);

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
        const loadWards = async () => {
            try {
                const data = await fetchActiveWards(guardianId);
                setWards(data || []);
                if (!selectedWardId && data && data.length > 0) {
                    setSelectedWardId(data[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch wards", error);
            } finally {
                setLoadingWards(false);
            }
        };
        loadWards();
    }, [guardianId, selectedWardId]);

    // Fetch Embeddings for Message Insights
    useEffect(() => {
        if (!pdfConfig.messages || !selectedWardId) return;
        const loadEmbeddings = async () => {
            try {
                const data = await fetchUserEmbeddings(selectedWardId, startDate, endDate);
                setEmbeddings(data || []);
            } catch (error) {
                console.error("Failed to fetch embeddings", error);
            }
        };
        loadEmbeddings();
    }, [pdfConfig.messages, selectedWardId, startDate, endDate]);

    // Stable hooks arguments
    const hookRefDate = useMemo(() => new Date(), []);
    const hookCustomRange = useMemo(() => ({ start: startDate, end: endDate }), [startDate, endDate]);

    const { data: activityLogs } = useInterventionData(selectedWardId, "custom", hookRefDate, hookCustomRange);
    const { data: emotionalLogs } = useEmotionalLogs(selectedWardId, startDate, endDate);

    const getCurrentUserName = () => {
        const ward = wards.find(w => w.id === selectedWardId);
        return ward ? ward.full_name : "-";
    };

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
                    generateCSV(actData, `activity_logs_${reportType}_${getCurrentUserName()}.csv`);
                    downloaded = true;
                }

                if (csvConfig.emotionalLogs && emotionalLogs?.length > 0) {
                    const emoData = emotionalLogs.map(log => ({
                        Category: "Emotional",
                        Date: new Date(log.ts).toISOString(),
                        Type: log.emotion_label,
                        Mood_Score: log.emotional_score,
                        Confidence: log.confidence_score
                    }));
                    generateCSV(emoData, `emotional_logs_${reportType}_${getCurrentUserName()}.csv`);
                    downloaded = true;
                }

                if (downloaded) {
                    Swal.fire({
                        title: t('report.alerts.success'),
                        text: t('report.alerts.csv_downloaded'),
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                        confirmButtonColor: "var(--primary-color)",
                        customClass: {
                            title: 'swal-title',
                        }
                    });
                } else {
                    Swal.fire({
                        title: t('report.alerts.no_data'),
                        text: t('report.alerts.no_data_desc'),
                        icon: 'info',
                        confirmButtonColor: "var(--primary-color)",
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

                await generatePDFReport(
                    getCurrentUserName(),
                    images,
                    moodActivityInsights,
                    finalMsgInsights,
                    finalEmoLogs,
                    finalActLogs,
                    { start: startDate, end: endDate },
                    t
                );

                Swal.fire({
                    title: t('report.alerts.success'),
                    text: t('report.alerts.pdf_downloaded'),
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    confirmButtonColor: "var(--primary-color)",
                    customClass: {
                        title: 'swal-title',
                    }
                });
            }
        } catch (error) {
            console.error("Report generation error:", error);
            Swal.fire({
                title: t('report.alerts.error'),
                text: t('report.alerts.failed'),
                icon: 'error',
                confirmButtonColor: "var(--primary-color)",
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
            <FloatingNavbar brandText={t('report.title_guardian')} />

            {!loadingWards && wards.length === 0 ? (
                <NoMonitoredUser
                    title={t('report.no_users.title')}
                    description={t('report.no_users.desc')}
                    buttonText={t('report.no_users.button')}
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                        {/* --- Left Column: Configuration --- */}
                        <div className="xl:col-span-1 space-y-6">
                            <Card extra="p-4">
                                <h4 className="text-lg font-bold text-navy-700 mb-4">{t('report.configuration')}</h4>

                                {/* 1. User Selection */}
                                <div className="mb-3">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">{t('report.user_select')}</label>
                                    <select
                                        className="block w-full rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-800 focus:border-brand-500 focus:ring-brand-500"
                                        value={selectedWardId}
                                        onChange={(e) => setSelectedWardId(e.target.value)}
                                    >
                                        {wards.map((ward) => (
                                            <option key={ward.id} value={ward.id}>{ward.full_name || ward.email}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* 2. Report Period */}
                                <div className="mb-4 flex gap-4">
                                    <div className="w-1/2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">{t('report.type')}</label>
                                        <select
                                            className="block w-full rounded-xl border border-gray-300 bg-white text-sm text-gray-800 focus:border-brand-500"
                                            style={{ padding: "0.75rem" }}
                                            value={reportType}
                                            onChange={(e) => setReportType(e.target.value)}
                                        >
                                            <option value="month">{t('report.monthly')}</option>
                                            <option value="year">{t('report.yearly')}</option>
                                        </select>
                                    </div>
                                    <div className="w-1/2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">{t('report.period')}</label>
                                        <div className="flex items-center rounded-xl border border-gray-300 bg-white p-2.5">
                                            <MdOutlineCalendarToday className="text-gray-500 mr-2" />
                                            <DatePicker
                                                selected={selectedDate}
                                                onChange={(date) => setSelectedDate(date)}
                                                showMonthYearPicker={reportType === 'month'}
                                                showYearPicker={reportType === 'year'}
                                                dateFormat={reportType === 'month' ? "MMM yyyy" : "yyyy"}
                                                className="bg-transparent text-sm font-medium text-gray-800 outline-none w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. File Format */}
                                <div className="mb-8">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 block">{t('report.file_format')}</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setFileFormat('pdf')}
                                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${fileFormat === 'pdf' ? 'border-[var(--primary-color)] bg-[#49afa430] text-[var(--primary-color)]' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                                        >
                                            <MdPictureAsPdf className="text-2xl mb-1" />
                                            <span className="font-bold text-sm">{t('report.pdf_option')}</span>
                                        </button>
                                        <button
                                            onClick={() => setFileFormat('csv')}
                                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${fileFormat === 'csv' ? 'border-[var(--primary-color)] bg-[#49afa430] text-[var(--primary-color)]' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                                        >
                                            <MdTableView className="text-2xl mb-1" />
                                            <span className="font-bold text-sm">{t('report.csv_option')}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* 4. Dynamic Options */}
                                <div className="mt-2 mb-6 border-t pt-4">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-2 mb-3 block">{t('report.include_data')}</label>

                                    {fileFormat === 'pdf' ? (
                                        <div className="space-y-5 text-sm">
                                            <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePdfConfig('widgets')}>
                                                <span className="text-navy-700">{t('report.options.widgets')}</span>
                                                {pdfConfig.widgets ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-400" />}
                                            </div>
                                            <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePdfConfig('activity')}>
                                                <span className="text-navy-700">{t('report.options.activity')}</span>
                                                {pdfConfig.activity ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-500" />}
                                            </div>
                                            <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePdfConfig('score')}>
                                                <span className="text-navy-700">{t('report.options.score')}</span>
                                                {pdfConfig.score ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-500" />}
                                            </div>
                                            <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePdfConfig('dist')}>
                                                <span className="text-navy-700">{t('report.options.dist')}</span>
                                                {pdfConfig.dist ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-500" />}
                                            </div>
                                            <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePdfConfig('mood')}>
                                                <span className="text-navy-700">{t('report.options.mood')}</span>
                                                {pdfConfig.mood ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-500" />}
                                            </div>
                                            <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePdfConfig('messages')}>
                                                <span>{t('report.options.messages')}</span>
                                                {pdfConfig.messages ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-400" />}
                                            </div>
                                            <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePdfConfig('emotionalTable')}>
                                                <span className="text-navy-700">{t('report.options.emotional_table')}</span>
                                                {pdfConfig.emotionalTable ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-500" />}
                                            </div>
                                            <div className="flex items-center justify-between cursor-pointer" onClick={() => togglePdfConfig('activityTable')}>
                                                <span className="text-navy-700">{t('report.options.activity_table')}</span>
                                                {pdfConfig.activityTable ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-500" />}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-5 text-sm">
                                            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleCsvConfig('emotionalLogs')}>
                                                <span className="text-navy-700">{t('report.options.emotional_raw')}</span>
                                                {csvConfig.emotionalLogs ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-500" />}
                                            </div>
                                            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleCsvConfig('activityLogs')}>
                                                <span className="text-navy-700">{t('report.options.activity_raw')}</span>
                                                {csvConfig.activityLogs ? <MdCheckCircle className="text-[#3E9389]" /> : <MdRadioButtonUnchecked className="text-gray-500" />}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2 italic">{t('report.helpers.csv_note')}</p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className={`w-full flex items-center justify-center gap-2 my-3 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-500/30 ${isGenerating ? 'bg-[#3E9389] text-white opacity-70 cursor-not-allowed' : 'bg-[#3E9389] hover:bg-[#2F756D] text-white'}`}
                                >
                                    {isGenerating ? (
                                        <span>{t('report.generating')}</span>
                                    ) : (
                                        <>
                                            <MdFileDownload className="text-xl" />
                                            {fileFormat === 'pdf' ? t('report.generate_pdf') : t('report.download_csv')}
                                        </>
                                    )}
                                </button>
                            </Card>
                        </div>

                        {/* --- Right Column: Preview --- */}
                        <div className="xl:col-span-2 space-y-6">
                            <Card extra="p-6 h-fit">
                                <h4 className="text-lg font-bold text-navy-700 mb-4">{t('report.data_summary')}</h4>
                                <div className="space-y-4 text-sm text-gray-800">
                                    <div className="flex justify-between border-b pb-2">
                                        <span>{t('report.summary.selected_user')}</span>
                                        <span className="font-bold text-navy-700">{getCurrentUserName()}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span>{t('report.summary.period')}</span>
                                        <span className="font-bold text-navy-700">
                                            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span>{t('report.summary.total_messages')}</span><
                                            span className="font-bold text-navy-700">{messageInsightsData?.totalMessages || 0}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span>{t('report.summary.total_activities')}</span>
                                        <span className="font-bold text-navy-700">{activityLogs?.length || 0}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span>{t('report.summary.emotional_entries')}</span>
                                        <span className="font-bold text-navy-700">{emotionalLogs?.length || 0}</span>
                                    </div>
                                    <div className="bg-gray-100 p-3 rounded-lg mt-4 text-gray-800 text-xs">
                                        <p>{t('report.helpers.guardian_preview_note')}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card extra={!pdfConfig.widgets || fileFormat === 'csv' ? "p-2 pb-4 h-fit opacity-40 grayscale" : "p-2 pb-4 h-fit"}>
                                <h4 className="p-4 text-lg font-bold text-navy-700">{t('report.emotion_summary')}</h4>
                                <div id="report-widgets" className="pb-2">
                                    <ReportDisplayWidgets userId={selectedWardId} startDate={startDate} endDate={endDate} />
                                </div>
                            </Card>
                        </div>
                    </div>
                    <div className="mt-6 space-y-6">
                        <div id="report-pie-chart" className={!pdfConfig.activity || fileFormat === 'csv' ? "opacity-40 grayscale" : ""}>
                            <ReportPieChartCard userId={selectedWardId} startDate={startDate} endDate={endDate} />
                        </div>
                        <div id="report-score-chart" className={!pdfConfig.score || fileFormat === 'csv' ? "opacity-40 grayscale" : ""}>
                            <ReportLineChartCard
                                userId={selectedWardId}
                                startDate={startDate}
                                endDate={endDate}
                                bucketType={reportType === 'year' ? 'month' : 'day'}
                            />
                        </div>
                        <div id="report-dist-chart" className={!pdfConfig.dist || fileFormat === 'csv' ? "opacity-40 grayscale" : ""}>
                            <ReportBarChartCard
                                userId={selectedWardId}
                                startDate={startDate}
                                endDate={endDate}
                                bucketType={reportType === 'year' ? 'month' : 'day'}
                            />
                        </div>
                        <div id="report-mood-chart" className={!pdfConfig.mood || fileFormat === 'csv' ? "opacity-40 grayscale" : ""}>
                            <MoodActivityCorrelation
                                userId={selectedWardId}
                                startDate={startDate}
                                endDate={endDate}
                                onInsightsChange={setMoodActivityInsights}
                            />
                        </div>
                        <div className={!pdfConfig.messages || fileFormat === 'csv' ? "opacity-40 grayscale" : ""}>
                            <MessagePatternInsights rawEmbeddings={embeddings} onInsightsCalculated={setMessageInsightsData} />
                        </div>
                    </div>
                </>
            )}
        </div >
    );
};

export default ReportPage;