import React from 'react';
import {
    Home,
    ChevronRight,
    List,
    Mail,
    Zap,
    CheckCircle,
    ArrowRight,
} from 'lucide-react';

// --- Data Structures for Dummy Content ---

interface OtherPageItem {
    id: number;
    title: string;
}

const DUMMY_OTHER_PAGES: OtherPageItem[] = [
    {
        id: 1,
        title: 'Classroom',
    },
    {
        id: 2,
        title: 'Playground',
    },
    {
        id: 3,
        title: 'Labor',
    },
    {
        id: 4,
        title: 'Library',
    },
    {
        id: 5,
        title: 'Bus Services',
    },
    {
        id: 6,
        title: 'Yoga & Meditation',
    },
    {
        id: 7,
        title: 'Computer Lab',
    },
];

const DUMMY_KEY_POINTS: string[] = [
    'Seamless integration with existing systems and platforms.',
    '24/7 priority customer support included with all plans.',
    'Scalable architecture designed for high traffic and future growth.',
    'Industry-leading security protocols and full compliance certifications.',
    'Flexible pricing models to fit any size business operation.',
];

// --- Component Implementations ---

/**
 * Renders a single other page list item with arrow icon.
 */
const OtherPageItemComponent: React.FC<OtherPageItem> = ({
    title,
}) => (
    <a
        href="#"
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            color: '#333',
            padding: '12px 20px',
            borderBottom: '1px solid #e0e0e0',
            transition: 'all 0.3s ease',
            backgroundColor: 'transparent',
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1a73e8';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.paddingLeft = '25px';
            const arrowIcon = e.currentTarget.querySelector('svg');
            if (arrowIcon) {
                arrowIcon.style.color = 'white';
                arrowIcon.style.transform = 'translateX(3px)';
            }
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#333';
            e.currentTarget.style.paddingLeft = '20px';
            const arrowIcon = e.currentTarget.querySelector('svg');
            if (arrowIcon) {
                arrowIcon.style.color = '#666';
                arrowIcon.style.transform = 'translateX(0)';
            }
        }}
    >
        <span style={{ 
            fontSize: '0.95em',
            transition: 'color 0.3s ease',
            fontWeight: '500'
        }}>
            {title}
        </span>
        <ArrowRight 
            size={16} 
            color="#666"
            style={{
                transition: 'all 0.3s ease',
            }}
        />
    </a>
);


const formInputStyle: React.CSSProperties = {
    width: 'calc(100% - 20px)',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
};

/**
 * Renders the Enquiry Form component (ENQ Form).
 */
const EnquiryForm: React.FC = () => (
    <div
        style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '30px',
            backgroundColor: '#f9f9f9',
        }}
    >
        <h3
            style={{
                marginTop: 0,
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#333',
            }}
        >
            <Mail size={20} /> Enquiry Form
        </h3>
        <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>
            Have a question? Fill out the form below and we'll get back to you!
        </p>
        <form>
            <input
                type="text"
                placeholder="Your Name"
                style={formInputStyle}
                required
            />
            <input
                type="email"
                placeholder="Your Email"
                style={formInputStyle}
                required
            />
            <textarea
                placeholder="Your Message"
                rows={4}
                style={formInputStyle}
                required
            ></textarea>
            <button
                type="submit"
                style={{
                    padding: '10px 15px',
                    backgroundColor: '#1a73e8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%',
                    fontWeight: 'bold',
                }}
            >
                Submit Enquiry
            </button>
        </form>
    </div>
);

// --- Main Component ---

