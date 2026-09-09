import { apiFetch } from "./client";

export function listInvitations() {
  return apiFetch("/api/invitations", { auth: true });
}

export function getInvitation(id) {
  return apiFetch(`/api/invitations/${id}`, { auth: true });
}

export function createInvitation(recipientName) {
  return apiFetch("/api/invitations", {
    method: "POST",
    auth: true,
    body: { recipientName },
  });
}

export function markInvitationSeen(id) {
  return apiFetch(`/api/invitations/${id}/seen`, { method: "PATCH", auth: true });
}

export function getInvite(slug) {
  return apiFetch(`/api/invite/${slug}`);
}

export function respondToInvite(slug, { timeSlot, activity, location, meetingDate }) {
  return apiFetch(`/api/invite/${slug}/respond`, {
    method: "POST",
    body: { timeSlot, activity, location, meetingDate },
  });
}