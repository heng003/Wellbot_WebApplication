import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus, Users } from 'lucide-react';

const NoMonitoredUser = ({
    title,
    description,
    buttonText,
    onButtonClick
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Use props if provided, otherwise fallback to translations
    const displayTitle = title || t('monitored_user.no_selection.title');
    const displayDesc = description || t('monitored_user.no_selection.desc');
    const displayBtn = buttonText || t('monitored_user.no_selection.button');

    const handleButtonClick = () => {
        if (onButtonClick) {
            onButtonClick();
        } else {
            navigate('/guardian/monitoredUser');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center p-6 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="bg-[#3E9389]/10 p-6 rounded-full mb-4 animate-pulse">
                <Users className="h-16 w-16 text-[#3E9389]" />
            </div>

            <h3 className="text-xl font-bold text-navy-700 mb-2">{displayTitle}</h3>

            <p className="text-gray-500 max-w-md mb-2">
                {displayDesc}
            </p>

            {/* <button
                onClick={handleButtonClick}
                className="flex items-center gap-2 bg-[#3E9389] hover:bg-[#2F756D] text-white px-4 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium text-md"
            >
                <UserPlus className="h-5 w-5" />
                <span>{displayBtn}</span>
            </button> */}
        </div>
    );
};

export default NoMonitoredUser;