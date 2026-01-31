import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import './VeneersSteps.css';
const API_URL = import.meta.env.VITE_API_URL;
const VITE_UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export default function VeneersSteps({ data }) {
    if (!data) return null;
    const [currentStep, setCurrentStep] = useState(0);

    const steps = data.steps || [];
    const totalSteps = steps.length;

    const nextStep = () => setCurrentStep((prev) => (prev + 1) % totalSteps);
    const prevStep = () => setCurrentStep((prev) => (prev - 1 + totalSteps) % totalSteps);

    const activeStepData = steps[currentStep] || {};

    return (
        <section className="veneers-steps">
            <div className="section-background">
                <img src="/hero.png" alt="background" />
            </div>

            <div className="container">
                <h2 className="section-title">{data.title}</h2>

                <div className="steps-container">
                    {/* Left Column: Visual Slider */}
                    <div className="steps-left">
                        <div className="step-numbers">
                            {steps.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`step-dot ${idx === currentStep ? 'active' : ''}`}
                                    onClick={() => setCurrentStep(idx)}
                                >
                                    {idx + 1}
                                </div>
                            ))}
                        </div>
                        <div className="step-image-wrapper">
                            {activeStepData.image && (
                                <img src={activeStepData?.image?.preview?.includes("http") ? activeStepData?.image?.preview : VITE_UPLOADS_URL + activeStepData?.image?.preview} alt={`Step ${currentStep + 1}`} className="step-image" />
                            )}
                        </div>
                        <div className="step-navigation">
                            <button className="nav-btn prev" onClick={prevStep}><ChevronLeft /></button>
                            <button className="nav-btn next" onClick={nextStep}><ChevronRight /></button>
                        </div>
                    </div>

                    {/* Right Column: Text Content */}
                    <div className="steps-right">
                        <div className="step-text-block process-block">
                            <h3 className="step-header">{activeStepData.title}</h3>
                            <div className="step-description scrollable">
                                <p>{activeStepData.textOriginal}</p>
                            </div>
                        </div>
                        <div className="step-text-block result-block">
                            <h3 className="step-header">В результате:</h3>
                            <div className="step-description">
                                <p>{activeStepData.textResult}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Promo Block */}
                <div className="promo-block">
                    <div className="promo-left">
                        <div className="avatars-group">
                            {data.promo?.avatars?.map((avatar, idx) => (
                                <div key={idx} className="avatar-frame">
                                    <img src={avatar?.includes("http") ? avatar : VITE_UPLOADS_URL + avatar} alt="Avatar" />
                                </div>
                            ))}
                        </div>
                        <p className="promo-text">{data.promo?.text}</p>
                    </div>
                    <button className="promo-cta-btn" onClick={() => window.location.href = 'tel:+79991234567'}>
                        <Phone size={20} />
                        <span>Перезвоните мне</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
