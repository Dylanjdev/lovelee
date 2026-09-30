-- Install or refresh the public bulk calendar submission RPC.
-- This assumes the shared calendar's submit_calendar_event function already exists.

begin;

create or replace function public.submit_calendar_events(
  p_events jsonb,
  p_submitter_name text,
  p_submitter_email text
)
returns uuid[]
language plpgsql
security definer
set search_path = ''
as $$
declare
  event_data jsonb;
  event_number integer := 0;
  new_event_id uuid;
  new_event_ids uuid[] := '{}'::uuid[];
begin
  if jsonb_typeof(p_events) is distinct from 'array' then
    raise exception 'Events must be provided as a list.';
  end if;

  if jsonb_array_length(p_events) not between 1 and 100 then
    raise exception 'Submit between 1 and 100 events at a time.';
  end if;

  for event_data in
    select value from jsonb_array_elements(p_events)
  loop
    event_number := event_number + 1;

    if jsonb_typeof(event_data) is distinct from 'object' then
      raise exception 'Event % must contain event details.', event_number;
    end if;

    begin
      select public.submit_calendar_event(
        p_title => event_data ->> 'title',
        p_description => event_data ->> 'description',
        p_start_at => nullif(event_data ->> 'start_at', '')::timestamptz,
        p_end_at => nullif(event_data ->> 'end_at', '')::timestamptz,
        p_all_day => coalesce(nullif(event_data ->> 'all_day', '')::boolean, false),
        p_location_name => event_data ->> 'location_name',
        p_address => event_data ->> 'address',
        p_website_url => event_data ->> 'website_url',
        p_category => event_data ->> 'category',
        p_submitter_name => p_submitter_name,
        p_submitter_email => p_submitter_email
      )
      into new_event_id;
    exception
      when others then
        raise exception 'Event %: %', event_number, sqlerrm;
    end;

    new_event_ids := array_append(new_event_ids, new_event_id);
  end loop;

  return new_event_ids;
end;
$$;

revoke all on function public.submit_calendar_events(jsonb, text, text) from public;
grant execute on function public.submit_calendar_events(jsonb, text, text)
  to anon, authenticated;

commit;
