

import _page4Id from '/Users/baidu/work/lavas-react/src/pages/page4/_id.jsx';

import _page1 from '/Users/baidu/work/lavas-react/src/pages/Page1.lazy.jsx';

import _index from '/Users/baidu/work/lavas-react/src/pages/Index.jsx';

import _page2 from '/Users/baidu/work/lavas-react/src/pages/Page2.jsx';

import _page2A from '/Users/baidu/work/lavas-react/src/pages/page2/A.jsx';

import _page2Page3 from '/Users/baidu/work/lavas-react/src/pages/page2/Page3.jsx';

import _page2Id from '/Users/baidu/work/lavas-react/src/pages/page2/_id.jsx';

import _page2TypePage5 from '/Users/baidu/work/lavas-react/src/pages/page2/_type/Page5.jsx';

import _error from '/Users/baidu/work/lavas-react/src/pages/Error.jsx';


const routes = [
    {
        "path": "/page4/:id",
        "component": _page4Id,
        "name": "page4Id",
        "exact": true,
        "strict": true,
        "lazy": false
    },
    {
        "path": "/page1",
        "component": _page1,
        "name": "page1",
        "exact": true,
        "strict": true,
        "lazy": true
    },
    {
        "path": "/",
        "component": _index,
        "name": "index",
        "exact": true,
        "strict": true,
        "lazy": false
    },
    {
        "path": "/page2",
        "component": _page2,
        "name": "page2",
        "exact": false,
        "strict": true,
        "lazy": false,
        "children": [
            {
                "path": "/page2/a",
                "component": _page2A,
                "name": "page2A",
                "exact": true,
                "strict": true,
                "lazy": false
            },
            {
                "path": "/page2/Page3",
                "component": _page2Page3,
                "name": "page2Page3",
                "exact": true,
                "strict": true,
                "lazy": false
            },
            {
                "path": "/page2/:id",
                "component": _page2Id,
                "name": "page2Id",
                "exact": true,
                "strict": true,
                "lazy": false
            },
            {
                "path": "/page2/:type/page5",
                "component": _page2TypePage5,
                "name": "page2TypePage5",
                "exact": true,
                "strict": true,
                "lazy": false
            }
        ]
    },
    {
        "path": "",
        "component": _error,
        "name": "error",
        "exact": true,
        "strict": true,
        "lazy": false
    }
];

export default routes;