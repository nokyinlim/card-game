import React from 'react';

interface StatBarProps {
    value: number;
    max_value: number;
    color: string;
}

const StatBar: React.FC<StatBarProps> = ({ value, max_value, color }) => {
    const percentage = (value / max_value) * 100;

    return (
        <div style={{ border: '1px solid #000', borderRadius: '4px', width: '100%', backgroundColor: '#e0e0e0' }}>
            <div
            style={{
                width: `${percentage}%`,
                backgroundColor: `#${color}`,
                height: '20px',
                borderRadius: '4px',
                transition: 'width 0.5s ease-in-out' 
            }}
            />
        </div>
    );
};

export default StatBar;