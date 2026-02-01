const VITE_UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

export default function Map({ data }) {

    return (
        <section className="map-section" style={{ position: 'relative', height: '450px', width: '100%' }}>
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, background: '#fff', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <a href={data?.link} target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src="./2gis.png" alt="2GIS" style={{ height: '20px' }} />
                    Открыть в 2ГИС
                </a>
            </div>
            <iframe
                src={data?.iframe}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Clinic Location"
            ></iframe>
        </section>
    )
}