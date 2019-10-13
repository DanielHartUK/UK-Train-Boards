    var Ziggy = {
        namedRoutes: {"home":{"uri":"\/","methods":["GET","HEAD"],"domain":null},"departures":{"uri":"departures\/{stn}\/{page}","methods":["GET","HEAD"],"domain":null},"arrivals":{"uri":"arrivals\/{stn}\/{page}","methods":["GET","HEAD"],"domain":null},"assets.lang":{"uri":"js\/lang.js","methods":["GET","HEAD"],"domain":null}},
        baseUrl: 'http://localhost/',
        baseProtocol: 'http',
        baseDomain: 'localhost',
        basePort: false,
        defaultParameters: []
    };

    if (typeof window.Ziggy !== 'undefined') {
        for (var name in window.Ziggy.namedRoutes) {
            Ziggy.namedRoutes[name] = window.Ziggy.namedRoutes[name];
        }
    }

    export {
        Ziggy
    }
