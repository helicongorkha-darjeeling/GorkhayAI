-- Restaurant and travel-agency enquiries use their own website starting prices.
-- Safe to re-run: replaces whatever check currently guards property_type.
do $$
declare
  cname text;
begin
  for cname in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'leads'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%property_type%'
  loop
    execute format('alter table public.leads drop constraint %I', cname);
  end loop;
end $$;

alter table public.leads
  drop constraint if exists leads_property_type_check;

alter table public.leads
  add constraint leads_property_type_check
  check (
    property_type is null
    or property_type in ('hotel', 'homestay', 'resort', 'restaurant', 'travel_agency', 'other')
  );
