import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from './Checkbox';

function OptionsCheckboxes({ options, handleCheckboxChange }) {
    return (
        <div className="options">
            <Checkbox
                label="Bulleted List"
                checked={options.bulletedList}
                onChange={handleCheckboxChange('bulletedList')}
                title="Format the output as a bulleted list."
            />
            <Checkbox
                label="Accuracy"
                checked={options.accuracy}
                onChange={handleCheckboxChange('accuracy')}
                title="Ensure the output is as accurate as possible."
            />
            <Checkbox
                label="Include Sources"
                checked={options.includeSources}
                onChange={handleCheckboxChange('includeSources')}
                title="Include the sources used to provide this information."
            />
            <Checkbox
                label="My Writing Style"
                checked={options.myWritingStyle}
                onChange={handleCheckboxChange('myWritingStyle')}
                title="Write the output in my writing style."
            />
            <Checkbox
                label="Search the Internet"
                checked={options.searchInternet}
                onChange={handleCheckboxChange('searchInternet')}
                title="Search the internet for the most up-to-date information."
            />
        </div>
    );
}

OptionsCheckboxes.propTypes = {
    options: PropTypes.object.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired,
};

export default OptionsCheckboxes;
