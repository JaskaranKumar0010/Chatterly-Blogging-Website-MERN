import React from 'react';
import '../css/SigningOutPrompt.css';
import { TailSpin } from 'react-loader-spinner';

const SigningOutPrompt = () => {

    return (
        <div className="signingout-prompt-overlay">
            <div className="signingout-prompt">
                <div className="reactloader">
                    <TailSpin
                        visible={true}
                        height="80"
                        width="80"
                        color="#2596be"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                </div>
                <div className="signingout-text">Signing Out...</div>
            </div>
        </div>
    );
};

export default SigningOutPrompt;
