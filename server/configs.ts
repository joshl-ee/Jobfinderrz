import * as Types from './types/jobs'

export const CompanyConfigs: Types.CompanyConfig[] = [
    {
        company: "Amazon",
        postingSite: 'https://www.amazon.jobs/en/teams/jobs-for-grads?offset=0&result_limit=10&sort=recent&distanceType=Mi&radius=24km&latitude=&longitude=&loc_group_id=&loc_query=&base_query=&city=&country=&region=&county=&query_options=&',
        baseSite: 'https://www.amazon.jobs',
        jobTile: 'div.job-tile',
        details: {
            title: 'h3.job-title',
            location: 'p.location-and-id',
            id: 'p.location-and-id',
            datePosted: 'h2.posting-date',
            description: '',
            link: 'a.job-link'
        }
    },
    {
        company: "Microsoft",
        postingSite: 'https://jobs.careers.microsoft.com/global/en/search?p=Engineering&exp=Students%20and%20graduates&l=en_us&pg=1&pgSz=20&o=Recent',
        baseSite: '',
        jobTile: 'div.ms-List-cell',
        details: {
            title: 'h2.MZGzlrn8gfgSs8TZHhv2',
            location: 'i[data-icon-name="POI"] + span',
            id: '',
            datePosted: 'i[data-icon-name="Clock"] + span',
            description: '',
            link: ''
        }
    },
    {
        company: "Meta",
        postingSite: 'https://www.metacareers.com/careerprograms/students/?p[teams][0]=Internship%20-%20Engineering%2C%20Tech%20%26%20Design&p[teams][1]=Internship%20-%20Business&p[teams][2]=Internship%20-%20PhD&p[teams][3]=University%20Grad%20-%20PhD%20%26%20Postdoc&p[teams][4]=University%20Grad%20-%20Engineering%2C%20Tech%20%26%20Design&p[teams][5]=University%20Grad%20-%20Business&teams[0]=Internship%20-%20Engineering%2C%20Tech%20%26%20Design&teams[1]=Internship%20-%20Business&teams[2]=Internship%20-%20PhD&teams[3]=University%20Grad%20-%20PhD%20%26%20Postdoc&teams[4]=University%20Grad%20-%20Engineering%2C%20Tech%20%26%20Design&teams[5]=University%20Grad%20-%20Business#openpositions',
        baseSite: 'https://www.metacareers.com/jobs',
        jobTile: 'div._af0h',
        details: {
            title: 'div._8sel._97fe',
            location: 'class._8see._97fe',
            id: '',
            datePosted: '',
            description: 'a._8seh._97fe',
            link: 'a._8sef'
        }
    },
    {
        company: "Netflix",
        postingSite: 'https://jobs.netflix.com/search?q=software%20new%20grad&location=Remote%2C%20United%20States~Los%20Angeles%2C%20California~Los%20Gatos%2C%20California~New%20York%2C%20New%20York~Remote%2C%20California',
        baseSite: 'https://jobs.netflix.com',
        jobTile: '.css-gf7hb5.e1rpdjew3',
        details: {
            title: 'a.css-2y5mtm.essqqm81',
            location: 'span.css-ipl420.e13jx43x2',
            id: '',
            datePosted: '',
            description: 'span.teams-list',
            link: 'a.css-2y5mtm.essqqm81'
        }
    },
    {
        company: "Apple",
        postingSite: 'https://jobs.apple.com/en-us/search?sort=newest&key=early%252520career&team=apps-and-frameworks-SFTWR-AF+engineering-project-management-SFTWR-EPM+software-quality-automation-and-tools-SFTWR-SQAT+cloud-and-infrastructure-SFTWR-CLD+devops-and-site-reliability-SFTWR-DSR+information-systems-and-technology-SFTWR-ISTECH',
        baseSite: 'https://jobs.apple.com',
        jobTile: '[id*="accordion_"][id*="_group"]',
        details: {
            title: 'a.table--advanced-search__title',
            location: 'span.storeName_container_PIPE-200490236',
            id: '',
            datePosted: 'span.table--advanced-search__date',
            description: 'span.table--advanced-search__role',
            link: 'a.table--advanced-search__title'
        }
    },
    {
        company: "Google",
        postingSite: 'https://www.google.com/about/careers/applications/jobs/results/?category=DATA_CENTER_OPERATIONS&category=DEVELOPER_RELATIONS&category=HARDWARE_ENGINEERING&category=INFORMATION_TECHNOLOGY&category=MANUFACTURING_SUPPLY_CHAIN&category=NETWORK_ENGINEERING&category=PRODUCT_MANAGEMENT&category=PROGRAM_MANAGEMENT&category=SOFTWARE_ENGINEERING&category=TECHNICAL_INFRASTRUCTURE_ENGINEERING&category=TECHNICAL_SOLUTIONS&category=TECHNICAL_WRITING&category=USER_EXPERIENCE&jex=ENTRY_LEVEL&degree=BACHELORS&employment_type=FULL_TIME&sort_by=date&target_level=INTERN_AND_APPRENTICE&target_level=EARLY',
        baseSite: 'https://www.google.com/about/careers/applications/',
        jobTile: 'li.lLd3Je',
        details: {
            title: 'h3.QJPWVe',
            location: 'span.pwO9Dc.vo5qdf',
            id: '',
            datePosted: '',
            description: 'class.Xsxa1e',
            link: 'a.WpHeLc.VfPpkd-mRLv6.VfPpkd-RLmnJb'
        }
    }
];
