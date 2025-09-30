-- password: Passw0rd!  (generate and replace the hash below if needed)
INSERT INTO users (email, password_hash, role)
VALUES
  ('admin@bseb.test', '$2a$10$q1xZk7cN5jS5mT/1VjY0je2Eo5h3mX9G1t9lB8t2U3iO0R6Gz5T5C', 'ADMIN'),
  ('teacher@bseb.test', '$2a$10$q1xZk7cN5jS5mT/1VjY0je2Eo5h3mX9G1t9lB8t2U3iO0R6Gz5T5C', 'TEACHER'),
  ('student@bseb.test', '$2a$10$q1xZk7cN5jS5mT/1VjY0je2Eo5h3mX9G1t9lB8t2U3iO0R6Gz5T5C', 'STUDENT');