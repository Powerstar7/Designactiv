/*
  # Fix Security Issues - Drop Unused Index

  1. Changes
     - Drop unused index `tool_videos_updated_by_idx` on `public.tool_videos`
       This index has never been queried and wastes storage/write performance.
*/

DROP INDEX IF EXISTS public.tool_videos_updated_by_idx;
