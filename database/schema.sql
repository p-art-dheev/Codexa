CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
  userid uuid REFERENCES users(id) ON DELETE SET NULL,
  isactive boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS sections_users (
  sectionid uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  userid uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (sectionid, userid)
);

CREATE TABLE IF NOT EXISTS faculty_courses_section (
  courseid uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  sectionid uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  userid uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (courseid, sectionid, userid)
);

CREATE TABLE IF NOT EXISTS problems (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  created_by uuid NOT NULL REFERENCES users(id),
  course uuid REFERENCES courses(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS problems_courses (
  problemid uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  courseid uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  PRIMARY KEY (problemid, courseid)
);

CREATE TABLE IF NOT EXISTS problems_users (
  userid uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problemid uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  is_completed text NOT NULL DEFAULT 'unsolved',
  PRIMARY KEY (userid, problemid)
);

CREATE TABLE IF NOT EXISTS user_points_log (
  id uuid PRIMARY KEY,
  userid uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
  created_by uuid NOT NULL REFERENCES users(id),
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
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  is_solved boolean NOT NULL DEFAULT false,
  points_earned integer NOT NULL DEFAULT 0,
  submission_time timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  UNIQUE (contest_id, user_id, problem_id)
);
