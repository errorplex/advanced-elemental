CREATE TABLE "combinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"elements" varchar[] NOT NULL,
	"result" varchar NOT NULL,
	CONSTRAINT "combinations_elements_unique" UNIQUE("elements")
);
--> statement-breakpoint
CREATE TABLE "elements" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"emoji" varchar NOT NULL,
	"description" varchar NOT NULL,
	CONSTRAINT "elements_name_unique" UNIQUE("name")
);
