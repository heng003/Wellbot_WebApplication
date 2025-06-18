import React from "react";
import { Check, X, Clock } from "lucide-react"; // or from your icons lib
import { formatDate } from "../utils/dateUtils"; // adjust path as needed
import "../styles/accessManagePage.css";

const CardGuardianRequest = ({ id, name, username, email, organization, requestedAt, requestMessage, handleRequestResponse }) => {
    return (
        <div className="card-guardian-tracking">
            <div className="card-header">
                <div>
                    <h3 className="card-header-title">{name}</h3>
                    <p className="card-header-content">{username}</p>
                    <p className="card-header-content">{email}</p>
                </div>
                <div className="card-guardian-tracking-date flex items-center text-sm text-slate-500">
                    <Clock size={16} className="mr-1" />
                    {formatDate(requestedAt)}
                </div>
            </div>
            <p className="text-slate-700 mt-4">{requestMessage}</p>
            <div className="flex gap-3 mt-4">
                <button onClick={() => handleRequestResponse(id, 'accept')} className="btn btn-primary">
                    <Check size={16} className="mr-2" /> Accept
                </button>
                <button onClick={() => handleRequestResponse(id, 'reject')} className="btn btn-outline" style={{ color: '#dc2626', borderColor: '#fca5a5' }}>
                    <X size={16} className="mr-2" /> Reject
                </button>
            </div>
        </div>
    );
};

export default CardGuardianRequest;