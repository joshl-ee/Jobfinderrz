import * as Types from './types'

export const Jobs: Types.JobsConfig = {
    amazon: {
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
    microsoft: {
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
    }
    // meta is blocking requests from here
    // meta: {
    //     postingSite: 'https://www.metacareers.com/jobs/',
    //     // (REAL) postingSite: 'https://www.metacareers.com/careerprograms/students/?p[teams][0]=Internship%20-%20Engineering%2C%20Tech%20%26%20Design&p[teams][1]=Internship%20-%20Business&p[teams][2]=Internship%20-%20PhD&p[teams][3]=University%20Grad%20-%20PhD%20%26%20Postdoc&p[teams][4]=University%20Grad%20-%20Engineering%2C%20Tech%20%26%20Design&p[teams][5]=University%20Grad%20-%20Business&teams[0]=Internship%20-%20Engineering%2C%20Tech%20%26%20Design&teams[1]=Internship%20-%20Business&teams[2]=Internship%20-%20PhD&teams[3]=University%20Grad%20-%20PhD%20%26%20Postdoc&teams[4]=University%20Grad%20-%20Engineering%2C%20Tech%20%26%20Design&teams[5]=University%20Grad%20-%20Business#openpositions',
    //     baseSite: 'https://www.metacareers.com/jobs/',
    //     jobTile: 'div.x1ypdohk',
    //     details: {
    //         title: 'div._6g3g x8y0a91 x7z1be2 xngnso2 xeqmlgx xo1l8bm xeqr9p9 x1e096f4',
    //         location: 'span.x7z1be2 x1u3m9jt x1f6kntn x1rmxxjo',
    //         id: '',
    //         datePosted: '',
    //         description: '',
    //         link: ''
    //     }
    // }
};
