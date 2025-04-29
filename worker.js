const config = {
  domain: "mymancavestory.com",
  notionPageId: "1e0e9ab9c860805e8c24e00ffddc904e",
  addSlug: true,
  customUrlMappings: {},
  serveRobotsTxt: true
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (config.serveRobotsTxt && url.pathname === '/robots.txt') {
    return new Response("User-agent: *\nAllow: /", {
      headers: { "Content-Type": "text/plain" }
    });
  }

  if (config.customUrlMappings[url.pathname]) {
    const notionUrl = `https://www.notion.so/${config.notionPageId}/${config.customUrlMappings[url.pathname]}`;
    return Response.redirect(notionUrl, 301);
  }

  let notionUrl = `https://www.notion.so/${config.notionPageId}`;

  if (config.addSlug && url.pathname !== "/") {
    const slug = url.pathname.substring(1).replace(/\//g, "-");
    notionUrl += "-" + slug;
  }

  return Response.redirect(notionUrl, 301);
}
