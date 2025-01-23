import React, { useState, useEffect } from 'react';
import { Alert } from 'antd';

const NoticeBar = () => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const noticeClosed = sessionStorage.getItem('noticeClosed');
        if (noticeClosed) {
                setVisible(false);
        }
    }, []);

    const handleClose = () => {
        // to make sure that antd notice closes first.
        setTimeout(() => setVisible(false), 3000);
        sessionStorage.setItem('noticeClosed', 'true');
    };

    return (
        visible && (
            <Alert
                message="Notice"
                type="info"
                description="I am using a free backend instance, so please be patient if the app takes time to load. Thank you! You can close this message by clicking the 'x' in the top right corner."
                banner
                showIcon    
                closable
                onClose={handleClose}
            />
        )
    );
};

export default NoticeBar;
