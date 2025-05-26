import { httpRouter } from "convex/server";

const http = httpRouter();

// If you don't have any HTTP routes yet, this empty router is fine
// You can add routes later like:
// http.route({
//   path: "/webhook",
//   method: "POST",
//   handler: httpAction(async ({ runQuery, runMutation }, request) => {
//     // Handle webhook
//     return new Response("OK", { status: 200 });
//   }),
// });

export default http;