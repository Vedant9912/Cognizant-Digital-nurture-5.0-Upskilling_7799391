SELECT
    organizer_id,
    status,
    COUNT(event_id) AS total_events
FROM Events
GROUP BY organizer_id, status
ORDER BY organizer_id;