-- CreateTable
CREATE TABLE "public"."festive_dates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "icon" TEXT NOT NULL DEFAULT 'heart',
    "gradient" TEXT NOT NULL DEFAULT 'from-purple-500 to-pink-600',
    "bgGradient" TEXT NOT NULL DEFAULT 'from-purple-50 to-pink-50',
    "items" TEXT[] DEFAULT ARRAY['Elementos varios']::TEXT[],
    "sectionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "festive_dates_pkey" PRIMARY KEY ("id")
);
