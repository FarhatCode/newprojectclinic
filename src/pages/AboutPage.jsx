import React from 'react';
import About from '../components/About';
import Doctors from '../components/Doctors';

export default function AboutPage({ content }) {
    return (
        <div>
            <div className="page-header section" style={{ backgroundColor: 'var(--background)', paddingBottom: '0' }}>
                <div className="container">
                    <h1 className="section-title">О клинике</h1>
                </div>
            </div>
            <About data={content?.heroStats} />
            <Doctors doctors={content?.doctors} />
        </div>
    );
}
