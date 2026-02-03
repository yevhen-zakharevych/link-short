---
description: Read this file to understand how to fetch data in this project.
---

# Data Fetching Guidelines

This document outlines the best practices and methods for fetching data in this Next.js project.

## 1. Use Server Components for Data Fetching

In Next.js, ALWAYS use Server Components for data fetching. Never use Client Components for this purpose.

## 2. Data Fetching Methods

ALWAYS use the helper functions in the /data directory for data fetching. NEVER fetch data directly within your components.

ALL helper functions in the /data directory should use the Drizzle ORM for database interactions.
