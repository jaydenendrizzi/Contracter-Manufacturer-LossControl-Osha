-- Dedicated Loss Control project. Never apply this to FleetReportCard or Farm Intelligence.
begin;
create table public.lc_organizations (
 id uuid primary key default gen_random_uuid(), name text not null check(length(name) between 1 and 200)
);
create table public.lc_memberships (
 organization_id uuid not null references public.lc_organizations(id), user_id uuid not null references auth.users(id),
 role text not null check(role in ('admin','rep')), primary key(organization_id,user_id)
);
create function public.lc_member(org uuid, admin_only boolean default false) returns boolean
language sql stable security definer set search_path=public,pg_temp as $$
 select exists(select 1 from lc_memberships where organization_id=org and user_id=auth.uid() and (not admin_only or role='admin'));
$$;
revoke all on function public.lc_member(uuid,boolean) from public;
grant execute on function public.lc_member(uuid,boolean) to authenticated;
create sequence public.lc_change_sequence;
create table public.lc_records (
 organization_id uuid not null references public.lc_organizations(id), kind text not null check(kind in ('client','visit','draft','catalog')),
 record_id text not null check(length(record_id) between 1 and 200), payload jsonb, deleted boolean not null default false,
 revision bigint not null default 1, change_sequence bigint not null default nextval('public.lc_change_sequence'),
 owner_id uuid references auth.users(id), updated_by uuid not null references auth.users(id), updated_at timestamptz not null default now(),
 primary key(organization_id,kind,record_id), check(deleted or jsonb_typeof(payload)='object')
);
create index lc_records_changes on public.lc_records(organization_id,change_sequence);
create table public.lc_record_history (
 organization_id uuid not null, kind text not null, record_id text not null, revision bigint not null,
 payload jsonb, deleted boolean not null, owner_id uuid, updated_by uuid not null, updated_at timestamptz not null,
 primary key(organization_id,kind,record_id,revision)
);
alter table public.lc_organizations enable row level security;
alter table public.lc_memberships enable row level security;
alter table public.lc_records enable row level security;
alter table public.lc_record_history enable row level security;
create policy lc_org_read on public.lc_organizations for select to authenticated using(public.lc_member(id));
create policy lc_membership_read on public.lc_memberships for select to authenticated using(user_id=auth.uid());
create policy lc_record_read on public.lc_records for select to authenticated using(public.lc_member(organization_id) and (kind<>'draft' or owner_id=auth.uid()));
create policy lc_history_read on public.lc_record_history for select to authenticated using(public.lc_member(organization_id) and (kind<>'draft' or owner_id=auth.uid()));
revoke all on public.lc_organizations,public.lc_memberships,public.lc_records,public.lc_record_history from anon,authenticated;
grant select on public.lc_organizations,public.lc_memberships,public.lc_records,public.lc_record_history to authenticated;
revoke all on sequence public.lc_change_sequence from anon,authenticated;

-- Both RPCs serialize per organization. A pull cannot skip a sequence assigned by an uncommitted push.
create function public.lc_valid_photos(body jsonb) returns boolean language sql stable as $$
 with recursive values_to_check(value,field) as (
  select body,''::text
  union all
  select child.value,child.key from values_to_check v cross join lateral (
   select key,value from jsonb_each(case when jsonb_typeof(v.value)='object' then v.value else '{}'::jsonb end)
   union all
   select v.field,value from jsonb_array_elements(case when jsonb_typeof(v.value)='array' then v.value else '[]'::jsonb end)
  ) child
 ) select not exists(select 1 from values_to_check where field in ('__proto__','constructor','prototype')
  or field in ('photos','photo','completionPhotos','afterPhotos') and jsonb_typeof(value)='string' and value#>>'{}'<>''
  and value#>>'{}' !~ '^rr-photo:(shared|[0-9a-f-]{36})/[0-9a-f]{64}\.(jpg|png|webp)$'
  or field in ('photos','photo','completionPhotos','afterPhotos') and jsonb_typeof(value)='string' and value#>>'{}'<>'' and split_part(value#>>'{}','/',1) not in ('rr-photo:shared','rr-photo:'||auth.uid()::text));
$$;
revoke all on function public.lc_valid_photos(jsonb) from public;
create function public.lc_pull(org uuid, after_sequence bigint default 0, page_size integer default 50) returns jsonb
language plpgsql security definer set search_path=public,pg_temp as $$
declare rows jsonb;
begin
 if not lc_member(org) then raise exception 'Team access required' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtextextended(org::text,17));
 select coalesce(jsonb_agg(to_jsonb(r) order by r.change_sequence),'[]'::jsonb) into rows
 from (select * from lc_records where organization_id=org and change_sequence>greatest(after_sequence,0)
 and (kind<>'draft' or owner_id=auth.uid()) order by change_sequence limit least(greatest(page_size,1),100)) r;
 return rows;
