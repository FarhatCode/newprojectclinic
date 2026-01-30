import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import Doctors from '../components/Doctors';
import Diagnostics from '../components/Diagnostics';
import VisualDiagnostics from '../components/VisualDiagnostics';
import SmileTransformation from '../components/SmileTransformation';
import VeneersSteps from '../components/VeneersSteps';
import InstagramSection from '../components/InstagramSection';
import Map from '../components/Map';
export default function Home({ onOpenModal, content }) {

    return (
        <>
            <Hero onOpenModal={onOpenModal} data={content?.heroStats} />
            <Services />
            <Diagnostics data={content?.diagnostics} />
            <VisualDiagnostics data={content?.visualDiagnostics} />
            <SmileTransformation data={content?.smileTransform} />
            <VeneersSteps data={content?.veneersSteps} />
            <InstagramSection data={content?.instagram} />
            <About data={content?.heroStats} />
            <Doctors onOpenModal={onOpenModal} doctors={content?.doctors} />
            <Map data={content?.map} />
        </>
    );
}
