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
                title="Bulleted List"
            />
            <Checkbox
                label="Accuracy"
                checked={options.accuracy}
                onChange={handleCheckboxChange('accuracy')}
                title="Accuracy"
            />
            <Checkbox
                label="Include Sources"
                checked={options.includeSources}
                onChange={handleCheckboxChange('includeSources')}
                title="Include Sources"
            />
            <Checkbox
                label="My Writing Style"
                checked={options.myWritingStyle}
                onChange={handleCheckboxChange('myWritingStyle')}
                title="My Writing Style"
            />
            <Checkbox
                label="Search the Internet"
                checked={options.searchInternet}
                onChange={handleCheckboxChange('searchInternet')}
                title="Search the Internet"
            />
        </div>
    );
}

OptionsCheckboxes.propTypes = {
    options: PropTypes.object.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired,
};

export default OptionsCheckboxes;

