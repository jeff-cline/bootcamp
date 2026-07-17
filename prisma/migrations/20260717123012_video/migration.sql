-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "youtubeId" TEXT NOT NULL,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Video_isLive_idx" ON "Video"("isLive");
