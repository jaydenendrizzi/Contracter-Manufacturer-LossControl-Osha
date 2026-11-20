import assert from 'node:assert/strict';
import handler from '../netlify/functions/team-config.mjs';
const old={url:process.env.LC_SUPABASE_URL,key:process.env.LC_SUPABASE_PUBLISHABLE_KEY};
try{
 delete process.env.LC_SUPABASE_URL;delete process.env.LC_SUPABASE_PUBLISHABLE_KEY;
 assert.equal((await(await handler()).json()).configured,false);
 process.env.LC_SUPABASE_URL='https://dedicated-test.supabase.co';process.env.LC_SUPABASE_PUBLISHABLE_KEY='sb_secret_do-not-return';assert.equal((await(await handler()).json()).configured,false);
 const jwt=role=>'test.'+Buffer.from(JSON.stringify({role})).toString('base64url')+'.signature';
 process.env.LC_SUPABASE_PUBLISHABLE_KEY=jwt('service_role');assert.equal((await(await handler()).json()).configured,false);
 process.env.LC_SUPABASE_PUBLISHABLE_KEY='sb_publishable_synthetic';let r=await handler();assert.equal(r.headers.get('Cache-Control'),'no-store');assert.deepEqual(await r.json(),{configured:true,url:'https://dedicated-test.supabase.co',key:'sb_publishable_synthetic'});
 process.env.LC_SUPABASE_URL='https://dedicated-test.supabase.co.evil.test';assert.equal((await(await handler()).json()).configured,false);
 console.log('PASS: unconfigured local mode, no secret/service-role exposure, public project config and no-store response.');
}finally{if(old.url===undefined)delete process.env.LC_SUPABASE_URL;else process.env.LC_SUPABASE_URL=old.url;if(old.key===undefined)delete process.env.LC_SUPABASE_PUBLISHABLE_KEY;else process.env.LC_SUPABASE_PUBLISHABLE_KEY=old.key;}
