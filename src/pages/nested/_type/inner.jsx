import React from 'react';
export default ({match}) => (
    <p style={{
        fontSize: '16px',
        lineHeight: '30px',
        marginTop: '30px'
    }}>printed from inner: {match.params.type}</p>
);