SELECT
    u.user_id,
    u.full_name
FROM Users u
LEFT JOIN Registrations r
    ON u.user_id = r.user_id
WHERE u.registration_date >= CURRENT_DATE - INTERVAL 30 DAY
AND r.user_id IS NULL;