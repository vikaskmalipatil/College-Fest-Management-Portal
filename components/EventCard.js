export default function EventCard({ event }) {
  return (
    <div className="card">
      <h3>{event.title}</h3>
      <p>Date: {event.date}</p>
      <p>Time: {event.time}</p>
      <p>Venue: {event.venue}</p>
    </div>
  );
}
