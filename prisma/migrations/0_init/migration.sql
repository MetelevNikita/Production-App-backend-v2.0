-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "message" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "tgid" VARCHAR NOT NULL,
    "typeproduct" VARCHAR,
    "otherproduct" VARCHAR,
    "promotion" VARCHAR NOT NULL,
    "typework" VARCHAR NOT NULL,
    "target" VARCHAR NOT NULL,
    "viewer" VARCHAR NOT NULL,
    "effect" VARCHAR,
    "description" VARCHAR NOT NULL,
    "voiceover" VARCHAR NOT NULL,
    "timing" VARCHAR NOT NULL,
    "place" VARCHAR,
    "technicalspecification" VARCHAR,
    "deadline" VARCHAR NOT NULL,
    "comment" VARCHAR,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);
