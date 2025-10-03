-- Manually confirm the existing user's email
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmation_sent_at = NULL 
WHERE email = 'svmayurkaarthic@gmail.com' 
  AND email_confirmed_at IS NULL;