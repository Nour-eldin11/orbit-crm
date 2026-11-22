-- Orbit CRM SaaS schema for a new Supabase Postgres project.
-- Run once in the Supabase SQL editor, after reviewing the tables and policies.
create extension if not exists pgcrypto;

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 100),
  owner_id uuid not null references auth.users(id),
  plan text not null default 'starter' check (plan in ('starter','pro','business')),
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly','yearly')),
  subscription_status text not null default 'active' check (subscription_status in ('active','selected','past_due','cancelled')),
  created_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','member')),
  primary key (workspace_id,user_id)
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  customer_number bigint generated always as identity,
  name text not null check (length(trim(name)) between 1 and 120),
  company text not null default '',
  email text not null default '',
  phone text not null default '',
  status text not null default 'Prospect' check (status in ('Active','Prospect','Inactive')),
  role text not null default '',
  industry text not null default '',
  location text not null default '',
  team_size text not null default '',
  website text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  unique (workspace_id,id),
  unique (workspace_id,customer_number)
);

create function public.prevent_customer_number_change() returns trigger
language plpgsql as $$ begin
  if new.customer_number is distinct from old.customer_number or new.workspace_id is distinct from old.workspace_id then
    raise exception 'Customer ID and workspace cannot be changed';
  end if;
  return new;
end $$;
create trigger customer_number_immutable before update on public.customers
for each row execute function public.prevent_customer_number_change();

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  customer_id uuid,
  name text not null check (length(trim(name)) between 1 and 150),
  value numeric(14,2) not null default 0 check (value >= 0),
  stage text not null default 'Lead' check (stage in ('Lead','Contacted','Proposal','Negotiation','Won','Lost')),
  closing_date date,
  created_at timestamptz not null default now(),
  foreign key (workspace_id,customer_id) references public.customers(workspace_id,id) on delete set null (customer_id)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  customer_id uuid,
  title text not null check (length(trim(title)) between 1 and 150),
  priority text not null default 'Medium' check (priority in ('Low','Medium','High')),
  status text not null default 'To do' check (status in ('To do','In progress','Completed')),
  due_at timestamptz,
  created_at timestamptz not null default now(),
  foreign key (workspace_id,customer_id) references public.customers(workspace_id,id) on delete set null (customer_id)
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  customer_id uuid not null,
  title text not null,
  detail text not null default '',
  created_at timestamptz not null default now(),
  foreign key (workspace_id,customer_id) references public.customers(workspace_id,id) on delete cascade
);

create index customers_workspace_idx on public.customers(workspace_id,name);
create index deals_workspace_idx on public.deals(workspace_id,stage);
create index tasks_workspace_idx on public.tasks(workspace_id,due_at);
create index activities_customer_idx on public.activities(workspace_id,customer_id,created_at desc);

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.customers enable row level security;
alter table public.deals enable row level security;
alter table public.tasks enable row level security;
alter table public.activities enable row level security;

create policy own_membership on public.workspace_members for select to authenticated
using (user_id = (select auth.uid()));
create policy workspace_access on public.workspaces for select to authenticated
using (exists (select 1 from public.workspace_members m where m.workspace_id=workspaces.id and m.user_id=(select auth.uid())));

create function public.create_workspace(workspace_name text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
  if auth.uid() is null or length(trim(workspace_name)) not between 1 and 100 then
    raise exception 'Invalid workspace';
  end if;
  insert into public.workspaces(name,owner_id) values (trim(workspace_name),auth.uid()) returning id into new_id;
  insert into public.workspace_members(workspace_id,user_id,role) values (new_id,auth.uid(),'owner');
  return new_id;
end $$;
revoke all on function public.create_workspace(text) from public;
grant execute on function public.create_workspace(text) to authenticated;

-- Selecting a paid plan records intent only; no payment or paid access is granted.
create function public.choose_plan(target_workspace uuid,new_plan text,new_cycle text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or new_plan not in ('starter','pro','business') or new_cycle not in ('monthly','yearly') then
    raise exception 'Invalid plan';
  end if;
  update public.workspaces
    set plan=new_plan,billing_cycle=new_cycle,
        subscription_status=case when new_plan='starter' then 'active' else 'selected' end
    where id=target_workspace and owner_id=auth.uid();
  if not found then raise exception 'Workspace not found'; end if;
end $$;
revoke all on function public.choose_plan(uuid,text,text) from public;
grant execute on function public.choose_plan(uuid,text,text) to authenticated;

-- Every CRUD policy checks workspace membership; no account can query another tenant's rows.
do $$ declare table_name text;
begin
  foreach table_name in array array['customers','deals','tasks','activities'] loop
    execute format('create policy member_select on public.%I for select to authenticated using (exists (select 1 from public.workspace_members m where m.workspace_id=%I.workspace_id and m.user_id=(select auth.uid())))',table_name,table_name);
    execute format('create policy member_insert on public.%I for insert to authenticated with check (exists (select 1 from public.workspace_members m where m.workspace_id=%I.workspace_id and m.user_id=(select auth.uid())))',table_name,table_name);
    if table_name <> 'activities' then
      execute format('create policy member_update on public.%I for update to authenticated using (exists (select 1 from public.workspace_members m where m.workspace_id=%I.workspace_id and m.user_id=(select auth.uid()))) with check (exists (select 1 from public.workspace_members m where m.workspace_id=%I.workspace_id and m.user_id=(select auth.uid())))',table_name,table_name,table_name);
      execute format('create policy member_delete on public.%I for delete to authenticated using (exists (select 1 from public.workspace_members m where m.workspace_id=%I.workspace_id and m.user_id=(select auth.uid())))',table_name,table_name);
    end if;
  end loop;
end $$;
