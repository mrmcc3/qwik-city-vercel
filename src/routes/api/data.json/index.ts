import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = ({ request, response }) => {
  response.headers.set("cache-control", "s-maxage=10, stale-while-revalidate");
  return {
    timestamp: Date.now(),
    method: request.method,
    url: request.url,
  };
};
