/*
  # Revoke public execute on handle_new_user

  1. Security Changes
    - Revoke EXECUTE permission on `public.handle_new_user()` from `anon` and `authenticated` roles
    - This function is a trigger function called only by the database internally, not via RPC

  2. Notes
    - The function remains callable by the trigger system (runs as the trigger owner)
    - Prevents unauthorized invocation via PostgREST `/rpc/handle_new_user`
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public;