end;
$$;
create function public.lc_photos_exist(body jsonb,org uuid) returns boolean language sql stable security definer set search_path=public,pg_temp as $$
 with recursive values_to_check(value) as (
  select body
  union all
  select child.value from values_to_check v cross join lateral (
   select value from jsonb_each(case when jsonb_typeof(v.value)='object' then v.value else '{}'::jsonb end)
   union all select value from jsonb_array_elements(case when jsonb_typeof(v.value)='array' then v.value else '[]'::jsonb end)
  ) child
 ) select not exists(select 1 from values_to_check v where jsonb_typeof(value)='string' and value#>>'{}' like 'rr-photo:%'
 and not exists(select 1 from storage.objects o where o.bucket_id='lc-photos' and o.name=org::text||'/'||substring(v.value#>>'{}' from 10)));
$$;
revoke all on function public.lc_photos_exist(jsonb,uuid) from public;
create function public.lc_valid_catalog(body jsonb) returns boolean language plpgsql immutable as $$
declare section jsonb; item jsonb; ids text[]='{}'; question_ids text[]='{}';
begin
 if body->'reviewed' is distinct from 'true'::jsonb or length(trim(coalesce(body->>'version',''))) not between 1 and 80
 or jsonb_typeof(body->'sections') is distinct from 'array' then return false; end if;
 if jsonb_array_length(body->'sections')>200 then return false; end if;
 if body ? 'contentReviews' and jsonb_typeof(body->'contentReviews') is distinct from 'array' then return false; end if;
 for section in select value from jsonb_array_elements(body->'sections') loop
  if coalesce(section->>'id','')='' or section->>'id'=any(ids) or coalesce(section->>'name','')=''
   or jsonb_typeof(section->'items') is distinct from 'array' or jsonb_typeof(section->'sectors') is distinct from 'array' then return false; end if;
  if jsonb_array_length(section->'items')=0 or jsonb_array_length(section->'sectors')=0 then return false; end if;
  if exists(select 1 from jsonb_array_elements_text(section->'sectors') s where s not in ('mfg','con')) then return false; end if;
  ids=array_append(ids,section->>'id');
  for item in select value from jsonb_array_elements(section->'items') loop
   if coalesce(item->>'id','')='' or item->>'id'=any(question_ids) or coalesce(item->>'q','')='' then return false; end if;
   question_ids=array_append(question_ids,item->>'id');
  end loop;
 end loop;
 return true;
end;
$$;
revoke all on function public.lc_valid_catalog(jsonb) from public;
create function public.lc_push(org uuid, operations jsonb) returns jsonb
language plpgsql security definer set search_path=public,pg_temp as $$
declare op jsonb; current_row lc_records; result jsonb='[]'; k text; rid text; expected bigint; gone boolean; body jsonb;
begin
 if not lc_member(org) then raise exception 'Team access required' using errcode='42501'; end if;
 if jsonb_typeof(operations)<>'array' or jsonb_array_length(operations)>100 then raise exception 'Invalid sync batch'; end if;
 perform pg_advisory_xact_lock(hashtextextended(org::text,17));
 for op in select value from jsonb_array_elements(operations) loop
  k=op->>'kind'; rid=op->>'record_id'; expected=(op->>'expected_revision')::bigint; gone=coalesce((op->>'deleted')::boolean,false); body=op->'payload';
  if k not in ('client','visit','draft','catalog') or rid is null or length(rid) not between 1 and 200 or expected is null or expected<0 then raise exception 'Invalid record'; end if;
  if k='catalog' and (not lc_member(org,true) or rid<>'sections') then raise exception 'Lead access required' using errcode='42501'; end if;
  if not gone then
   if jsonb_typeof(body)<>'object' or octet_length(body::text)>1500000 then raise exception 'Record too large or invalid'; end if;
   if k='client' and (body->>'id' is distinct from rid or coalesce(body->>'displayName','')='') then raise exception 'Invalid client'; end if;
   if k='visit' and (body->>'id' is distinct from rid or coalesce(body->>'company','')='' or jsonb_typeof(body->'findings') is distinct from 'array') then raise exception 'Invalid visit'; end if;
   if k='draft' and (body->>'started' is distinct from rid or coalesce(body->>'company','')='') then raise exception 'Invalid draft'; end if;
   if k='catalog' and not lc_valid_catalog(body) then raise exception 'A reviewed version with valid sections and unique question IDs is required'; end if;
   if body::text ~ 'data:image/' then raise exception 'Upload photos before syncing records'; end if;
   if k='draft' and body::text like '%rr-photo:shared/%' then raise exception 'Unfinished visit photos must be private'; end if;
   if k<>'draft' and body::text ~ 'rr-photo:[0-9a-f-]{36}/' then raise exception 'Shared records need shared photos'; end if;
   if not lc_valid_photos(body) then raise exception 'Invalid photo reference'; end if;
   if not lc_photos_exist(body,org) then raise exception 'A referenced photo is not uploaded'; end if;
  end if;
  select * into current_row from lc_records where organization_id=org and kind=k and record_id=rid;
  if k='catalog' and current_row.payload->>'version'=body->>'version' and current_row.payload->'sections' is distinct from body->'sections' then raise exception 'Use a new version when section wording changes'; end if;
  if found and k='draft' and current_row.owner_id<>auth.uid() then raise exception 'This draft belongs to another rep' using errcode='42501'; end if;
  if coalesce(current_row.revision,0)<>expected then
   -- A lost response may safely retry an identical record, without a second revision.
   if current_row.deleted=gone and (gone or current_row.payload=body) then
    result=result||jsonb_build_array(jsonb_build_object('status','accepted','record',to_jsonb(current_row))); continue;
   end if;
   result=result||jsonb_build_array(jsonb_build_object('status','conflict','kind',k,'record_id',rid,'record',case when current_row.revision is null then null else to_jsonb(current_row) end)); continue;
  end if;
  if k='draft' and current_row.revision is null and gone then continue; end if;
  insert into lc_records(organization_id,kind,record_id,payload,deleted,owner_id,updated_by)
   values(org,k,rid,case when gone then null else body end,gone,case when k='draft' then auth.uid() end,auth.uid())
   on conflict(organization_id,kind,record_id) do update set payload=excluded.payload,deleted=excluded.deleted,
    revision=lc_records.revision+1,change_sequence=nextval('lc_change_sequence'),updated_at=now(),updated_by=auth.uid()
   returning * into current_row;
  insert into lc_record_history select organization_id,kind,record_id,revision,payload,deleted,owner_id,updated_by,updated_at from lc_records
   where organization_id=org and kind=k and record_id=rid;
  result=result||jsonb_build_array(jsonb_build_object('status','accepted','record',to_jsonb(current_row)));
 end loop;
 return result;
end;
$$;
revoke all on function public.lc_pull(uuid,bigint,integer),public.lc_push(uuid,jsonb) from public;
grant execute on function public.lc_pull(uuid,bigint,integer),public.lc_push(uuid,jsonb) to authenticated;

-- Immutable content-addressed objects. Team members read/upload; no browser overwrites/deletes.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('lc-photos','lc-photos',false,10485760,array['image/jpeg','image/png','image/webp']);
create function public.lc_photo_member(object_name text) returns boolean
language plpgsql stable security definer set search_path=public,pg_temp as $$
begin
 if object_name !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/(shared|[0-9a-f-]{36})/[0-9a-f]{64}\.(jpg|png|webp)$' then return false; end if;
 return lc_member(split_part(object_name,'/',1)::uuid) and split_part(object_name,'/',2) in ('shared',auth.uid()::text);
end;
$$;
revoke all on function public.lc_photo_member(text) from public;
grant execute on function public.lc_photo_member(text) to authenticated;
create policy lc_photo_read on storage.objects for select to authenticated
 using(bucket_id='lc-photos' and public.lc_photo_member(name));
create policy lc_photo_insert on storage.objects for insert to authenticated
 with check(bucket_id='lc-photos' and public.lc_photo_member(name));

commit;
