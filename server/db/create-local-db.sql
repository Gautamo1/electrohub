SELECT 'CREATE DATABASE electrohub'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'electrohub')\gexec
