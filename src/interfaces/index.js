import { shape, arrayOf, string, number, bool, func } from 'prop-types';

export const resourceInterface = shape({
    id: string.isRequired,
    title: string.isRequired,
    website: string.isRequired,
    description: string.isRequired,
    pocs: arrayOf(shape({
        name: shape({
            prefix: string,
            firstName: string,
            middleName: string,
            lastName: string,
            suffix: string,
        }),
        title: string,
        phone: string,
        email: string,
    })),
    docs: arrayOf(string),
    resourceAccess: shape({
        type: string.isRequired,
        notes: string,
    }),
    toolTypes: arrayOf(shape({
        type: shape({
            key: string.isRequired,
            label: string.isRequired,
        }).isRequired,
        subType: shape({
            key: string.isRequired,
            label: string.isRequired,
        })
    })),
    researchAreas: arrayOf(shape({
        key: string.isRequired,
        label: string.isRequired,
    })),
    researchTypes: arrayOf(shape({
        key: string.isRequired,
        label: string.isRequired,
    })),
})