const DetailsPage: React.FC = () => {
    const [showAll, setShowAll] = React.useState(false);
    const displayedPages = showAll ? DUMMY_OTHER_PAGES : DUMMY_OTHER_PAGES.slice(0, 5);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* 1. Banner Section (400px height, full width) */}
            <div
                style={{
                    width: '100%',
                    height: '400px',
                    marginBottom: '20px',
                    backgroundColor: '#f0f0f0',
                    backgroundImage: 'url(https://via.placeholder.com/1200x400?text=Service+Banner+Image)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '3em',
                    fontWeight: 'bold',
                    textShadow: '3px 3px 6px rgba(0,0,0,0.6)',
                }}
            >
                Service Banner
            </div>

            {/* Breadcrumb Navigation (Below Banner) */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '20px',
                    fontSize: '0.9em',
                    color: '#555',
                    marginLeft:'60px'
                }}
            >
                <Home size={16} style={{ marginRight: '5px' }} />
                <span style={{ cursor: 'pointer' }}>Home</span>
                <ChevronRight size={16} style={{ margin: '0 5px' }} />
                <span style={{ cursor: 'pointer' }}>Service</span>
                <ChevronRight size={16} style={{ margin: '0 5px' }} />
                <span style={{ fontWeight: 'bold', color: '#333' }}>Details Page</span>
            </div>

            {/* 2. Main Content Layout (70% and 30% split) */}
            <div style={{ display: 'flex', gap: '30px', marginBottom: '40px', paddingLeft: 60, paddingRight: 60 }}>

                {/* Left Side: 70% - Title, Description */}
                <div style={{ flex: '7' }}>
                    {/* Title and Description Section */}
                    <section>
                        <h1 style={{ color: '#333', fontSize: '2.5em', marginBottom: '10px', fontWeight: 'bold' }}>
                            The Ultimate Service Title Goes Here
                        </h1>

                        <div style={{ lineHeight: '1.6', color: '#333', textAlign:'justify', justifyContent:"center" }}>
                            <p  >
                                This is the main description area. It provides in-depth information about the service,
                                product, or topic, matching the "Dese" section in your sketch.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <p >
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                            </p>
                            <p>
                                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

                                The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
                            </p>
                            <p>
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Right Side: 30% - Other Pages and Enquiry Form */}
                <div style={{ flex: '3' }}>
                    {/* Other Pages Section (Updated to match the image) */}
                    <div
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            backgroundColor: '#f5f5f5',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: '#f5f5f5',
                                padding: '15px 20px',
                                borderBottom: '1px solid #ddd',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <List size={20} color="#333" />
                            <h3
                                style={{
                                    margin: 0,
                                    fontSize: '1.1em',
                                    fontWeight: 'bold',
                                    color: '#333',
                                }}
                            >
                                Other Pages
                            </h3>
                        </div>
                        
                        {/* List of page items */}
                        <div>
                            {displayedPages.map((item) => (
                                <OtherPageItemComponent key={item.id} {...item} />
                            ))}
                        </div>
                        
                        {/* Show More/Show Less Button */}
                        {DUMMY_OTHER_PAGES.length > 5 && (
                            <div style={{ 
                                padding: '15px', 
                                textAlign: 'center',
                                backgroundColor: '#f5f5f5'
                            }}>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowAll(!showAll);
                                    }}
                                    style={{
                                        display: 'inline-block',
                                        color: '#1a73e8',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '0.9em',
                                        padding: '8px 20px',
                                        border: '1px solid #1a73e8',
                                        borderRadius: '4px',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#1a73e8';
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#1a73e8';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    {showAll ? 'Show Less' : 'Show More'}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Enquiry Form Section (ENQ Form) */}
                    <EnquiryForm />
                </div>
            </div>
            <div style={{}} >
                {/* 3. Key Points Section (Full Width, below the 70/30 split) */}
                <section style={{ padding: '30px', backgroundColor: '#dedee4ff',width:'100%' }}>
                    <h3
                        style={{
                            borderBottom: '2px solid #1a73e8',
                            paddingBottom: '5px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            color: '#333',
                        }}
                    >
                        <Zap size={24} color="#1a73e8" /> Key Points & Benefits
                    </h3>
                    <ul
                        style={{
                            listStyleType: 'none',
                            padding: 0,
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '20px',
                            justifyContent: 'space-between',
                        }}
                    >
                        {DUMMY_KEY_POINTS.map((point, index) => (
                            <li
                                key={index}
                                style={{
                                    marginBottom: '10px',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    color: '#333',
                                    width: '45%', // Two points per line
                                }}
                            >
                                <CheckCircle size={20} color="#00a878" style={{ marginRight: '10px', minWidth: '20px' }} />
                                {point}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default DetailsPage;