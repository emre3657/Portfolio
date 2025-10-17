export const config = {
  runtime: "edge", // this must be set to `edge`
  // execute this function on fra1, based on the connecting client location
  regions: ["fra1"],
};

export default async () =>
  new Response(
    JSON.stringify({
      edge: true,
      region: process.env.VERCEL_REGION || null,
    }),
    { headers: { "content-type": "application/json" } }
  );
