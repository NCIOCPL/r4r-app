import React from 'react';
import { shallow } from 'enzyme';
import { Results, mapStateToProps } from '../results';

// TODO: window.matchmedia means we need to use jsdom to provide a window for even smoke
describe('Results view', () => {
  beforeAll(() => {  
    Object.defineProperty(window, "matchMedia", {
      value: jest.fn(() => ({ matches: true, addListener: () => {} }) )
    });
  });

  it('renders correctly without results', () => {
    const wrapper = shallow(<Results location={{search: ''}} setCurrentSearchText={() => {}} validatedNewSearch={()=>{}}/>);
    expect(wrapper).toMatchSnapshot();
  })

  it('renders correctly with results', () => {
    const mockStateProps = mapStateToProps(mockState);
    const wrapper = mountWithThemeAndRouter(<Results location={{search: ''}} setCurrentSearchText={() => {}} validatedNewSearch={()=>{}} {...mockStateProps}/>);
    expect(wrapper).toMatchSnapshot();
  })
})

const mockState = {
  api: {
    isFetching: false,
    fetchId: null,
    searchParams: '',
    referenceFacets: [
      {
        title: 'Tool Types',
        param: 'toolTypes',
        items: [
          {
            key: 'analysis_tools',
            label: 'Analysis Tools',
            count: 98,
            selected: false
          },
          {
            key: 'datasets_databases',
            label: 'Datasets & Databases',
            count: 58,
            selected: false
          },
          {
            key: 'lab_tools',
            label: 'Lab Tools',
            count: 29,
            selected: false
          },
          {
            key: 'terminology',
            label: 'Terminology',
            count: 6,
            selected: false
          },
          {
            key: 'networks_consortiums',
            label: 'Networks/Consortiums',
            count: 4,
            selected: false
          },
          {
            key: 'clinical_research_tools',
            label: 'Clinical Research Tools',
            count: 2,
            selected: false
          },
          {
            key: 'community_research_tools',
            label: 'Community Research Tools',
            count: 1,
            selected: false
          }
        ]
      },
      {
        title: 'Research Areas',
        param: 'researchAreas',
        items: [
          {
            key: 'cancer_treatment',
            label: 'Cancer Treatment',
            count: 73,
            selected: false
          },
          {
            key: 'cancer_omics',
            label: 'Cancer Omics',
            count: 63,
            selected: false
          },
          {
            key: 'cancer_biology',
            label: 'Cancer Biology',
            count: 62,
            selected: false
          },
          {
            key: 'screening_detection',
            label: 'Screening & Detection',
            count: 30,
            selected: false
          },
          {
            key: 'cancer_statistics',
            label: 'Cancer Statistics',
            count: 20,
            selected: false
          },
          {
            key: 'cancer_health_disparities',
            label: 'Cancer Health Disparities',
            count: 18,
            selected: false
          },
          {
            key: 'cancer_public_health',
            label: 'Cancer & Public Health',
            count: 16,
            selected: false
          },
          {
            key: 'cancer_diagnosis',
            label: 'Cancer Diagnosis',
            count: 12,
            selected: false
          },
          {
            key: 'causes_of_cancer',
            label: 'Causes of Cancer',
            count: 5,
            selected: false
          },
          {
            key: 'cancer_survivorship',
            label: 'Cancer Survivorship',
            count: 4,
            selected: false
          },
          {
            key: 'cancer_prevention',
            label: 'Cancer Prevention',
            count: 2,
            selected: false
          }
        ]
      }
    ],
    referenceTotalResources: 167,
    currentSearchQueryString: '?from=0&toolTypes=community_research_tools',
    currentSearchText: '',
    currentResults: [
      {
        id: 127,
        title: 'Questionnaire Development Resources',
        website: 'https://dceg.cancer.gov/tools/design/questionnaires',
        body: '<p>A collection of questionnaires and questionnaire segments for use in a wide variety of epidemiological studies. Listings of publications are given where available. Topics covered by the questionnaires include:  Alcohol, Tobacco, and Recreational Drug Use  Anthropometric Measurements (measurements of the human body)  Background Information  Breast Cancer Risk Factors  Family History of Cancer  EMF, Radon, and UVR Exposures  Ionizing Radiation Exposures  Household Exposures  Medical History  Non-alcoholic Beverage, Food, and Dietary Supplements  Occupational History and Exposures  Physical Activity  Prescriptions, Hormones, Immunizations  Reproductive History  Residential History</p>',
        description: '<p>A collection of questionnaires and questionnaire segments for use in a wide variety of epidemiological studies. </p>',
        toolTypes: [
          {
            key: 'community_research_tools',
            label: 'Community Research Tools'
          }
        ],
        toolSubtypes: null,
        researchAreas: [
          {
            key: 'cancer_public_health',
            label: 'Cancer & Public Health'
          },
          {
            key: 'causes_of_cancer',
            label: 'Causes of Cancer'
          },
          {
            key: 'cancer_prevention',
            label: 'Cancer Prevention'
          }
        ],
        researchTypes: [
          {
            key: 'epidemiologic',
            label: 'Epidemiologic'
          }
        ],
        resourceAccess: {
          type: 'open',
          notes: null
        },
        doCs: [
          {
            key: 'dceg',
            label: 'Division of Cancer Epidemiology and Genetics (DCEG)'
          }
        ],
        poCs: [
          {
            name: {
              prefix: null,
              firstName: 'Gwen',
              middleName: null,
              lastName: 'Murphy',
              suffix: null
            },
            title: 'Ph.D., M.P.H. Staff Scientist, DCEG',
            phone: '240-276-7199',
            email: 'murphygw@mail.nih.gov'
          }
        ]
      }
    ],
    currentFilters: null,
    currentMetaData: {
      totalResults: 1,
      from: 0,
      originalQuery: '/v1/resources?size=20&from=0&toolTypes=community_research_tools'
    },
    currentFacets: [
      {
        title: 'Research Areas',
        param: 'researchAreas',
        items: [
          {
            key: 'cancer_prevention',
            label: 'Cancer Prevention',
            count: 1,
            selected: false
          },
          {
            key: 'cancer_public_health',
            label: 'Cancer & Public Health',
            count: 1,
            selected: false
          },
          {
            key: 'causes_of_cancer',
            label: 'Causes of Cancer',
            count: 1,
            selected: false
          }
        ]
      },
      {
        title: 'Research Types',
        param: 'researchTypes',
        items: [
          {
            key: 'epidemiologic',
            label: 'Epidemiologic',
            count: 1,
            selected: false
          }
        ]
      },
      {
        title: 'Tool Sub-Types',
        param: 'toolSubtypes',
        items: [
          {
            key: 'questionnaire',
            label: 'Questionnaire',
            count: 1,
            selected: false
          }
        ]
      },
      {
        title: 'Tool Types',
        param: 'toolTypes',
        items: [
          {
            key: 'community_research_tools',
            label: 'Community Research Tools',
            count: 1,
            selected: true
          }
        ]
      }
    ],
    currentResource: null
  },
  searchForm: {
    searchBarValues: {
      home: '',
      results: '',
      resource: ''
    }
  },
  announcements: {
    liveMessage: ''
  },
  error: null,
  cache: {
    cachedSearches: {
      '?from=0&toolTypes=terminology': {
        meta: {
          totalResults: 6,
          from: 0,
          originalQuery: '/v1/resources?size=20&from=0&toolTypes=terminology'
        },
        results: [
          17,
          18,
          62,
          63,
          69,
          86
        ],
        facets: [
          {
            title: 'Research Areas',
            param: 'researchAreas',
            items: [
              {
                key: 'cancer_omics',
                label: 'Cancer Omics',
                count: 2,
                selected: false
              },
              {
                key: 'cancer_biology',
                label: 'Cancer Biology',
                count: 1,
                selected: false
              },
              {
                key: 'cancer_diagnosis',
                label: 'Cancer Diagnosis',
                count: 1,
                selected: false
              },
              {
                key: 'cancer_treatment',
                label: 'Cancer Treatment',
                count: 1,
                selected: false
              },
              {
                key: 'causes_of_cancer',
                label: 'Causes of Cancer',
                count: 1,
                selected: false
              },
              {
                key: 'screening_detection',
                label: 'Screening & Detection',
                count: 1,
                selected: false
              }
            ]
          },
          {
            title: 'Research Types',
            param: 'researchTypes',
            items: [
              {
                key: 'translational',
                label: 'Translational',
                count: 2,
                selected: false
              },
              {
                key: 'basic',
                label: 'Basic',
                count: 1,
                selected: false
              },
              {
                key: 'clinical',
                label: 'Clinical',
                count: 1,
                selected: false
              },
              {
                key: 'epidemiologic',
                label: 'Epidemiologic',
                count: 1,
                selected: false
              }
            ]
          },
          {
            title: 'Tool Types',
            param: 'toolTypes',
            items: [
              {
                key: 'terminology',
                label: 'Terminology',
                count: 6,
                selected: true
              }
            ]
          }
        ]
      },
      '?from=0&toolTypes=community_research_tools': {
        meta: {
          totalResults: 1,
          from: 0,
          originalQuery: '/v1/resources?size=20&from=0&toolTypes=community_research_tools'
        },
        results: [
          127
        ],
        facets: [
          {
            title: 'Research Areas',
            param: 'researchAreas',
            items: [
              {
                key: 'cancer_prevention',
                label: 'Cancer Prevention',
                count: 1,
                selected: false
              },
              {
                key: 'cancer_public_health',
                label: 'Cancer & Public Health',
                count: 1,
                selected: false
              },
              {
                key: 'causes_of_cancer',
                label: 'Causes of Cancer',
                count: 1,
                selected: false
              }
            ]
          },
          {
            title: 'Research Types',
            param: 'researchTypes',
            items: [
              {
                key: 'epidemiologic',
                label: 'Epidemiologic',
                count: 1,
                selected: false
              }
            ]
          },
          {
            title: 'Tool Sub-Types',
            param: 'toolSubtypes',
            items: [
              {
                key: 'questionnaire',
                label: 'Questionnaire',
                count: 1,
                selected: false
              }
            ]
          },
          {
            title: 'Tool Types',
            param: 'toolTypes',
            items: [
              {
                key: 'community_research_tools',
                label: 'Community Research Tools',
                count: 1,
                selected: true
              }
            ]
          }
        ]
      }
    },
    cachedResources: {
      '17': {
        id: 17,
        title: 'OmniSearch',
        website: 'http://omnisearch.soc.southalabama.edu/ui/',
        body: '<p>OmniSearch is a semantic search software based upon the OMIT ontology. While OmniSearch is by its nature extensible, its initial focus is in human cancer research.</p>',
        description: '<p>OmniSearch is a semantic search software based upon the OMIT ontology. While OmniSearch is by its nature extensible, its initial focus is in human cancer research.</p>',
        toolTypes: [
          {
            key: 'terminology',
            label: 'Terminology'
          }
        ],
        toolSubtypes: null,
        researchAreas: [],
        researchTypes: [],
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
        poCs: []
      },
      '18': {
        id: 18,
        title: 'Ontology for MIcroRNA Target (OMIT)',
        website: 'http://omnisearch.soc.southalabama.edu/w/index.php/Ontology',
        body: '<p>OMIT is a domain ontology specifically designed for the miRNA field. OmniSearch software was developed to handle the significant challenge of miRNA-related data integration and query. It will significantly assist biologists, bioinformaticians, and clinical investigators to unravel critical roles performed by different microRNAs in human disease.</p>',
        description: '<p>OMIT is a domain ontology specifically designed for the miRNA field. OmniSearch software was developed to handle the significant challenge of miRNA-related data integration and query.</p>',
        toolTypes: [
          {
            key: 'terminology',
            label: 'Terminology'
          }
        ],
        toolSubtypes: null,
        researchAreas: [
          {
            key: 'cancer_omics',
            label: 'Cancer Omics'
          }
        ],
        researchTypes: [
          {
            key: 'translational',
            label: 'Translational'
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
        poCs: []
      },
      '62': {
        id: 62,
        title: 'D2Refine',
        website: 'https://github.com/caCDE-QA/D2Refine/wiki',
        body: '<p>D2Refine is an integrated platform that enables cancer study data/metadata harmonization and quality assurance. The platform is based on the Open Refine and enhanced with a suite of plugins.</p>',
        description: '<p>D2Refine is an integrated platform based on Open Refine that enables cancer study data/metadata harmonization and quality assurance. </p>',
        toolTypes: [
          {
            key: 'terminology',
            label: 'Terminology'
          }
        ],
        toolSubtypes: null,
        researchAreas: [],
        researchTypes: [],
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
        poCs: []
      },
      '63': {
        id: 63,
        title: 'owl-qa',
        website: 'https://github.com/caCDE-QA/owl-qa',
        body: '<p>owl-qa is an OWL-based QA tool for cancer study CDEs. The tool uses the combination of the NCI Thesaurus and additional disjointness axioms to detect potential errors and duplications in the data element definitions. The tool comprises three modules: Data Integration and Services Module; Compositional Expression Transformation Module; and OWL-based Quality Assurance Module.</p>',
        description: '<p>owl-qa is an OWL-based QA tool for cancer study common data elements (CDEs). The tool uses the combination of the NCI Thesaurus and additional disjointness axioms to detect potential errors and duplications in the data element definitions. </p>',
        toolTypes: [
          {
            key: 'terminology',
            label: 'Terminology'
          }
        ],
        toolSubtypes: null,
        researchAreas: [],
        researchTypes: [],
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
        poCs: []
      },
      '69': {
        id: 69,
        title: 'Informatics Technology for Cancer Research (ITCR) Informatics Tools',
        website: 'https://itcr.nci.nih.gov/informatics-tools',
        body: '<p>ITCR is a trans-NCI program providing support for informatics resources across the development lifecycle, including the development of innovative methods and algorithms, early stage software development advanced stage software development, and sustainment of high-value resources on which the community has come to depend. Examples of relevant topics include but are not limited to:  experiment design and execution, data collection, data processing and analysis,  data quality assessment, data integration, data presentation and visualization, text mining and natural language processing, data compression, storage, organization, transmission.</p>',
        description: '<p>Informatics resources for use across the development lifecycle, including the development of innovative methods and algorithms, early stage software development ,advanced stage software development, and sustainment of high-value resources. </p>',
        toolTypes: [
          {
            key: 'analysis_tools',
            label: 'Analysis Tools'
          },
          {
            key: 'clinical_research_tools',
            label: 'Clinical Research Tools'
          },
          {
            key: 'datasets_databases',
            label: 'Datasets & Databases'
          },
          {
            key: 'terminology',
            label: 'Terminology'
          }
        ],
        toolSubtypes: null,
        researchAreas: [
          {
            key: 'cancer_biology',
            label: 'Cancer Biology'
          },
          {
            key: 'cancer_diagnosis',
            label: 'Cancer Diagnosis'
          },
          {
            key: 'cancer_omics',
            label: 'Cancer Omics'
          },
          {
            key: 'cancer_treatment',
            label: 'Cancer Treatment'
          },
          {
            key: 'causes_of_cancer',
            label: 'Causes of Cancer'
          },
          {
            key: 'screening_detection',
            label: 'Screening & Detection'
          }
        ],
        researchTypes: [
          {
            key: 'basic',
            label: 'Basic'
          },
          {
            key: 'clinical',
            label: 'Clinical'
          },
          {
            key: 'epidemiologic',
            label: 'Epidemiologic'
          },
          {
            key: 'translational',
            label: 'Translational'
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
          },
          {
            key: 'dcb',
            label: 'Division of Cancer Biology (DCB)'
          },
          {
            key: 'dccps',
            label: 'Division of Cancer Control and Population Sciences (DCCPS)'
          },
          {
            key: 'dcp',
            label: 'Division of Cancer Prevention (DCP)'
          },
          {
            key: 'dctd',
            label: 'Division of Cancer Treatment and Diagnosis (DCTD)'
          }
        ],
        poCs: [
          {
            name: {
              prefix: null,
              firstName: 'Mervi',
              middleName: null,
              lastName: 'Heiskanen',
              suffix: null
            },
            title: 'NCI CBIIT  Program Manager',
            phone: '240-276 5175',
            email: 'Mervi.Heiskanen@nih.gov'
          }
        ]
      },
      '86': {
        id: 86,
        title: 'Modified UMS, Modified SemRep and SemMedDB-UTH',
        website: 'https://skr3.nlm.nih.gov/SemMedDB/index_uth.html',
        body: '<p>Modified UMLS, modified SemRep and SemMedDB-UTH äóñ these are resources (UMLS, SemMedDB-UT) and tools (SemRep) created and maintained by National Library of Medicine that we have modified for personalized cancer therapy and returned to the NLM.</p>',
        description: '<p>This database holds semantic predications extracted from MEDLINE citations with a version of SemRep that increases the number of predications on drug therapies for cancer. </p>',
        toolTypes: [
          {
            key: 'terminology',
            label: 'Terminology'
          }
        ],
        toolSubtypes: null,
        researchAreas: [],
        researchTypes: [],
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
        poCs: []
      },
      '127': {
        id: 127,
        title: 'Questionnaire Development Resources',
        website: 'https://dceg.cancer.gov/tools/design/questionnaires',
        body: '<p>A collection of questionnaires and questionnaire segments for use in a wide variety of epidemiological studies. Listings of publications are given where available. Topics covered by the questionnaires include:  Alcohol, Tobacco, and Recreational Drug Use  Anthropometric Measurements (measurements of the human body)  Background Information  Breast Cancer Risk Factors  Family History of Cancer  EMF, Radon, and UVR Exposures  Ionizing Radiation Exposures  Household Exposures  Medical History  Non-alcoholic Beverage, Food, and Dietary Supplements  Occupational History and Exposures  Physical Activity  Prescriptions, Hormones, Immunizations  Reproductive History  Residential History</p>',
        description: '<p>A collection of questionnaires and questionnaire segments for use in a wide variety of epidemiological studies. </p>',
        toolTypes: [
          {
            key: 'community_research_tools',
            label: 'Community Research Tools'
          }
        ],
        toolSubtypes: null,
        researchAreas: [
          {
            key: 'cancer_public_health',
            label: 'Cancer & Public Health'
          },
          {
            key: 'causes_of_cancer',
            label: 'Causes of Cancer'
          },
          {
            key: 'cancer_prevention',
            label: 'Cancer Prevention'
          }
        ],
        researchTypes: [
          {
            key: 'epidemiologic',
            label: 'Epidemiologic'
          }
        ],
        resourceAccess: {
          type: 'open',
          notes: null
        },
        doCs: [
          {
            key: 'dceg',
            label: 'Division of Cancer Epidemiology and Genetics (DCEG)'
          }
        ],
        poCs: [
          {
            name: {
              prefix: null,
              firstName: 'Gwen',
              middleName: null,
              lastName: 'Murphy',
              suffix: null
            },
            title: 'Ph.D., M.P.H. Staff Scientist, DCEG',
            phone: '240-276-7199',
            email: 'murphygw@mail.nih.gov'
          }
        ]
      }
    }
  },
  history: [
    {
      pathname: '/',
      search: '',
      hash: '',
      key: '6qm99z'
    },
    {
      pathname: '/search',
      search: '?from=0&toolTypes=terminology',
      hash: '',
      key: 'hye99v'
    },
    {
      pathname: '/',
      search: '',
      hash: '',
      key: '6qm99z'
    },
    {
      pathname: '/search',
      search: '?from=0&toolTypes=community_research_tools',
      hash: '',
      key: '2j890i'
    }
  ],
  router: {
    location: {
      pathname: '/search',
      search: '?from=0&toolTypes=community_research_tools',
      hash: '',
      key: '2j890i'
    }
  },
  settings: {
    baseUrl: ''
  }
}