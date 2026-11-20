CREATE TABLE "activity" (
	"id" serial PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"date" text NOT NULL,
	"status" text NOT NULL,
	CONSTRAINT "attendance_student_date" UNIQUE("student_id","date")
);
--> statement-breakpoint
CREATE TABLE "grades" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"term" text NOT NULL,
	"subject" text NOT NULL,
	"assignment" text NOT NULL,
	"score" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"enrollment_date" text NOT NULL,
	"grade_level" text NOT NULL,
	"address" text NOT NULL,
	"status" text DEFAULT 'Active' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;