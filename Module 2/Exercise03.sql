SELECT
    u.user_id,
    u.full_name
FROM Users u
WHERE u.user_id NOT IN (
    SELECT r.user_id
    FROM Registrations r
    JOIN Events e
        ON r.event_id = e.event_id
    WHERE e.start_date >= CURRENT_DATE - INTERVAL 90 DAY
);