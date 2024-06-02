import React from 'react';
import '../css/LoggingInPrompt.css';
import { ThreeDots } from 'react-loader-spinner';

const LoggingInPrompt = () => {

    return (
        <div className="signingout-prompt-overlay">
            <div className="signingout-prompt">
                <div className="reactloader">
                    <ThreeDots
                        visible={true}
                        height="80"
                        width="80"
                        color="#2596be"
                        radius="9"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                </div>
                <div className="signingout-text">Logging You In ...</div>
            </div>
        </div>
    );
};

export default LoggingInPrompt;
