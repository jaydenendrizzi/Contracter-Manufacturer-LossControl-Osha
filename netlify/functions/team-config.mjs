// Only the project's public configuration is returned. No service-role key is needed.
export default async () => {
 const url=process.env.LC_SUPABASE_URL||'',key=process.env.LC_SUPABASE_PUBLISHABLE_KEY||'';
 let safe=false;
 try{const u=new URL(url);safe=u.protocol==='https:'&&u.hostname.endsWith('.supabase.co')&&!u.username&&!u.password&&!u.search&&!u.hash&&u.pathname==='/';}catch{}
 let role='';try{role=JSON.parse(Buffer.from(key.split('.')[1]||'','base64url').toString()).role;}catch{}
 if(!safe||(!key.startsWith('sb_publishable_')&&role!=='anon'))return Response.json({configured:false},{headers:{'Cache-Control':'no-store'}});
 return Response.json({configured:true,url:new URL(url).origin,key},{headers:{'Cache-Control':'no-store'}});
};
