import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Users } from 'lucide-react';

const NoMonitoredUser = ({
    title = "No Monitored User Selected",
    description = "It looks like you haven't selected a user yet. Please select a user from the top bar to view their insights, or add a new user to your monitoring list.",
    buttonText = "Add / Manage Users",
    onButtonClick
}) => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        if (onButtonClick) {
            onButtonClick();
        } else {
            navigate('/guardian/monitoredUser');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 bg-white/50 rounded-3xl border border-dashed border-gray-300">
            <div className="bg-[#3E9389]/10 p-6 rounded-full mb-4 animate-pulse">
                <Users className="h-16 w-16 text-[#3E9389]" />
            </div>

            <h3 className="text-xl font-bold text-navy-700 mb-2">{title}</h3>

            <p className="text-gray-500 max-w-md mb-2">
                {description}
            </p>

            <button
                onClick={handleButtonClick}
                className="flex items-center gap-2 bg-[#3E9389] hover:bg-[#2F756D] text-white px-4 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium text-md"
            >
                <UserPlus className="h-5 w-5" />
                <span>{buttonText}</span>
            </button>
        </div>
    );
};

export default NoMonitoredUser;
