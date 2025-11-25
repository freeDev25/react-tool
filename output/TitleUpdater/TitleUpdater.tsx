import React from 'react';
import './style.css';

interface TitleUpdaterProps {
    pageTitle?: string;
}

const TitleUpdater: React.FC<TitleUpdaterProps> = (props) => {
    React.useEffect(() => {
        document.title = props.pageTitle;
    }, [props.pageTitle]);
    return (
        <div className="titleupdater-0">
            <h1>
                {props.pageTitle}
            </h1>
            <p>
                The document title updates with this page title!
            </p>
        </div>
    );
};

export default TitleUpdater;