-- Codexa: bring an existing Neon database up to database/schema.sql
-- Safe to run more than once. Only ADDS missing columns/tables; existing rows are kept.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 0) Match the type of users.id, whatever the existing table uses.
--    * text/varchar ids that are all UUIDs are converted to real uuid (values unchanged)
--    * any other type (e.g. integer/serial) is kept, and new tables link to it with the same type
DO $$
DECLARE
  t text;
BEGIN
  SELECT format_type(a.atttypid, a.atttypmod) INTO t
  FROM pg_attribute a
  WHERE a.attrelid = 'public.users'::regclass AND a.attname = 'id';

  IF t IN ('text', 'character varying') AND NOT EXISTS (
       SELECT 1 FROM public.users
       WHERE id::text !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
     ) THEN
    ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
    ALTER TABLE public.users ALTER COLUMN id TYPE uuid USING id::uuid;
    ALTER TABLE public.users ALTER COLUMN id SET DEFAULT gen_random_uuid();
    t := 'uuid';
  END IF;

  -- foreign keys need users.id to be unique
  IF NOT EXISTS (
    SELECT 1 FROM pg_index i
    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
    WHERE i.indrelid = 'public.users'::regclass AND i.indisunique
      AND i.indnatts = 1 AND a.attname = 'id'
  ) THEN
    ALTER TABLE public.users ADD CONSTRAINT users_id_unique UNIQUE (id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'codexa_user_id') THEN
    EXECUTE format('CREATE DOMAIN codexa_user_id AS %s', t);
  END IF;
END $$;

-- 1) Columns that may be missing on the tables that already exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS image text NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'student';
ALTER TABLE users ADD COLUMN IF NOT EXISTS points_earned integer NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE semesters ADD COLUMN IF NOT EXISTS year text;
ALTER TABLE semesters ADD COLUMN IF NOT EXISTS dept_id uuid REFERENCES departments(id) ON DELETE SET NULL;

-- 2) Every table from schema.sql (existing ones are skipped by IF NOT EXISTS)

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  email text NOT NULL UNIQUE,
  image text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'student',
  points_earned integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS semesters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  year text NOT NULL,
  dept_id uuid REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS semesters_courses (
  sem_id uuid NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  PRIMARY KEY (sem_id, course_id)
);

CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  semesterid uuid NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
  departmentid uuid REFERENCES departments(id) ON DELETE SET NULL,
  userid codexa_user_id REFERENCES users(id) ON DELETE SET NULL,
  isactive boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS sections_users (
  sectionid uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  userid codexa_user_id NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (sectionid, userid)
);

CREATE TABLE IF NOT EXISTS faculty_courses_section (
  courseid uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  sectionid uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  userid codexa_user_id NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (courseid, sectionid, userid)
);

CREATE TABLE IF NOT EXISTS problems (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  created_by codexa_user_id NOT NULL REFERENCES users(id),
  course uuid REFERENCES courses(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS problems_courses (
  problemid uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  courseid uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  PRIMARY KEY (problemid, courseid)
);

CREATE TABLE IF NOT EXISTS problems_users (
  userid codexa_user_id NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problemid uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  is_completed text NOT NULL DEFAULT 'unsolved',
  PRIMARY KEY (userid, problemid)
);

CREATE TABLE IF NOT EXISTS user_points_log (
  id uuid PRIMARY KEY,
  userid codexa_user_id NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problemid uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  points integer NOT NULL
);

CREATE TABLE IF NOT EXISTS problem_templates (
  problem_id uuid PRIMARY KEY REFERENCES problems(id) ON DELETE CASCADE,
  python text,
  java text,
  javascript text,
  c text,
  cpp text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testcases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  input text NOT NULL,
  output text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS problems_testcases (
  problem_id uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  testcase_id uuid NOT NULL REFERENCES testcases(id) ON DELETE CASCADE,
  PRIMARY KEY (problem_id, testcase_id)
);

CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS problems_tags (
  problem_id uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (problem_id, tag_id)
);

CREATE TABLE IF NOT EXISTS testcases_tags (
  testcase_id uuid NOT NULL REFERENCES testcases(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (testcase_id, tag_id)
);

CREATE TABLE IF NOT EXISTS contests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  created_by codexa_user_id NOT NULL REFERENCES users(id),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  duration_minutes integer,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contests_problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id uuid NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  problem_id uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  points integer NOT NULL DEFAULT 10,
  order_index integer,
  UNIQUE (contest_id, problem_id)
);

CREATE TABLE IF NOT EXISTS contests_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id uuid NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  UNIQUE (contest_id, section_id)
);

CREATE TABLE IF NOT EXISTS contest_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id uuid NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  user_id codexa_user_id NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  is_solved boolean NOT NULL DEFAULT false,
  points_earned integer NOT NULL DEFAULT 0,
  submission_time timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  UNIQUE (contest_id, user_id, problem_id)
);
