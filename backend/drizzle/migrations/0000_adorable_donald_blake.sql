CREATE TABLE "surgeries" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"surgery_date" date,
	"weight" real,
	"surgery_type" varchar(20),
	"additional_info" text,
	"triage_agent_thread" varchar(100),
	"triage_agent_id" varchar(100),
	"dietician_agent_thread" varchar(100),
	"dietician_agent_id" varchar(100),
	"psychologist_agent_thread" varchar(100),
	"psychologist_agent_id" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
