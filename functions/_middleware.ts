export async function onRequest(context: any) {
  const url = new URL(context.request.url);
  const hostname = context.request.headers.get('host') || '';

  // Check if the user is visiting via the dev.arashyt.ca subdomain
  if (hostname.includes('dev.arashyt.ca')) {
    // Rewrite the root path '/' to serve the website manager '/dev'
    if (url.pathname === '/') {
      url.pathname = '/dev';
      
      // Perform a server-side rewrite using Pages static ASSETS binding
      const rewriteRequest = new Request(url.toString(), context.request);
      return context.env.ASSETS.fetch(rewriteRequest);
    }
  }

  // Continue to the next handler or static asset
  return context.next();
}
