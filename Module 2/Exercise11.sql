SELECT
    DATE(registration_date) AS registration_day,
    COUNT(user_id) AS user_count
FROM Users
WHERE registration_date >= CURRENT_DATE - INTERVAL 7 DAY
GROUP BY DATE(registration_date)
ORDER BY registration_day;
