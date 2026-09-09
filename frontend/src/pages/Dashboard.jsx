import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listInvitations, markInvitationSeen } from "../api/invitations";
import { MAX_INVITATIONS, ACTIVITIES, TIME_SLOTS, LOCATIONS } from "../lib/catalog";
import Sparkles from "../components/Sparkles";
import InvitationAnswerCard from "../components/InvitationAnswerCard";

function activityLabel(id) {
  return ACTIVITIES.find((a) => a.id === id)?.label ?? "-";
}
function timeSlotLabel(id) {
  return TIME_SLOTS.find((t) => t.id === id)?.label ?? "-";
}
function locationLabel(id) {
  return LOCATIONS.find((l) => l.id === id)?.label ?? "-";
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openInvitation, setOpenInvitation] = useState(null);

  useEffect(() => {
    let cancelled = false;
    listInvitations()
      .then((data) => {
        if (!cancelled) setInvitations(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 401) logout();
        else setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [logout]);

  const remaining = MAX_INVITATIONS - invitations.length;

  async function handleOpen(inv) {
    if (inv.status !== "Completed") return;
    if (!inv.isSeenByOwner) {
      try {
        await markInvitationSeen(inv.id);
        setInvitations((list) =>
          list.map((i) => (i.id === inv.id ? { ...i, isSeenByOwner: true } : i))
        );
      } catch {
        /* rozet güncellenemese de kartı aç */
      }
    }
    setOpenInvitation(inv);
  }

  const openActivity = openInvitation
    ? ACTIVITIES.find((a) => a.id === openInvitation.activity)
    : null;
  const openTimeSlot = openInvitation
    ? TIME_SLOTS.find((t) => t.id === openInvitation.timeSlot)
    : null;

  return (
    <div className="page-scene">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="aurora aurora-c" />
      <Sparkles />

      <div className="dash-topbar">
        <span className="dash-topbar-brand">Davetio</span>
        <button
          type="button"
          className="btn dodge-glass dash-topbar-logout"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Çıkış yap
        </button>
      </div>

      <div className="dash-wrap">
        <div className="dash-header">
          <div>
            <h2 className="dash-title">Merhaba, {user?.username}</h2>
            <p className="dash-subtitle">
              {invitations.length}/{MAX_INVITATIONS} davet oluşturuldu · {remaining} hakkın kaldı
            </p>
          </div>
          <button
            className="btn hero-btn-yes"
            disabled={remaining <= 0}
            onClick={() => navigate("/invitations/new")}
          >
            + Yeni davet oluştur
          </button>
        </div>

        {loading ? (
          <div className="dash-empty">
            <p>Yükleniyor…</p>
          </div>
        ) : error ? (
          <div className="dash-empty">
            <p>{error}</p>
          </div>
        ) : invitations.length === 0 ? (
          <div className="dash-empty">
            <p>Henüz bir davet oluşturmadın. İlk davetini gönder!</p>
          </div>
        ) : (
          <div className="dash-list">
            {invitations.map((inv) => (
              <button
                key={inv.id}
                type="button"
                onClick={() => handleOpen(inv)}
                className="dash-item"
                style={{ cursor: inv.status === "Completed" ? "pointer" : "default" }}
              >
                <div>
                  <h3 className="dash-item-name">
                    {inv.recipientName}
                    {inv.status === "Completed" && !inv.isSeenByOwner && (
                      <span className="dash-badge-new">Yeni</span>
                    )}
                  </h3>
                  {inv.status === "Completed" ? (
                    <p className="dash-item-meta">
                      {activityLabel(inv.activity)} · {timeSlotLabel(inv.timeSlot)} ·{" "}
                      {locationLabel(inv.location)} · {inv.meetingDate}
                    </p>
                  ) : (
                    <p className="dash-item-meta">Henüz yanıtlamadı · link: /i/{inv.slug}</p>
                  )}
                </div>
                <span className={`dash-status ${inv.status === "Completed" ? "done" : "pending"}`}>
                  {inv.status === "Completed" ? "Tamamlandı" : "Bekliyor"}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {openInvitation && (
        <div className="modal-backdrop" onClick={() => setOpenInvitation(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <InvitationAnswerCard
              recipientName={openInvitation.recipientName}
              activity={openActivity}
              timeSlot={openTimeSlot}
              meetingDate={openInvitation.meetingDate}
              location={LOCATIONS.find((l) => l.id === openInvitation.location)?.label}
              onClose={() => setOpenInvitation(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}