import React from 'react';

class ContactInformation extends React.PureComponent {
    //TODO: This needs to be a lot less brittle and based on a specific structure.;
    //Also, there will be possibly be multiple types of Contact Components?
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