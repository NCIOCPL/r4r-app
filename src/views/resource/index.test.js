import React from 'react';
import { shallow } from 'enzyme';
import { Resource } from './index';

describe('Resource View', () => {

  it('renders correctly with no resource', () => {
    const wrapper = shallow(<Resource match={{ params: {id: 1} }} location={{ search: ''}} history={[]} filters={[]} currentResults={[]} newSearch={() => {}} searchBarOnChange={() => {}} fetchResource={() => {}} goBack={() => {}}/>);
    expect(wrapper).toMatchSnapshot();
  })

  it('renders correctly with a resource loaded', () => {
  const wrapper = mountWithThemeAndRouter(<Resource resource={ mockResource } match={{ params: {id: 1} }} location={{search: ''}} history={[]} filters={[]} currentResults={[]} newSearch={() => {}} searchBarOnChange={() => {}} fetchResource={() => {}} goBack={() => {}}/>)
    expect(wrapper).toMatchSnapshot();
  })
  
})

const mockResource = {
  id: 1,
  title: 'Enhancer Linking by Methylation/Expression Relationships (ELMER)',
  website: 'http://bioconductor.org/packages/release/bioc/html/ELMER.html',
  body: '<p>R tool for analysis of DNA methylation and expression datasets. Integrative analysis allows reconstruction of in vivo transcription factor networks altered in cancer along with identification of the underlying gene regulatory sequences.</p>',
  description: '<p>R tool for analysis of DNA methylation and expression datasets.</p>',
  toolTypes: [
    {
      key: 'analysis_tools',
      label: 'Analysis Tools'
    }
  ],
  toolSubtypes: [
    {
      parentKey: 'analysis_tools',
      key: 'r_software',
      label: 'R Software'
    }
  ],
  researchAreas: [
    {
      key: 'cancer_omics',
      label: 'Cancer Omics'
    }
  ],
  researchTypes: [
    {
      key: 'basic',
      label: 'Basic'
    }
  ],
  resourceAccess: {
    type: 'open',
    notes: null
  },
  doCs: [
    {
      key: 'cbiit',
      label: 'Center for Biomedical Informatics and Informatics Technology (CBIIT)'
    }
  ],
  poCs: [
    {
      name: {
        prefix: null,
        firstName: 'Susan',
        middleName: null,
        lastName: 'Scott',
        suffix: null
      },
      title: 'Public Health Advisor, Surveillance Research Program',
      phone: '240-276-6951',
      email: 'scotts2@mail.nih.gov'
    },
    {
      name: {
        prefix: null,
        firstName: 'Eric (Rocky)',
        middleName: null,
        lastName: 'Feuer',
        suffix: null
      },
      title: 'Chief, Statistical Research and Applications Branch, Surveillance Research Program',
      phone: '240-276-6772',
      email: 'feuerr@mail.nih.gov'
    }
  ]
}