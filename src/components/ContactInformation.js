import React from 'react';
import PropTypes from 'prop-types';

class ContactInformation extends React.PureComponent {
    static propTypes = {
        contact: PropTypes.shape({
            name: PropTypes.shape({
                prefix: PropTypes.string,
                firstName: PropTypes.string,
                middleName: PropTypes.string,
                lastName: PropTypes.string,
                suffix: PropTypes.string,
            }),
            title: PropTypes.string,
            phone: PropTypes.string,
            email: PropTypes.string,
        })
    }

    render() {
        const {
            name: {
                prefix,
                firstName,
                middleName,
                lastName,
                suffix
            },
            title,
            phone,
            email
        } = this.props.contact;
        return (
            <div className='contact-information'>
                { firstName || lastName ? <p>{[prefix, firstName, middleName, lastName, suffix].join(' ')}</p> : null }
                { title ? <p>{ title }</p> : null }
                { phone ? <p>{ phone }</p> : null }
                { email ? <p>{ email }</p> : null }
            </div>
        )
    }
}

export default ContactInformation;