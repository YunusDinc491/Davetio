import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getInvitation, markInvitationSeen } from "../api/invitations";
import { ACTIVITIES, TIME_SLOTS, LOCATIONS } from "../lib/catalog";

export default function InvitationCard() {
  const { id } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getInvitation(id)
      .then((data) => {
        if (cancelled) return;
        setInvitation(data);
        if (data.status === "Completed" && !data.isSeenByOwner) {
          markInvitationSeen(id).catch(() => { });
        }
      })
      .catch(() => {
        if (!cancelled) setInvitation(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <div className="card">
          <p>Yükleniyor…</p>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="page">
        <div className="card">
          <p>Davet bulunamadı.</p>
          <Link to="/dashboard" className="btn btn-ghost">
            Panele dön
          </Link>
        </div>
      </div>
    );
  }

  const activity = ACTIVITIES.find((a) => a.id === invitation.activity);
  const timeSlot = TIME_SLOTS.find((t) => t.id === invitation.timeSlot);
  const location = LOCATIONS.find((l) => l.id === invitation.location);
  return (
    <div className="page">
      <div className="card" style={{ textAlign: "center", maxWidth: 440 }}>
        <div style={{ fontSize: "2.6rem", marginBottom: 8 }}>{activity?.emoji ?? "🎉"}</div>
        <h2>{invitation.recipientName} kabul etti!</h2>
        <p style={{ marginBottom: 24 }}>Buluşma planınız hazır 💗</p>

        <div style={{ display: "grid", gap: 12, textAlign: "left" }}>
          <InfoRow label="Aktivite" value={activity?.label} />
          <InfoRow label="Zaman dilimi" value={`${timeSlot?.label} (${timeSlot?.range})`} />
          <InfoRow label="Tarih" value={invitation.meetingDate} />
          <InfoRow label="Yer" value={location?.label} />
        </div>

        <Link to="/dashboard" className="btn btn-ghost" style={{ marginTop: 24, display: "inline-block" }}>
          Panele dön
        </Link>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div
      style={{
        background: "var(--pink-50)",
        borderRadius: "var(--radius-sm)",
        padding: "10px 14px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span style={{ color: "var(--ink-soft)", fontWeight: 600 }}>{label}</span>
      <span style={{ color: "var(--ink)", fontWeight: 700 }}>{value}</span>
    </div>
  );
}